import ergogenPkg from 'ergogen/package.json';
import {
  ENGINE_FEATURES,
  engineHasFeature,
  installedEngineVersion,
  meetsEngineRequirement,
} from './engineRequirements';

// src/setupTests.tsx fixes installedEngineVersion to the canonical version for
// GUI tests; this file tests the real function.
vi.unmock('./engineRequirements');

describe('meetsEngineRequirement', () => {
  it('applies the engine rule: same major, at least the minor and patch', () => {
    expect(meetsEngineRequirement('4.3.0', '4.3.0')).toBe(true);
    expect(meetsEngineRequirement('4.3.1', '4.3.0')).toBe(true);
    expect(meetsEngineRequirement('4.4.0', '4.3.5')).toBe(true);
    expect(meetsEngineRequirement('4.2.1', '4.3.0')).toBe(false);
    expect(meetsEngineRequirement('4.3.0', '4.3.1')).toBe(false);
    expect(meetsEngineRequirement('5.0.0', '4.3.0')).toBe(false);
  });

  it('reads short, prefixed and pre-release versions like the engine', () => {
    expect(meetsEngineRequirement('4.3.0', '4.3')).toBe(true);
    expect(meetsEngineRequirement('4.3.0', 'v4')).toBe(true);
    expect(meetsEngineRequirement('4.3.0-develop', '4.3.0')).toBe(true);
  });

  it('is never met by a requirement the engine could not read', () => {
    expect(meetsEngineRequirement('4.3.0', 'latest')).toBe(false);
    expect(meetsEngineRequirement('4.3.0', '4.3.0.1')).toBe(false);
  });
});

describe('engineHasFeature', () => {
  it('compares the engine version with the feature requirement', () => {
    // Arrange
    const required = ENGINE_FEATURES.templates;
    // Act / Assert
    expect(engineHasFeature('templates', required)).toBe(true);
    expect(engineHasFeature('templates', '4.2.1')).toBe(false);
    expect(engineHasFeature('outlines', '4.4.0')).toBe(true);
  });

  it('needs only at least the feature version, whatever the major version', () => {
    // Act / Assert
    expect(engineHasFeature('templates', '5.0.0')).toBe(true);
    expect(engineHasFeature('templates', 'latest')).toBe(false);
  });
});

describe('installedEngineVersion', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('is the installed package version, whatever identity is displayed', () => {
    // Arrange: a display identity that names a newer engine than is installed.
    vi.stubEnv('VITE_ERGOGEN_VERSION', 'github:ergogen/ergogen#v9.9.9');
    // Act / Assert
    expect(installedEngineVersion()).toBe(ergogenPkg.version);
  });
});
