import { isIP } from 'node:net';

/**
 * A Chromium flag that makes every host name fail to resolve, while the test
 * server's address still works.
 */
export const resolveNoHostName =
  '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1';

/** True for a host that only a DNS lookup can reach: not an IP or localhost. */
export const isHostName = (hostname: string) => {
  const host = hostname.replace(/^\[|\]$/g, '');
  return (
    isIP(host) === 0 && host !== 'localhost' && !host.endsWith('.localhost')
  );
};
