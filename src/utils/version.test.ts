import { getErgogenVersionInfo } from './version';

describe('getErgogenVersionInfo', () => {
  const defaultVersion = 'v4.2.1';
  const defaultUrl = 'https://github.com/ergogen/ergogen';

  it('returns default version when no version is provided', () => {
    expect(getErgogenVersionInfo()).toEqual({
      label: defaultVersion,
      url: defaultUrl,
    });
  });

  it('returns "latest" for official repo', () => {
    expect(getErgogenVersionInfo('ergogen/ergogen')).toEqual({
      label: 'latest',
      url: 'https://github.com/ergogen/ergogen',
    });
  });

  it('returns branch name for official repo with branch', () => {
    expect(getErgogenVersionInfo('ergogen/ergogen#develop')).toEqual({
      label: 'develop',
      url: 'https://github.com/ergogen/ergogen/tree/develop',
    });
  });

  it('returns full clean string for custom repo', () => {
    expect(getErgogenVersionInfo('ceoloide/ergogen')).toEqual({
      label: 'ceoloide/ergogen',
      url: 'https://github.com/ceoloide/ergogen',
    });
  });

  it('returns full clean string for custom repo with branch', () => {
    expect(getErgogenVersionInfo('ceoloide/ergogen#v4.3.0')).toEqual({
      label: 'ceoloide/ergogen#v4.3.0',
      url: 'https://github.com/ceoloide/ergogen/tree/v4.3.0',
    });
  });

  it('handles "github:" prefix correctly', () => {
    expect(getErgogenVersionInfo('github:ceoloide/ergogen#develop')).toEqual({
      label: 'ceoloide/ergogen#develop',
      url: 'https://github.com/ceoloide/ergogen/tree/develop',
    });
  });

  it('handles NPM versions', () => {
    expect(getErgogenVersionInfo('ergogen@4.2.0')).toEqual({
      label: 'ergogen@4.2.0',
      url: 'https://github.com/ergogen/ergogen/releases/tag/v4.2.0',
    });
  });
});
