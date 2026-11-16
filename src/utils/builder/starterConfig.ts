/**
 * The configuration the "Build visually" welcome card starts from: one
 * five-column, three-row zone with a gentle column stagger and simple outlines,
 * so both the Build view and the regular outputs have something to show.
 */
export const BUILDER_STARTER_CONFIG = `meta:
  engine: 4.1.0
points:
  zones:
    matrix:
      columns:
        pinky:
        ring:
          key:
            stagger: 6
        middle:
          key:
            stagger: 3
        index:
          key:
            stagger: -3
        inner:
          key:
            stagger: -2
      rows:
        bottom:
        home:
        top:
outlines:
  keys:
    - what: rectangle
      where: true
      size: [u-1, u-1]
  board:
    - what: rectangle
      where: true
      size: [u+4, u+4]
`;
