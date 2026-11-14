// jsdom 29 ships no type declarations and no matching @types/jsdom release
// exists. The CI scripts only use its standard DOMParser, typed by lib.dom.
declare module 'jsdom' {
  export class JSDOM {
    constructor(html?: string);
    readonly window: { DOMParser: typeof DOMParser };
  }
}
