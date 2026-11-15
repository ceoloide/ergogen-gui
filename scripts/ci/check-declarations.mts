// Type-checks the repository's own declaration files (`*.d.ts`):
//
//   node scripts/ci/check-declarations.mts <tsconfig>...
//
// `pnpm typecheck` runs it with tsconfig.json and tsconfig.tooling.json from
// the repository root. Both projects set `skipLibCheck`, which makes tsc skip
// type checking of every declaration file, ours included, so plain tsc only
// parses them. Turning `skipLibCheck` off would instead check every dependency
// declaration too and report their errors. TypeScript has no option to check
// only some declaration files, so this script builds each project from its
// own configuration with only `skipLibCheck` turned off, and asks the compiler
// for the diagnostics of our files alone. Errors inside dependency
// declarations stay out of scope; errors in our files, such as an initializer
// in an ambient context or a conflicting declaration, fail the check.
//
// Our files are the declaration files Git lists, tracked or untracked but not
// ignored, outside any node_modules folder. Each must belong to at least one
// of the projects, so a new file cannot escape the check.
//
// Exit status: 0 when every file is covered and has no errors, 1 when a file
// has errors or belongs to no project, 2 when the check could not run.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const projects = process.argv.slice(2);
if (projects.length === 0) {
  console.error('Usage: check-declarations.mts <tsconfig>...');
  process.exit(2);
}

const formatHost: ts.FormatDiagnosticsHost = {
  getCanonicalFileName: (fileName) => fileName,
  getCurrentDirectory: () => root,
  getNewLine: () => '\n',
};

const ownDeclarationFiles = (): Set<string> => {
  const listed = execFileSync(
    'git',
    [
      'ls-files',
      '-z',
      '--cached',
      '--others',
      '--exclude-standard',
      '--',
      '*.d.ts',
      '*.d.mts',
      '*.d.cts',
    ],
    { cwd: root, encoding: 'utf8' }
  );
  return new Set(
    listed
      .split('\0')
      .filter(
        (path) => path !== '' && !path.split('/').includes('node_modules')
      )
      .map((path) => resolve(root, path))
      // A tracked file deleted from the working tree is no longer ours to check.
      .filter((path) => existsSync(path))
  );
};

const checkProject = (configPath: string, ownFiles: Set<string>) => {
  const parsed = ts.getParsedCommandLineOfConfigFile(
    configPath,
    { skipLibCheck: false },
    {
      ...ts.sys,
      onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
        throw new Error(ts.formatDiagnostics([diagnostic], formatHost));
      },
    }
  );
  if (!parsed) throw new Error(`Cannot read ${configPath}`);
  const program = ts.createProgram({
    rootNames: parsed.fileNames,
    options: parsed.options,
    projectReferences: parsed.projectReferences,
    configFileParsingDiagnostics: parsed.errors,
  });
  const checked = program
    .getSourceFiles()
    .filter((file) => ownFiles.has(resolve(file.fileName)));
  const diagnostics = [
    ...parsed.errors,
    ...checked.flatMap((file) => [
      ...program.getSyntacticDiagnostics(file),
      ...program.getSemanticDiagnostics(file),
    ]),
  ];
  return {
    checked: checked.map((file) => resolve(file.fileName)),
    diagnostics,
  };
};

let ownFiles: Set<string>;
const results: ReturnType<typeof checkProject>[] = [];
try {
  ownFiles = ownDeclarationFiles();
  for (const project of projects) {
    results.push(checkProject(resolve(root, project), ownFiles));
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(2);
}

let failed = false;
const covered = new Set<string>();
projects.forEach((project, index) => {
  const { checked, diagnostics } = results[index];
  checked.forEach((file) => covered.add(file));
  const names = checked.map((file) => relative(root, file)).sort();
  console.log(`${project}: ${names.join(', ') || 'no declaration files'}`);
  if (diagnostics.length > 0) {
    failed = true;
    process.stderr.write(ts.formatDiagnostics(diagnostics, formatHost));
  }
});
for (const file of [...ownFiles].sort()) {
  if (!covered.has(file)) {
    failed = true;
    console.error(
      `${relative(root, file)}: not part of any checked project (${projects.join(', ')})`
    );
  }
}
process.exit(failed ? 1 : 0);
