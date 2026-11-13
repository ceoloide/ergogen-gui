/// <reference types="vite/client" />

import type { DetailedHTMLProps, HTMLAttributes } from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'kicanvas-embed': DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        controls?: string;
        controlslist?: string;
        theme?: string;
      };
      'kicanvas-source': DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        type?: 'board';
      };
    }
  }
}
