import Absolem from './absolem';
import Atreus from './atreus';
import Adux from './adux';
import CorneyIsland from './corney-island';
import EmptyYAML from './empty_yaml';
import Wubbo from './wubbo';
import Sweeplike from './sweeplike';
import Reviung41 from './reviung41';
import Tiny20 from './tiny20';
import Alpha from './alpha';
import Plank from './plank';

/**
 * Represents a group of configuration options for the react-select component.
 * @interface GroupedOption
 * @property {string} label - The label for the group.
 * @property {readonly ConfigOption[]} options - An array of configuration options within this group.
 */
interface GroupedOption {
  readonly label: string;
  readonly options: readonly ConfigOption[];
}

/**
 * Represents a single configuration option.
 * @interface ConfigOption
 * @property {string} value - The actual configuration content (e.g., YAML string).
 * @property {string} label - The display name for the option.
 */
export interface ConfigOption {
  readonly value: string;
  readonly label: string;
}

/**
 * Represents a specific configuration example, extending the base ConfigOption.
 * @interface ConfigExample
 * @extends {ConfigOption}
 * @property {string} author - The author or source of the example.
 */
export interface ConfigExample extends ConfigOption {
  readonly label: string;
  readonly value: string;
  readonly author: string;
}

const emptyExamples = [EmptyYAML];

const simpleExamples = [Absolem, Atreus];

const completeExamples = [Adux, CorneyIsland, Sweeplike, Reviung41, Tiny20];

const miscExamples = [Wubbo, Alpha, Plank];

/**
 * An array of grouped example configurations to be displayed in the select dropdown.
 * @type {readonly GroupedOption[]}
 */
export const exampleOptions: readonly GroupedOption[] = [
  {
    label: 'Empty configurations',
    options: emptyExamples,
  },
  {
    label: 'Simple (points only)',
    options: simpleExamples,
  },
  {
    label: 'Complete (with pcb)',
    options: completeExamples,
  },
  {
    label: 'Miscellaneous',
    options: miscExamples,
  },
];
