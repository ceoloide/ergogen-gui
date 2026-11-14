import { JSDOM } from 'jsdom';
import type { RequiredReport } from './contract.mts';

export interface JUnitSummary {
  tests: number;
  failures: number;
  errors: number;
  skipped: number;
  /** Playwright project names; Vitest writes the machine name here instead. */
  projects: string[];
  /** Names of failed or errored tests, for triage. */
  failing: string[];
}

export interface ReportResult {
  name: string;
  path: string;
  summary?: JUnitSummary;
  problems: string[];
}

const childNamed = (element: Element, name: string) =>
  Array.from(element.children).some((child) => child.nodeName === name);

const declaredCount = (element: Element, attribute: string) => {
  const value = Number(element.getAttribute(attribute) ?? 0);
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`declares an invalid ${attribute} count`);
  }
  return value;
};

/**
 * Counts tests from the testcase elements themselves. Root and suite counts
 * are also honoured, so a failure reported outside any testcase (for
 * example a test file that failed to load) is never lost.
 */
export function summarizeJUnit(xml: string): JUnitSummary {
  const { DOMParser } = new JSDOM().window;
  const document = new DOMParser().parseFromString(xml, 'text/xml');
  if (document.getElementsByTagName('parsererror').length > 0) {
    throw new Error('is not well-formed XML');
  }
  const root = document.documentElement;
  if (root.nodeName !== 'testsuites' && root.nodeName !== 'testsuite') {
    throw new Error(`has root <${root.nodeName}>, not <testsuites>`);
  }
  const elements = (name: string) =>
    Array.from(document.getElementsByTagName(name));
  const suites = [root, ...elements('testsuite')];
  const cases = elements('testcase');
  const counted = (child: string) =>
    cases.filter((testcase) => childNamed(testcase, child)).length;
  const declared = (attribute: string) =>
    Math.max(...suites.map((suite) => declaredCount(suite, attribute)));
  const projects = new Set<string>();
  for (const suite of elements('testsuite')) {
    const project = suite.getAttribute('hostname');
    if (project && suite.getElementsByTagName('testcase').length > 0) {
      projects.add(project);
    }
  }
  return {
    tests: cases.length,
    failures: Math.max(counted('failure'), declared('failures')),
    errors: Math.max(counted('error'), declared('errors')),
    skipped: Math.max(counted('skipped'), declared('skipped')),
    projects: [...projects].sort(),
    failing: cases
      .filter((testcase) => childNamed(testcase, 'failure'))
      .concat(cases.filter((testcase) => childNamed(testcase, 'error')))
      .map(
        (testcase) =>
          `${testcase.getAttribute('classname')} › ${testcase.getAttribute('name')}`
      ),
  };
}

/** Applies the contract to one report; `xml` is undefined when it is missing. */
export function checkReport(
  report: RequiredReport,
  xml: string | undefined
): ReportResult {
  const result: ReportResult = {
    name: report.name,
    path: report.path,
    problems: [],
  };
  const problem = (text: string) =>
    result.problems.push(`${report.path} ${text}`);
  if (xml === undefined) {
    problem('is missing');
    return result;
  }
  if (xml.trim() === '') {
    problem('is empty');
    return result;
  }
  try {
    result.summary = summarizeJUnit(xml);
  } catch (error) {
    problem((error as Error).message);
    return result;
  }
  const { tests, failures, errors, skipped, projects } = result.summary;
  if (tests === 0) problem('contains no tests');
  if (failures > 0) problem(`has ${failures} failed tests`);
  if (errors > 0) problem(`has ${errors} errored tests`);
  if (skipped > 0) {
    problem(`skipped ${skipped} tests; the contract allows no skipped tests`);
  }
  for (const project of report.projects) {
    if (!projects.includes(project)) {
      problem(`has no tests from the ${project} project`);
    }
  }
  return result;
}
