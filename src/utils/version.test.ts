import {
  getErgogenVersionInfo,
  getFullErgogenVersion,
  parseVersion,
  compareVersions,
  getSemverFromErgogenVersion,
  isCustomErgogenVersion,
} from './version';
import ergogenPkg from 'ergogen/package.json';

describe('getErgogenVersionInfo', () => {
  const defaultVersion = ergogenPkg.version;
  const defaultVersionLabel = `v${defaultVersion}`;
  const defaultUrl = 'https://github.com/ergogen/ergogen';

  it('returns default version when no version is provided', () => {
    expect(getErgogenVersionInfo()).toEqual({
      label: defaultVersionLabel,
      url: defaultUrl,
      displayText: defaultVersion,
      isCustom: false,
      isHash: false,
      isTag: false,
    });
  });

  it('returns "latest" for official repo', () => {
    expect(getErgogenVersionInfo('ergogen/ergogen')).toEqual({
      label: 'latest',
      url: 'https://github.com/ergogen/ergogen',
      displayText: defaultVersion,
      isCustom: false,
      isHash: false,
      isTag: false,
    });
  });

  it('returns branch name for official repo with branch', () => {
    expect(getErgogenVersionInfo('ergogen/ergogen#develop')).toEqual({
      label: 'develop',
      url: 'https://github.com/ergogen/ergogen/tree/develop',
      displayText: 'develop',
      isCustom: true,
      isHash: false,
      isTag: true,
    });
  });

  it('returns full clean string for custom repo', () => {
    expect(getErgogenVersionInfo('ceoloide/ergogen')).toEqual({
      label: 'ceoloide/ergogen',
      url: 'https://github.com/ceoloide/ergogen',
      displayText: defaultVersion,
      isCustom: true,
      isHash: false,
      isTag: false,
    });
  });

  it('returns full clean string for custom repo with branch', () => {
    expect(getErgogenVersionInfo('ceoloide/ergogen#v4.3.0')).toEqual({
      label: 'ceoloide/ergogen#v4.3.0',
      url: 'https://github.com/ceoloide/ergogen/tree/v4.3.0',
      displayText: 'v4.3.0',
      isCustom: true,
      isHash: false,
      isTag: true,
    });
  });

  it('handles "github:" prefix correctly', () => {
    expect(getErgogenVersionInfo('github:ceoloide/ergogen#develop')).toEqual({
      label: 'ceoloide/ergogen#develop',
      url: 'https://github.com/ceoloide/ergogen/tree/develop',
      displayText: 'develop',
      isCustom: true,
      isHash: false,
      isTag: true,
    });
  });

  it('handles NPM versions', () => {
    expect(getErgogenVersionInfo('ergogen@4.2.0')).toEqual({
      label: 'ergogen@4.2.0',
      url: 'https://github.com/ergogen/ergogen/releases/tag/v4.2.0',
      displayText: '4.2.0',
      isCustom: true,
      isHash: false,
      isTag: true,
    });
  });

  it('handles 40-character commit hashes correctly', () => {
    const fullHash = 'fb2509f8e404b9015c7e3ebbd6931754020a2e0a';
    expect(
      getErgogenVersionInfo(`github:ceoloide/ergogen#${fullHash}`)
    ).toEqual({
      label: `ceoloide/ergogen#${fullHash}`,
      url: `https://github.com/ceoloide/ergogen/commit/${fullHash}`,
      displayText: 'fb2509f',
      isCustom: true,
      isHash: true,
      isTag: false,
    });
  });
});

