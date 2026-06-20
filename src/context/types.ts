export interface Configuration {
  id: string;
  name: string;
  content: string;
}

export interface MultiConfigStorage {
  version: number;
  configs: Configuration[];
  activeConfigId: string;
}
