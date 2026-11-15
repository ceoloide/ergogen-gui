import { isIP } from 'node:net';

/**
 * A Chromium flag that makes every host name fail to resolve, while the test
 * server's address still works.
 */
export const resolveNoHostName =
  '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1';

/**
 * Chromium flags that keep a browser's requests to other hosts off the
 * network. A proxy from the environment would resolve host names itself, so
 * the browser connects directly. Chromium Headless Shell ignores
 * `--no-proxy-server` when `https_proxy` is set.
 */
export const reachNoHostName = [resolveNoHostName, '--proxy-server=direct://'];

/** True for a host that only a DNS lookup can reach: not an IP or localhost. */
export const isHostName = (hostname: string) => {
  const host = hostname.replace(/^\[|\]$/g, '');
  return (
    isIP(host) === 0 && host !== 'localhost' && !host.endsWith('.localhost')
  );
};
