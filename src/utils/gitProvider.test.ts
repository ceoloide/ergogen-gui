import { gitProviderRegistry } from './gitProvider';
import './github';
import './codeberg';

describe('gitProviderRegistry', () => {
  it('should resolve github.com URLs to GitHubProvider', () => {
    const url = 'https://github.com/ceoloide/ergogen-gui';
    const provider = gitProviderRegistry.resolve(url);
    expect(provider).toBeDefined();
    expect(provider?.canHandle(url)).toBe(true);
  });

  it('should resolve simple owner/repo paths to GitHubProvider by default', () => {
    const url = 'ceoloide/ergogen-gui';
    const provider = gitProviderRegistry.resolve(url);
    expect(provider).toBeDefined();
    expect(provider?.canHandle(url)).toBe(true);
  });

  it('should resolve codeberg.org URLs to CodebergProvider', () => {
    const url = 'https://codeberg.org/ceoloide/ergogen-gui';
    const provider = gitProviderRegistry.resolve(url);
    expect(provider).toBeDefined();
    expect(provider?.canHandle(url)).toBe(true);
    expect(provider?.canHandle('https://github.com/ceoloide/ergogen-gui')).toBe(
      false
    );
  });
});
