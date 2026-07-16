import { createInjectionModule } from './injectionEvaluator';

describe('injectionEvaluator', () => {
  it('should evaluate an injection with no require statement', () => {
    // Arrange
    const injectionCode = `
      module.exports = (a, b) => a + b;
    `;

    // Act
    const fn = createInjectionModule(injectionCode) as (
      ...args: unknown[]
    ) => unknown;

    // Assert
    expect(typeof fn).toBe('function');
    expect(fn(2, 3)).toBe(5);
  });

  it('should evaluate an injection that requires makerjs', () => {
    // Arrange
    const injectionCode = `
      const m = require('makerjs');
      module.exports = () => {
        return new m.paths.Line([0, 0], [0, 10]);
      };
    `;

    // Act
    const fn = createInjectionModule(injectionCode) as () => any;

    // Assert
    expect(typeof fn).toBe('function');
    const path = fn();
    expect(path.type).toBe('line');
    expect(path.origin).toEqual([0, 0]);
    expect(path.end).toEqual([0, 10]);
  });

  it('should evaluate an injection that requires utils', () => {
    // Arrange
    const injectionCode = `
      const u = require('../utils');
      module.exports = (paths, config, name, points, outlines, units) => {
        return u.svg_paths_to_outline(paths, config, name, points, outlines, units);
      };
    `;

    // Act
    const fn = createInjectionModule(injectionCode);

    // Assert
    expect(typeof fn).toBe('function');
    // Verify that the helper exists on the required utils
    // (We don't need to perform a full process run here, just check that the dependency got loaded and is callable)
    expect(fn).toBeDefined();
  });

  it('should throw an error when requiring an unknown module', () => {
    // Arrange
    const injectionCode = `
      const fs = require('fs');
      module.exports = () => fs.readFileSync('test');
    `;

    // Act & Assert
    expect(() => {
      createInjectionModule(injectionCode);
    }).toThrow("Cannot find module 'fs' in worker context");
  });

  it('should resolve package.json in worker context', () => {
    // Arrange
    const injectionCode = `
      const pkg = require('../../package.json');
      module.exports = () => pkg.version;
    `;

    // Act
    const fn = createInjectionModule(injectionCode) as () => string;

    // Assert
    expect(typeof fn).toBe('function');
    expect(typeof fn()).toBe('string');
  });
});
