import type { FullConfig } from '@playwright/test';

export default async function verifyProductionBuild(
  config: Pick<FullConfig, 'metadata'>
) {
  const { baseURL, buildId } = config.metadata;
  const response = await fetch(`${baseURL}/build-id.txt`);
  const actual = (await response.text()).trim();
  if (!response.ok || actual !== buildId) {
    throw new Error(
      `Browser tests reached the wrong build: expected ${buildId}, got ${actual}`
    );
  }
}
