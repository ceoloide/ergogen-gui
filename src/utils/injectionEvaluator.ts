import * as makerjs from 'makerjs';
import * as ergogenUtils from 'ergogen/src/utils';
import * as ergogenAssert from 'ergogen/src/assert';
import * as ergogenOperation from 'ergogen/src/operation';
import * as ergogenPoint from 'ergogen/src/point';
import * as ergogenPrepare from 'ergogen/src/prepare';
import * as ergogenAnchor from 'ergogen/src/anchor';
import * as ergogenFilter from 'ergogen/src/filter';
import ergogenPkg from 'ergogen/package.json';

/**
 * Custom require function that runs in the browser / worker context.
 * It resolves required modules to their pre-bundled or local references.
 */
const customRequire = (moduleName: string): unknown => {
  const cleanName = moduleName.replace(/^(\.\.\/|\.\/)+/, ''); // Remove leading '../' or './'

  if (cleanName === 'makerjs') {
    return makerjs;
  }
  if (
    cleanName === 'utils' ||
    cleanName === 'utils.js' ||
    cleanName.endsWith('/utils') ||
    cleanName.endsWith('/utils.js')
  ) {
    return ergogenUtils;
  }
  if (
    cleanName === 'assert' ||
    cleanName === 'assert.js' ||
    cleanName.endsWith('/assert') ||
    cleanName.endsWith('/assert.js')
  ) {
    return ergogenAssert;
  }
  if (
    cleanName === 'operation' ||
    cleanName === 'operation.js' ||
    cleanName.endsWith('/operation') ||
    cleanName.endsWith('/operation.js')
  ) {
    return ergogenOperation;
  }
  if (
    cleanName === 'point' ||
    cleanName === 'point.js' ||
    cleanName.endsWith('/point') ||
    cleanName.endsWith('/point.js')
  ) {
    return ergogenPoint;
  }
  if (
    cleanName === 'prepare' ||
    cleanName === 'prepare.js' ||
    cleanName.endsWith('/prepare') ||
    cleanName.endsWith('/prepare.js')
  ) {
    return ergogenPrepare;
  }
  if (
    cleanName === 'anchor' ||
    cleanName === 'anchor.js' ||
    cleanName.endsWith('/anchor') ||
    cleanName.endsWith('/anchor.js')
  ) {
    return ergogenAnchor;
  }
  if (
    cleanName === 'filter' ||
    cleanName === 'filter.js' ||
    cleanName.endsWith('/filter') ||
    cleanName.endsWith('/filter.js')
  ) {
    return ergogenFilter;
  }

  if (
    cleanName === 'package.json' ||
    cleanName.endsWith('/package.json') ||
    cleanName === 'packages.json' ||
    cleanName.endsWith('/packages.json')
  ) {
    return ergogenPkg;
  }

  throw new Error(`Cannot find module '${moduleName}' in worker context`);
};

/**
 * Compiles and instantiates a custom JavaScript injection module in the worker context.
 * Binds a custom `require` function to handle local module resolution.
 */
export const createInjectionModule = (injText: string): unknown => {
  const module_prefix = 'const module = {};\n\n';
  const module_suffix = '\n\nreturn module.exports;';

  const fn = new Function('require', module_prefix + injText + module_suffix);

  return fn(customRequire);
};
