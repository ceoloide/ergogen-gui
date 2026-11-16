/**
 * The configuration the "Build visually" welcome card starts from: one
 * five-column, three-row zone with a gentle column stagger, keycap outlines and
 * a board hull around every key, so both the Build view and the regular
 * outputs have something to show.
 *
 * `meta.builder.hull` hands `outlines.board.hull.points` to the Build view,
 * which rewrites that list to name every key after each edit it checks (see
 * `builderHull.ts`). Deleting the marker makes the list the user's own.
 */
export const BUILDER_STARTER_CONFIG = `meta:
  engine: 4.1.0
  # The Build view keeps outlines.board.hull.points listing every key.
  # Remove these two lines to edit that list yourself.
  builder:
    hull: board.hull
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
      size: [18, 18]
      corner: 1
  board:
    hull:
      what: hull
      extend: true
      expand: 3
      points:
        - matrix_pinky_bottom
        - matrix_pinky_home
        - matrix_pinky_top
        - matrix_ring_bottom
        - matrix_ring_home
        - matrix_ring_top
        - matrix_middle_bottom
        - matrix_middle_home
        - matrix_middle_top
        - matrix_index_bottom
        - matrix_index_home
        - matrix_index_top
        - matrix_inner_bottom
        - matrix_inner_home
        - matrix_inner_top
  preview:
    - what: outline
      name: board
    - what: outline
      name: keys
      operation: stack
`;
