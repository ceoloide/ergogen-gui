import { ConfigExample } from './index';

/** A 56-key unibody layout with separate body and central outlines. */
const Briefs56: ConfigExample = {
  label: 'Briefs 56',
  author: 'ceoloide',
  value: `meta:
  name: Briefs 56
  author: ceoloide
  engine: 4.3.0
  version: 1.0.0
# Inspired by the Dygma Sonsei: 6 x 4 + 4 keys per half.
# Ergogen defaults to u (19 mm) for both spread and padding; U is 19.05 mm.
# The matrix and outer two thumbs use that default spacing for Choc v2 / MX.
# The inner thumb pair approximates the drawing's custom keycaps.
# cap is a visual guide, not a physical keycap clearance specification.
# The body and center are illustrative outlines, not a manufactured case/PCB.
units:
  cap: u - 3
points:
  key:
    width: cap
    height: cap
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
            spread: 1.1u
            stagger: -0.2u
            splay: -19
        tip:
          key:
            spread: 1.1u
            stagger: -0.1u
            splay: -12
      rows:
        thumb:
outlines:
  keys:
    - what: rectangle
      where: true
      size: cap
      corner: 1
  body:
    - what: polygon
      points:
        - shift: [-7.8u, 0]
        - shift: [15.6u, 0]
        - shift: [0, -5u]
        - shift: [-5.4u, -1.2u]
        - shift: [-1.45u, -1.1u]
        - shift: [-1.9u, 0]
        - shift: [-1.45u, 1.1u]
        - shift: [-5.4u, 1.2u]
      fillet: 5
  center:
    - what: polygon
      points:
        - shift: [-0.5u, -1.4u]
        - shift: [0.5u, -0.1u]
        - shift: [0.5u, 0.1u]
        - shift: [0.85u, -3.7u]
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
