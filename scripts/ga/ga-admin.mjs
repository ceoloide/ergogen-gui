#!/usr/bin/env node
/**
 * Sets up or tears down the GA4 property configuration declared in
 * ga-config.mjs, using the Google Analytics Admin API.
 *
 * Usage:
 *   pnpm ga:setup    -- --property <id> [--stream <id>] [--prune-retired] [--apply]
 *   pnpm ga:teardown -- --property <id> [--apply --confirm <id>]
 *
 * Both commands are dry runs unless --apply is passed. Teardown also requires
 * --confirm with the same property ID, because archiving custom dimensions
 * and metrics hides their history from reports and cannot be undone.
 *
 * Authentication (first match wins):
 *   GA_ACCESS_TOKEN       An OAuth access token with the analytics.edit scope.
 *   GA_SERVICE_ACCOUNT    A service account email to impersonate. The script
 *                         asks gcloud for your user token and exchanges it for
 *                         a scoped token through the IAM Credentials API.
 *   (neither)             `gcloud auth application-default print-access-token`.
 *
 * GA_PROPERTY_ID can be used instead of --property.
 */
import { execFileSync } from 'node:child_process';
import { gaConfig } from './ga-config.mjs';
import { planSetup, planTeardown } from './plan.mjs';

const ADMIN_API = 'https://analyticsadmin.googleapis.com';
const EDIT_SCOPE = 'https://www.googleapis.com/auth/analytics.edit';

const USAGE = `Usage:
  node scripts/ga/ga-admin.mjs setup    --property <id> [--stream <id>] [--prune-retired] [--apply]
  node scripts/ga/ga-admin.mjs teardown --property <id> [--apply --confirm <id>]`;

export const parseArgs = (argv) => {
  const [command, ...rest] = argv;
  const options = { command, apply: false, pruneRetired: false };
  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];
    const next = () => {
      const value = rest[index + 1];
      if (value === undefined || value.startsWith('--')) {
        throw new Error(`${arg} needs a value.`);
      }
      index += 1;
      return value;
    };
    if (arg === '--') continue;
    else if (arg === '--apply') options.apply = true;
    else if (arg === '--prune-retired') options.pruneRetired = true;
    else if (arg === '--property') options.property = next();
    else if (arg === '--stream') options.stream = next();
    else if (arg === '--confirm') options.confirm = next();
    else throw new Error(`Unknown option ${arg}.`);
  }
  options.property ??= process.env.GA_PROPERTY_ID;
  return options;
};

const gcloud = (args) =>
  execFileSync('gcloud', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();

const getAccessToken = async () => {
  if (process.env.GA_ACCESS_TOKEN) return process.env.GA_ACCESS_TOKEN;

  const serviceAccount = process.env.GA_SERVICE_ACCOUNT;
  if (serviceAccount) {
    // gcloud's own impersonation ignores --scopes, so ask IAM Credentials for
    // a token that carries the Analytics scope.
    const userToken = gcloud(['auth', 'print-access-token']);
    const response = await fetch(
      `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${encodeURIComponent(serviceAccount)}:generateAccessToken`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scope: [EDIT_SCOPE], lifetime: '900s' }),
      }
    );
    const body = await response.json();
    if (!response.ok) {
      throw new Error(
        `Could not impersonate ${serviceAccount}: ${body.error?.message ?? response.status}`
      );
    }
    return body.accessToken;
  }

  return gcloud(['auth', 'application-default', 'print-access-token']);
};

