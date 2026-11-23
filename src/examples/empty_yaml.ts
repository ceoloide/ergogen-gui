import type { ConfigExample } from './index';

/**
 * An empty Ergogen configuration skeleton.
 * This provides a starting point for creating a new keyboard layout from scratch.
 * @type {ConfigExample}
 */
const EmptyYAML: ConfigExample = {
  label: 'Empty YAML configuration',
  author: 'ceoloide',
  value: `meta:
  engine: 4.1.0
units:
points:
  zones:
    matrix:
outlines:
pcbs:
cases:
`,
};

export default EmptyYAML;
