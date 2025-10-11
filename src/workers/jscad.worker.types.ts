export type JscadWorkerRequest = {
  type: 'jscad_to_stl';
  jscadScripts: { name: string; script: string }[];
  configVersion: number;
};

export type JscadWorkerResponse = {
  type: 'success' | 'error';
  results?: { name: string; stl: string }[];
  error?: string;
  configVersion: number;
};
