import { migrateLegacyConfig } from './migration';
import {
  LEGACY_CONFIG_STORAGE_KEY,
  CONFIG_LOCAL_STORAGE_KEY,
  MULTI_CONFIG_STORAGE_KEY
} from '../context/constants';

describe('migrateLegacyConfig', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should return existing multi-config if present', () => {
    const existing = { version: 1, configs: [], activeConfigId: '' };
    localStorage.setItem(MULTI_CONFIG_STORAGE_KEY, JSON.stringify(existing));
    expect(migrateLegacyConfig()).toEqual(existing);
  });

  it('should migrate from LEGACY_CONFIG_STORAGE_KEY', () => {
    localStorage.setItem(LEGACY_CONFIG_STORAGE_KEY, JSON.stringify('legacy content'));
    const result = migrateLegacyConfig();
    expect(result?.configs[0].content).toBe('legacy content');
    expect(result?.configs[0].name).toBe('Legacy Config');
    expect(localStorage.getItem(LEGACY_CONFIG_STORAGE_KEY)).toBeNull();
  });

  it('should migrate from CONFIG_LOCAL_STORAGE_KEY', () => {
    localStorage.setItem(CONFIG_LOCAL_STORAGE_KEY, JSON.stringify('ergogen content'));
    const result = migrateLegacyConfig();
    expect(result?.configs[0].content).toBe('ergogen content');
    expect(localStorage.getItem(CONFIG_LOCAL_STORAGE_KEY)).toBeNull();
  });
});
