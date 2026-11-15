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
// own configuration with only `skipLibCheck` turned off, checks every
// declaration file and keeps the diagnostics that involve ours. Errors inside
// dependency declarations stay out of scope; errors in our files, such as an
// initializer in an ambient context or a conflicting declaration, fail the
// check.
//
// A diagnostic involves our files when it is reported in one of them or when
// its related information points into one. TypeScript reports a conflict
// between two declarations on whichever comes later in the program, so a
// conflict between our file and a dependency loaded after it is reported in
// the dependency and names our declaration only as related information.
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

// Prints each diagnostic with its related locations indented below it, so a
// diagnostic reported in a dependency still names the declaration of ours
// that it involves.
const formatDiagnostics = (diagnostics: readonly ts.Diagnostic[]) =>
  diagnostics
    .map(
      (diagnostic) =>
        ts.formatDiagnostic(diagnostic, formatHost) +
        (diagnostic.relatedInformation ?? [])
          .map((related) => `  ${ts.formatDiagnostic(related, formatHost)}`)
          .join('')
    )
    .join('');

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
  const isOwn = (file: ts.SourceFile | undefined) =>
    file !== undefined && ownFiles.has(resolve(file.fileName));
  const checked = program.getSourceFiles().filter(isOwn);
  const involvesOwnFile = (diagnostic: ts.Diagnostic) =>
    isOwn(diagnostic.file) ||
    (diagnostic.relatedInformation ?? []).some((related) =>
      isOwn(related.file)
    );
  const diagnostics = [
    ...parsed.errors,
    ...checked.flatMap((file) => program.getSyntacticDiagnostics(file)),
    // tsc already checks every other file, so walking the declaration files,
    // ours and those of dependencies, finds every diagnostic that involves ours.
    ...program
      .getSourceFiles()
      .filter((file) => file.isDeclarationFile)
      .flatMap((file) => program.getSemanticDiagnostics(file))
      .filter(involvesOwnFile),
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
    process.stderr.write(formatDiagnostics(diagnostics));
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