const createClient = (token) => {
  const call = async (method, path, body) => {
    const response = await fetch(`${ADMIN_API}/${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await response.text();
    const json = text ? JSON.parse(text) : {};
    if (!response.ok) {
      throw new Error(
        `${method} ${path} failed (${response.status}): ${json.error?.message ?? text}`
      );
    }
    return json;
  };

  const list = async (path, field) => {
    const items = [];
    let pageToken;
    do {
      const query = new URLSearchParams({ pageSize: '200' });
      if (pageToken) query.set('pageToken', pageToken);
      const page = await call('GET', `${path}?${query}`);
      items.push(...(page[field] ?? []));
      pageToken = page.nextPageToken;
    } while (pageToken);
    return items;
  };

  return { call, list };
};

const pickWebStream = (streams, requested, property) => {
  const webStreams = streams.filter(
    (stream) => stream.type === 'WEB_DATA_STREAM'
  );
  if (requested) {
    const match = webStreams.find(
      (stream) => stream.name === `${property}/dataStreams/${requested}`
    );
    if (!match)
      throw new Error(`Web stream ${requested} not found in ${property}.`);
    return match;
  }
  if (webStreams.length === 1) return webStreams[0];
  if (webStreams.length === 0) return null;
  throw new Error(
    `Several web streams found; pass --stream with one of: ${webStreams
      .map(
        (stream) =>
          `${stream.name.split('/').pop()} (${stream.webStreamData?.defaultUri})`
      )
      .join(', ')}`
  );
};

const readCurrentState = async (client, property, streamId) => {
  const [customDimensions, customMetrics, keyEvents, streams, dataRetention] =
    await Promise.all([
      client.list(`v1beta/${property}/customDimensions`, 'customDimensions'),
      client.list(`v1beta/${property}/customMetrics`, 'customMetrics'),
      client.list(`v1beta/${property}/keyEvents`, 'keyEvents'),
      client.list(`v1beta/${property}/dataStreams`, 'dataStreams'),
      client.call('GET', `v1beta/${property}/dataRetentionSettings`),
    ]);
  const stream = pickWebStream(streams, streamId, property);
  const enhancedMeasurement = stream
    ? await client.call(
        'GET',
        `v1alpha/${stream.name}/enhancedMeasurementSettings`
      )
    : null;
  return {
    stream,
    customDimensions,
    customMetrics,
    keyEvents,
    enhancedMeasurement,
    dataRetention,
  };
};

const describeAction = (action) => {
  const subject =
    action.label ??
    action.body?.parameterName ??
    action.body?.eventName ??
    action.name?.split('/').slice(-2).join('/') ??
    '';
  const detail = action.updateMask
    ? ` (${action.updateMask
        .split(',')
        .map((field) => `${field} → ${JSON.stringify(action.body[field])}`)
        .join(', ')})`
    : '';
  return `${action.kind} ${subject}${detail}`.trim();
};

const applyAction = async (client, property, current, action) => {
  const mask = (path) =>
    `${path}?updateMask=${encodeURIComponent(action.updateMask)}`;
  switch (action.kind) {
    case 'createCustomDimension':
      return client.call(
        'POST',
        `v1beta/${property}/customDimensions`,
        action.body
      );
    case 'createCustomMetric':
      return client.call(
        'POST',
        `v1beta/${property}/customMetrics`,
        action.body
      );
    case 'createKeyEvent':
      return client.call('POST', `v1beta/${property}/keyEvents`, action.body);
    case 'updateCustomDimension':
    case 'updateCustomMetric':
      return client.call('PATCH', mask(`v1beta/${action.name}`), action.body);
    case 'archiveCustomDimension':
    case 'archiveCustomMetric':
      return client.call('POST', `v1beta/${action.name}:archive`, {});
    case 'deleteKeyEvent':
      return client.call('DELETE', `v1beta/${action.name}`);
    case 'updateEnhancedMeasurement':
      return client.call(
        'PATCH',
        mask(`v1alpha/${current.stream.name}/enhancedMeasurementSettings`),
        action.body
      );
    case 'updateDataRetention':
      return client.call(
        'PATCH',
        mask(`v1beta/${property}/dataRetentionSettings`),
        action.body
      );
    default:
      throw new Error(`Unknown action ${action.kind}`);
  }
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));
  if (!['setup', 'teardown'].includes(options.command) || !options.property) {
    console.error(USAGE);
    process.exit(2);
  }
  const property = `properties/${options.property.replace(/^properties\//, '')}`;
  const propertyId = property.split('/')[1];

  if (
    options.command === 'teardown' &&
    options.apply &&
    options.confirm !== propertyId
  ) {
    console.error(
      `Teardown archives every managed dimension and metric in ${property}, hiding their history from reports.\nRe-run with --confirm ${propertyId} to proceed.`
    );
    process.exit(2);
  }

  const client = createClient(await getAccessToken());
  const current = await readCurrentState(client, property, options.stream);
  const plan =
    options.command === 'setup'
      ? planSetup({
          current,
          desired: gaConfig,
          pruneRetired: options.pruneRetired,
        })
      : planTeardown({ current, desired: gaConfig });

  console.log(
    `GA ${options.command} for ${property}${current.stream ? ` (stream ${current.stream.webStreamData?.defaultUri})` : ''}`
  );
  for (const warning of plan.warnings) console.warn(`warning: ${warning}`);
  if (plan.actions.length === 0) {
    console.log('Nothing to change.');
    return;
  }
  for (const action of plan.actions)
    console.log(`  - ${describeAction(action)}`);

  if (!options.apply) {
    console.log(
      `\nDry run: ${plan.actions.length} change(s) planned. Re-run with --apply to make them.`
    );
    return;
  }

  let failures = 0;
  for (const action of plan.actions) {
    try {
      await applyAction(client, property, current, action);
      console.log(`  ✓ ${describeAction(action)}`);
    } catch (error) {
      failures += 1;
      console.error(`  ✗ ${describeAction(action)}: ${error.message}`);
    }
  }
  if (failures > 0) {
    console.error(`\n${failures} of ${plan.actions.length} change(s) failed.`);
    process.exit(1);
  }
  console.log(`\nApplied ${plan.actions.length} change(s).`);
};

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
