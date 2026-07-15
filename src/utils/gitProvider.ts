export interface GitHubFootprint {
  name: string;
  content: string;
}

export interface ErgogenWorkspaceBundle {
  config: string;
  footprints: GitHubFootprint[];
  outlines: GitHubFootprint[];
  templates: GitHubFootprint[];
  configPath: string;
  rateLimitWarning?: string;
}

export interface GitProvider {
  canHandle(url: string): boolean;
  fetchConfig(url: string): Promise<ErgogenWorkspaceBundle>;
}

// Global registry of providers
class GitProviderRegistry {
  private providers: GitProvider[] = [];

  register(provider: GitProvider) {
    this.providers.push(provider);
  }

  resolve(url: string): GitProvider | null {
    for (const provider of this.providers) {
      if (provider.canHandle(url)) {
        return provider;
      }
    }
    return null;
  }
}

export const gitProviderRegistry = new GitProviderRegistry();
