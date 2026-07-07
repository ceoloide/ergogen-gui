import { getErgogenVersionInfo } from './version';
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
