/**
 * Shared result structures and case output definitions.
 */

export interface DemoOutput {
  dxf?: string;
  svg?: string;
}

export interface OutlineOutput {
  dxf?: string;
  svg?: string;
}

export interface CaseOutput {
  jscad?: string;
  stl?: string | ArrayBuffer | Uint8Array;
}

export interface PcbsOutput {
  [key: string]: string;
}

export interface Results {
  canonical?: unknown;
  points?: unknown;
  units?: unknown;
  demo?: DemoOutput;
  outlines?: Record<string, OutlineOutput>;
  cases?: Record<string, CaseOutput>;
  pcbs?: PcbsOutput;
  [key: string]: unknown;
}
