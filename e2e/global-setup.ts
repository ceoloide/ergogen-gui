import type { FullConfig } from '@playwright/test';

// Every project names the production build its server must serve.
export default async function verifyProductionBuild(config: {
  projects: Pick<FullConfig['projects'][number], 'metadata'>[];
}) {
  for (const { metadata } of config.projects) {
    const { baseURL, buildId } = metadata;
    const url = new URL(
      'build-id.txt',
      `${String(baseURL).replace(/\/$/, '')}/`
    );
    const response = await fetch(url.href);
    const actual = (await response.text()).trim();
    if (!response.ok || actual !== buildId) {
      throw new Error(
        `Browser tests reached the wrong build at ${url.href}: expected ${buildId}, got ${actual}`
      );
    }
  }
}
