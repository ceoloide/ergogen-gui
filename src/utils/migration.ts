import {
  CONFIG_LOCAL_STORAGE_KEY,
  LEGACY_CONFIG_STORAGE_KEY,
  MULTI_CONFIG_STORAGE_KEY,
  MULTI_CONFIG_VERSION
} from '../context/constants';
import { MultiConfigStorage } from '../context/types';
import { v4 as uuidv4 } from 'uuid';

export const migrateLegacyConfig = (): MultiConfigStorage | null => {
  const existingMultiConfig = localStorage.getItem(MULTI_CONFIG_STORAGE_KEY);
  if (existingMultiConfig) {
    try {
      return JSON.parse(existingMultiConfig);
    } catch (e) {
      console.error('Failed to parse existing multi-config storage', e);
    }
  }

  let legacyConfig: string | null = null;

  const legacyValue = localStorage.getItem(LEGACY_CONFIG_STORAGE_KEY);
  if (legacyValue) {
    try {
      legacyConfig = JSON.parse(legacyValue);
    } catch (e) {
      legacyConfig = legacyValue;
    }
    localStorage.removeItem(LEGACY_CONFIG_STORAGE_KEY);
  }

  const ergogenConfigValue = localStorage.getItem(CONFIG_LOCAL_STORAGE_KEY);
  if (ergogenConfigValue) {
    try {
      const parsed = JSON.parse(ergogenConfigValue);
      if (!legacyConfig || parsed) {
        legacyConfig = parsed;
      }
    } catch (e) {
      if (!legacyConfig || ergogenConfigValue) {
        legacyConfig = ergogenConfigValue;
      }
    }
    localStorage.removeItem(CONFIG_LOCAL_STORAGE_KEY);
  }

  if (legacyConfig) {
    const id = uuidv4();
    const newStorage: MultiConfigStorage = {
      version: MULTI_CONFIG_VERSION,
      configs: [
        {
          id,
          name: 'Legacy Config',
          content: legacyConfig,
        },
      ],
      activeConfigId: id,
    };
    localStorage.setItem(MULTI_CONFIG_STORAGE_KEY, JSON.stringify(newStorage));
    return newStorage;
  }

  return null;
};
