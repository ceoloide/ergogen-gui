import { ConfigExample } from './index';

/** A traced 56-key unibody layout with separate body and central outlines. */
const Briefs56: ConfigExample = {
  label: 'Briefs 56',
  author: 'Ergogen Web UI',
  value: `meta:
  name: Briefs 56
  engine: 4.3.0
  version: 1.0.0
# Traced from the supplied Dygma Sonsei drawing: 6 x 4 + 4 keys per half.
# Choc v2 / MX: 19.05 mm along-column pitch; stagger and thumbs are traced.
# cap is the drawing's visible cap size, not a physical clearance envelope.
# Full-size 18 mm caps overlap at index-bottom / thumb-middle: check your caps.
# Body is approximately 297 x 139 mm (drawing label: 299 x 140 mm).
# Changing pitch rescales all positions and outlines; cap is independent.
# Coordinates use the drawing's 33-pixel pitch, with its center at (323, 84).
# The body and center are illustrative outlines, not a manufactured case/PCB.
units:
  pitch: 19.05
  trace: pitch / 33
  cap: 16
points:
  key:
    padding: pitch
    spread: pitch
    width: cap
    height: cap
  mirror: 0
  zones:
    # Bottom anchors place the top row on the traced drawing landmarks.
    outer:
      anchor:
        shift: [-225.2702trace, -127.4626trace]
        rotate: -13
      columns:
        key:
      rows:
        bottom:
        home:
        top:
        number:
    pinky:
      anchor:
        shift: [-193.2702trace, -135.4626trace]
        rotate: -13
      columns:
        key:
      rows:
        bottom:
        home:
        top:
        number:
    ring:
      anchor:
        shift: [-158.2702trace, -128.4626trace]
        rotate: -13
      columns:
        key:
      rows:
        bottom:
        home:
        top:
        number:
    middle:
      anchor:
        shift: [-126.2702trace, -130.4626trace]
        rotate: -13
      columns:
        key:
      rows:
        bottom:
        home:
        top:
        number:
    index:
      anchor:
        shift: [-94.2702trace, -146.4626trace]
        rotate: -13
      columns:
        key:
      rows:
        bottom:
        home:
        top:
        number:
    inner:
      anchor:
        shift: [-62.2702trace, -152.4626trace]
        rotate: -13
      columns:
        key:
      rows:
        bottom:
        home:
        top:
        number:
    thumb_outer:
      anchor:
        shift: [-126trace, -173trace]
        rotate: -10
      columns:
        key:
      rows:
        thumb:
    thumb_middle:
      anchor:
        shift: [-94trace, -178trace]
        rotate: -10
      columns:
        key:
      rows:
        thumb:
    thumb_inner:
      anchor:
        shift: [-60trace, -193trace]
        rotate: -32
      columns:
        key:
      rows:
        thumb:
    thumb_tip:
      anchor:
        shift: [-30trace, -215trace]
        rotate: -44
      columns:
        key:
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
        - shift: [-257trace, 0trace]
        - shift: [514trace, 0trace]
        - shift: [0trace, -165trace]
        - shift: [-178trace, -39trace]
        - shift: [-48trace, -37trace]
        - shift: [-62trace, 0trace]
        - shift: [-48trace, 37trace]
        - shift: [-178trace, 39trace]
      fillet: 5
  center:
    - what: polygon
      points:
        - shift: [-16trace, -46trace]
        - shift: [16trace, -3trace]
        - shift: [16trace, 3trace]
        - shift: [28trace, -123trace]
        - shift: [-44trace, -38trace]
        - shift: [-44trace, 38trace]
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
