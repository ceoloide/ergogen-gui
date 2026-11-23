import type { ConfigExample } from './index';

/** A 56-key unibody layout with separate body and central outlines. */
const Briefs56: ConfigExample = {
  label: 'Briefs 56',
  author: 'ceoloide',
  value: `# Inspired by the Dygma Sonsei
meta:
  name: Briefs 56
  author: ceoloide
  engine: 4.3.0
  version: 1.0.0
units:
  keycap: 18
points:
  mirror: 0
  zones:
    matrix:
      anchor:
        shift: [-6.85u, -3.85u]
        rotate: -13
      columns:
        outer:
        pinky:
        ring:
          key.stagger: 0.45u
        middle:
          key.stagger: 0.15u
        index:
          key.stagger: -0.25u
        inner:
          key.stagger: 0.05u
      rows:
        bottom:
        home:
        top:
        number:
    thumbs:
      anchor:
        ref: matrix_middle_bottom
        shift: [0.3u, -1.25u]
      columns:
        outer:
        middle:
        inner:
          key:
            spread: 1.15u
            stagger: -0.19u
            splay: -19
        tip:
          key:
            spread: 1.1u
            stagger: -0.115u
            splay: -12
      rows:
        thumb:
outlines:
  keys:
    - what: rectangle
      where: true
      size: keycap
      corner: 1.5
  body:
    - what: polygon
      points:
        - shift: [-7.8u, 0]
        - shift: [15.6u, 0]
        - shift: [0, -5u]
        - shift: [-5.35u, -1.1u]
        - shift: [-1.55u, -1.2u]
        - shift: [-1.8u, 0]
        - shift: [-1.55u, 1.2u]
        - shift: [-5.35u, 1.1u]
      fillet: 5
  center:
    - what: polygon
      points:
        - shift: [-0.5u, -1.3u]
        - shift: [0.5u, -0.1u]
        - shift: [0.5u, 0.1u]
        - shift: [0.85u, -4u]
        - shift: [-1.35u, -1.15u]
        - shift: [-1.35u, 1.15u]
      fillet: 2
  preview:
    - what: outline
      name: body
    - what: outline
      name: center
      operation: stack
    - what: outline
      name: keys
      operation: stack
`,
};

export default Briefs56;
