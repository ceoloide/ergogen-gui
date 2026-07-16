import {
  filterInjectionsByFeatureFlags,
  getSkippedInjectionsWarning,
  checkForDeprecationWarnings,
  preparePreviewConfig,
} from './generationHelpers';
import { isFeatureEnabled } from './featureFlags';

vi.mock('./featureFlags', () => ({
  isFeatureEnabled: jest.fn(() => true),
}));

describe('generationHelpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('filterInjectionsByFeatureFlags', () => {
    it('should return undefined/null if input is undefined/null', () => {
      expect(filterInjectionsByFeatureFlags(undefined)).toBeUndefined();
      const nilVal = null as any;
      expect(filterInjectionsByFeatureFlags(nilVal)).toBeNull();
    });

    it('should pass through injections when feature flags are enabled', () => {
      (isFeatureEnabled as jest.Mock).mockReturnValue(true);
      const injections = [
        ['outline', 'my-outline', 'content'],
        ['template', 'my-template', 'content'],
        ['footprint', 'my-footprint', 'content'],
      ];
      expect(filterInjectionsByFeatureFlags(injections)).toEqual(injections);
    });

    it('should filter out outlines when outlines feature is disabled', () => {
      (isFeatureEnabled as jest.Mock).mockImplementation((feature) => {
        return feature !== 'outlines';
      });
      const injections = [
        ['outline', 'my-outline', 'content'],
        ['template', 'my-template', 'content'],
        ['footprint', 'my-footprint', 'content'],
      ];
      const expected = [
        ['template', 'my-template', 'content'],
        ['footprint', 'my-footprint', 'content'],
      ];
      expect(filterInjectionsByFeatureFlags(injections)).toEqual(expected);
    });

    it('should filter out templates when templates feature is disabled', () => {
      (isFeatureEnabled as jest.Mock).mockImplementation((feature) => {
        return feature !== 'templates';
      });
      const injections = [
        ['outline', 'my-outline', 'content'],
        ['template', 'my-template', 'content'],
        ['footprint', 'my-footprint', 'content'],
      ];
      const expected = [
        ['outline', 'my-outline', 'content'],
        ['footprint', 'my-footprint', 'content'],
      ];
      expect(filterInjectionsByFeatureFlags(injections)).toEqual(expected);
    });
  });

  describe('checkForDeprecationWarnings', () => {
    it('should return null for empty/invalid configurations', () => {
      expect(checkForDeprecationWarnings(undefined)).toBeNull();
      expect(checkForDeprecationWarnings({})).toBeNull();
      expect(checkForDeprecationWarnings({ pcbs: {} })).toBeNull();
    });

    it('should return warning when KiCad 5 (or default kicad5 template) is used with ceoloide footprints', () => {
      const config = {
        pcbs: {
          myBoard: {
            template: 'kicad5',
            footprints: {
              promicro: {
                what: 'ceoloide/promicro',
              },
            },
          },
        },
      };
      expect(checkForDeprecationWarnings(config)).toContain(
        'KiCad 5 is deprecated'
      );
    });

    it('should return warning when no template (defaults to kicad5) is used with ceoloide footprints', () => {
      const config = {
        pcbs: {
          myBoard: {
            footprints: {
              promicro: {
                what: 'ceoloide/promicro',
              },
            },
          },
        },
      };
      expect(checkForDeprecationWarnings(config)).toContain(
        'KiCad 5 is deprecated'
      );
    });

    it('should return null when KiCad 8 template is specified', () => {
      const config = {
        pcbs: {
          myBoard: {
            template: 'kicad8',
            footprints: {
              promicro: {
                what: 'ceoloide/promicro',
              },
            },
          },
        },
      };
      expect(checkForDeprecationWarnings(config)).toBeNull();
    });

    it('should return null when non-ceoloide footprints are used on KiCad 5', () => {
      const config = {
        pcbs: {
          myBoard: {
            template: 'kicad5',
            footprints: {
              promicro: {
                what: 'peraph/promicro',
              },
            },
          },
        },
      };
      expect(checkForDeprecationWarnings(config)).toBeNull();
    });
  });

  describe('preparePreviewConfig', () => {
    it('should return unchanged config if pointsonly option is false or undefined', () => {
      const config = {
        points: { key: 'value' },
        pcbs: { board: {} },
        cases: { case1: {} },
      };
      expect(preparePreviewConfig(config, false)).toEqual(config);
      expect(preparePreviewConfig(config, undefined)).toEqual(config);
    });

    it('should strip pcbs and cases when pointsonly is true and points exists', () => {
      const config = {
        points: { key: 'value' },
        pcbs: { board: {} },
        cases: { case1: {} },
      };
      const expected = {
        points: { key: 'value' },
        pcbs: undefined,
        cases: undefined,
      };
      expect(preparePreviewConfig(config, true)).toEqual(expected);
    });

    it('should return unchanged config if points does not exist even when pointsonly is true', () => {
      const config = {
        pcbs: { board: {} },
        cases: { case1: {} },
      };
      expect(preparePreviewConfig(config, true)).toEqual(config);
    });
  });

  describe('getSkippedInjectionsWarning', () => {
    it('should return null if no outlines or templates are injected', () => {
      const injections = [['footprint', 'my-fp', 'content']];
      expect(getSkippedInjectionsWarning(injections)).toBeNull();
    });

    it('should return warning when outlines feature is disabled and outlines are injected', () => {
      (isFeatureEnabled as jest.Mock).mockImplementation((feature) => {
        return feature !== 'outlines';
      });
      const injections = [
        ['outline', 'my-outline', 'content'],
        ['footprint', 'my-fp', 'content'],
      ];
      expect(getSkippedInjectionsWarning(injections)).toBe(
        'Custom outlines were skipped because the respective feature flags are disabled in settings.'
      );
    });

    it('should return warning when templates feature is disabled and templates are injected', () => {
      (isFeatureEnabled as jest.Mock).mockImplementation((feature) => {
        return feature !== 'templates';
      });
      const injections = [
        ['template', 'my-template', 'content'],
        ['footprint', 'my-fp', 'content'],
      ];
      expect(getSkippedInjectionsWarning(injections)).toBe(
        'Custom templates were skipped because the respective feature flags are disabled in settings.'
      );
    });

    it('should return combined warning when both are disabled and injected', () => {
      (isFeatureEnabled as jest.Mock).mockImplementation(() => false);
      const injections = [
        ['outline', 'my-outline', 'content'],
        ['template', 'my-template', 'content'],
      ];
      expect(getSkippedInjectionsWarning(injections)).toBe(
        'Custom outlines and templates were skipped because the respective feature flags are disabled in settings.'
      );
    });
  });
});
