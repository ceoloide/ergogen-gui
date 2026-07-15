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

  it('should fetch direct file URLs from Codeberg without searching config.yaml', async () => {
    const provider = gitProviderRegistry.resolve(
      'https://codeberg.org/cerement/cinereus-pe/src/branch/main/cinereus-pe/cinereus-pe.yaml'
    );
    expect(provider).toBeDefined();

    // Mock global fetch
    const originalFetch = global.fetch;
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('test config content'),
    });
    global.fetch = mockFetch;

    try {
      const result = await provider?.fetchConfig(
        'https://codeberg.org/cerement/cinereus-pe/src/branch/main/cinereus-pe/cinereus-pe.yaml'
      );

      expect(mockFetch).toHaveBeenCalledWith(
        'https://codeberg.org/cerement/cinereus-pe/raw/branch/main/cinereus-pe/cinereus-pe.yaml'
      );
      expect(result?.config).toBe('test config content');
      expect(result?.footprints).toEqual([]);
      expect(result?.outlines).toEqual([]);
      expect(result?.templates).toEqual([]);
    } finally {
      global.fetch = originalFetch;
    }
  });
});