describe('getFullErgogenVersion', () => {
  const defaultVersion = ergogenPkg.version;

  it('returns default version when no version is provided', () => {
    expect(getFullErgogenVersion()).toBe(
      `github:ergogen/ergogen#v${defaultVersion}`
    );
    expect(getFullErgogenVersion('undefined')).toBe(
      `github:ergogen/ergogen#v${defaultVersion}`
    );
    expect(getFullErgogenVersion('null')).toBe(
      `github:ergogen/ergogen#v${defaultVersion}`
    );
  });

  it('returns formatted version for official repo without branch', () => {
    expect(getFullErgogenVersion('ergogen/ergogen')).toBe(
      `github:ergogen/ergogen#v${defaultVersion}`
    );
  });

  it('returns branch name for official repo with branch', () => {
    expect(getFullErgogenVersion('ergogen/ergogen#develop')).toBe(
      'github:ergogen/ergogen#develop'
    );
  });

  it('returns default version tag for custom repo without branch', () => {
    expect(getFullErgogenVersion('ceoloide/ergogen')).toBe(
      `github:ceoloide/ergogen#v${defaultVersion}`
    );
  });

  it('returns custom repo with branch name', () => {
    expect(getFullErgogenVersion('ceoloide/ergogen#v4.3.0')).toBe(
      'github:ceoloide/ergogen#v4.3.0'
    );
  });

  it('handles github: prefix correctly', () => {
    expect(getFullErgogenVersion('github:ceoloide/ergogen#develop')).toBe(
      'github:ceoloide/ergogen#develop'
    );
  });

  it('handles NPM versions', () => {
    expect(getFullErgogenVersion('ergogen@4.2.0')).toBe(
      'github:ergogen/ergogen#v4.2.0'
    );
  });

  it('handles custom NPM packages', () => {
    expect(getFullErgogenVersion('my-fork-ergogen@4.2.0')).toBe(
      'github:my-fork-ergogen#v4.2.0'
    );
  });

  it('handles 40-character commit hashes correctly', () => {
    const fullHash = 'fb2509f8e404b9015c7e3ebbd6931754020a2e0a';
    expect(getFullErgogenVersion(`github:ceoloide/ergogen#${fullHash}`)).toBe(
      `github:ceoloide/ergogen#${fullHash}`
    );
  });
});

describe('parseVersion and compareVersions', () => {
  it('correctly parses semver strings', () => {
    expect(parseVersion('1.2.3')).toEqual([1, 2, 3]);
    expect(parseVersion('v0.8.9')).toEqual([0, 8, 9]);
    expect(parseVersion('10.20.30-beta')).toEqual([10, 20, 30]);
    expect(parseVersion('invalid')).toBeNull();
  });

  it('compares parsed versions correctly', () => {
    expect(compareVersions([4, 3, 0], [4, 2, 1])).toBe(true);
    expect(compareVersions([4, 3, 0], [4, 3, 0])).toBe(true);
    expect(compareVersions([5, 0, 0], [4, 3, 0])).toBe(true);
    expect(compareVersions([4, 2, 1], [4, 3, 0])).toBe(false);
    expect(compareVersions([3, 9, 9], [4, 0, 0])).toBe(false);
  });
});

describe('getSemverFromErgogenVersion', () => {
  it('extracts semver from various formats', () => {
    expect(getSemverFromErgogenVersion('github:ergogen/ergogen#v4.2.1')).toBe(
      '4.2.1'
    );
    expect(getSemverFromErgogenVersion('github:ceoloide/ergogen#v4.3.0')).toBe(
      '4.3.0'
    );
    expect(getSemverFromErgogenVersion('ergogen@4.2.0')).toBe('4.2.0');
    expect(
      getSemverFromErgogenVersion('github:ceoloide/ergogen#develop')
    ).toBeNull();
  });
});

describe('isCustomErgogenVersion', () => {
  it('identifies custom forks', () => {
    expect(isCustomErgogenVersion('github:ceoloide/ergogen#v4.3.0')).toBe(true);
    expect(isCustomErgogenVersion('github:ergogen/ergogen#v4.2.1')).toBe(false);
    expect(isCustomErgogenVersion('ergogen@4.2.0')).toBe(false);
    expect(isCustomErgogenVersion('4.2.0')).toBe(false);
  });
});
