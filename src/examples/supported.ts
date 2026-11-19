import yaml from 'js-yaml';
import {
  installedEngineVersion,
  meetsEngineRequirement,
} from '../utils/engineRequirements';
import { exampleOptions, type ConfigOption } from './index';

/**
 * The engine version an example asks for in `meta.engine` (or the dotted
 * top-level key `meta.engine`, which the engine also reads), or undefined when
 * it asks for none. The engine refuses a configuration whose requirement it
 * does not meet, so this is the one place an example states what it needs. A
 * value that is not a string, such as an unquoted `4.3`, is returned as is:
 * the engine fails on it, so no engine supports the example.
 */
export const requiredEngine = (example: ConfigOption): unknown => {
  const config = yaml.load(example.value) as
    | { meta?: { engine?: unknown }; 'meta.engine'?: unknown }
    | null
    | undefined;
  const engine = config?.meta?.engine ?? config?.['meta.engine'];
  return engine === null ? undefined : engine;
};

/**
 * Whether an engine can generate an example. Deployments may build with an
 * older engine than the canonical one (see DEVELOPMENT.md, "Deployment
 * engine"), and must not offer examples that engine would refuse.
 */
export const isExampleSupported = (
  example: ConfigOption,
  engineVersion: string = installedEngineVersion()
): boolean => {
  const required = requiredEngine(example);
  if (required === undefined) return true;
  return (
    typeof required === 'string' &&
    meetsEngineRequirement(engineVersion, required)
  );
};

/** The example groups, keeping only what the engine can generate. */
export const supportedExampleOptions = (
  engineVersion: string = installedEngineVersion()
) =>
  exampleOptions
    .map((group) => ({
      ...group,
      options: group.options.filter((example) =>
        isExampleSupported(example, engineVersion)
      ),
    }))
    .filter((group) => group.options.length > 0);
