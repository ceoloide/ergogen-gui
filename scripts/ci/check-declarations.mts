// Type-checks the repository's own declaration files (`*.d.ts`, `*.d.mts`,
// `*.d.cts`):
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
// A diagnostic involves our files in one of three ways:
//
// - it is reported in one of them;
// - its related information points into one of them: TypeScript reports a
//   conflict between two declarations on whichever comes later in the program,
//   so a conflict between our file and a dependency loaded after it is
//   reported in the dependency and names our declaration only as related
//   information;
// - it is reported on the name of a symbol that one of our files also
//   declares: an interface we merge with a dependency's interface, such as
//   `Window`, can break what the merged interface extends, and TypeScript
//   reports that on the first declaration of the interface, which may be the
//   dependency's, without related information.
//
// This is not a complete record of which errors our files cause. An error our
// declaration causes but that TypeScript reports on another symbol, with no
// related information pointing to us, is still treated as a dependency error.
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

const formatHost: ts.FormatDiagnosticsHost = {
  getCanonicalFileName: (fileName) => fileName,
  getCurrentDirectory: () => root,
  getNewLine: () => '\n',
};

// A diagnostic to report, with the locations of our declarations that tie it
// to our files when it is reported in a dependency on the name of a symbol we
// also declare.
interface Finding {
  diagnostic: ts.Diagnostic;
  ownDeclarations: string[];
}

const formatLocation = (file: ts.SourceFile, position: number) => {
  const { line, character } = file.getLineAndCharacterOfPosition(position);
  return `${relative(root, file.fileName)}(${line + 1},${character + 1})`;
};

// Prints each diagnostic with its related locations and our declarations of
// the symbol it is reported on indented below it, so a diagnostic reported in
// a dependency still names the declaration of ours that it involves.
const formatFindings = (findings: readonly Finding[]) =>
  findings
    .map(
      ({ diagnostic, ownDeclarations }) =>
        ts.formatDiagnostic(diagnostic, formatHost) +
        (diagnostic.relatedInformation ?? [])
          .map((related) => `  ${ts.formatDiagnostic(related, formatHost)}`)
          .join('') +
        ownDeclarations.map((declaration) => `  ${declaration}\n`).join('')
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

// The innermost node whose text, without leading trivia, contains `position`.
// A diagnostic about a declaration starts at the declaration's name, so this
// finds the name's identifier.
const nodeAtPosition = (file: ts.SourceFile, position: number) => {
  let found: ts.Node = file;
  const visit = (node: ts.Node) => {
    if (node.getStart(file) <= position && position < node.getEnd()) {
      found = node;
      ts.forEachChild(node, visit);
    }
  };
  ts.forEachChild(file, visit);
  return found;
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
  const checker = program.getTypeChecker();
  const isOwn = (file: ts.SourceFile | undefined) =>
    file !== undefined && ownFiles.has(resolve(file.fileName));
  const checked = program.getSourceFiles().filter(isOwn);

  // Our declarations of the symbol whose name the diagnostic is reported on.
  // An import alias counts as its own symbol: the declarations it refers to
  // are not followed.
  const ownDeclarationsAt = (diagnostic: ts.Diagnostic) => {
    if (diagnostic.file === undefined || diagnostic.start === undefined) {
      return [];
    }
    const node = nodeAtPosition(diagnostic.file, diagnostic.start);
    const symbol = checker.getSymbolAtLocation(node);
    if (symbol === undefined) return [];
    const name = checker.symbolToString(symbol);
    return (symbol.declarations ?? [])
      .filter((declaration) => isOwn(declaration.getSourceFile()))
      .map((declaration) => {
        const file = declaration.getSourceFile();
        const anchor = ts.getNameOfDeclaration(declaration) ?? declaration;
        return `${formatLocation(file, anchor.getStart(file))}: own declaration of '${name}'`;
      });
  };
  const toFinding = (diagnostic: ts.Diagnostic): Finding | undefined => {
    if (isOwn(diagnostic.file)) return { diagnostic, ownDeclarations: [] };
    const ownDeclarations = ownDeclarationsAt(diagnostic);
    const relatedToOwn = (diagnostic.relatedInformation ?? []).some((related) =>
      isOwn(related.file)
    );
    return relatedToOwn || ownDeclarations.length > 0
      ? { diagnostic, ownDeclarations }
      : undefined;
  };

  const findings: Finding[] = [
    ...parsed.errors,
    ...checked.flatMap((file) => program.getSyntacticDiagnostics(file)),
  ].map((diagnostic) => ({ diagnostic, ownDeclarations: [] }));
  // tsc already checks every other file, so walking the declaration files,
  // ours and those of dependencies, finds every diagnostic that involves ours.
  for (const file of program.getSourceFiles()) {
    if (!file.isDeclarationFile) continue;
    for (const diagnostic of program.getSemanticDiagnostics(file)) {
      const finding = toFinding(diagnostic);
      if (finding) findings.push(finding);
    }
  }
  return {
    checked: checked.map((file) => resolve(file.fileName)),
    findings,
  };
};

const main = (projects: string[]): number => {
  if (projects.length === 0) {
    console.error('Usage: check-declarations.mts <tsconfig>...');
    return 2;
  }

  let ownFiles: Set<string>;
  const results: ReturnType<typeof checkProject>[] = [];
  try {
    ownFiles = ownDeclarationFiles();
    for (const project of projects) {
      results.push(checkProject(resolve(root, project), ownFiles));
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return 2;
  }

  let failed = false;
  const covered = new Set<string>();
  projects.forEach((project, index) => {
    const { checked, findings } = results[index];
    checked.forEach((file) => covered.add(file));
    const names = checked.map((file) => relative(root, file)).sort();
    console.log(`${project}: ${names.join(', ') || 'no declaration files'}`);
    if (findings.length > 0) {
      failed = true;
      process.stderr.write(formatFindings(findings));
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
  return failed ? 1 : 0;
};

// Setting the exit code instead of calling process.exit lets Node finish
// writing to a pipe before it exits.
process.exitCode = main(process.argv.slice(2));
