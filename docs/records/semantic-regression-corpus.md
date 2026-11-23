# Semantic regression corpus

[Semantic regression corpus in DEVELOPMENT.md](../../DEVELOPMENT.md#semantic-regression-corpus)
states the rules for these tests. This file records what each suite and fixture
checked on 2026-11-23, when this list moved out of DEVELOPMENT.md. The suites in
`tests/engine-contract/` are the current source.

These Vitest suites check generated geometry and structure instead of byte
snapshots so they catch wrong output as well as crashes. They run the prepared
engine offline and read only their fixtures.

The corpus consists of these fixtures and test suites:

- **Fixtures in `tests/engine-contract/corpus/`** include
  `staggered-thumbs.yaml`, the custom footprint
  `footprints/corpus/probe_pad.js`, and two invalid configurations: one with a
  YAML syntax error and one with a missing outline. `staggered-thumbs.yaml`
  exercises column stagger, a rotated and splayed thumb cluster, a private
  `_plate` outline, a vendor footprint, and a custom footprint. Expected values
  in `tests/engine-contract/corpus/corpus.ts` are calculated manually, never
  copied from generated output.
- **`tests/engine-contract/engine-corpus.test.ts`** starts with direct
  `ergogen.process` checks for key pitch, outline size, symmetric mirrored
  `hull` outlines, pinned vendor footprints including `infused-kim/diode` while
  rejecting the old typo, and unknown-footprint errors. Its corpus cases run
  through the app's worker handler and injection evaluator, where
  `tests/engine-contract/corpus/inProcessWorker.ts` replaces only the `Worker`
  transport. Those cases verify key positions and rotations, outline sizes and
  region counts, and matching DXF and SVG segments. They also verify footprint
  placement and nets, Edge.Cuts alignment with the board outline, error replies
  for invalid input, and identical output on a second run.
- **`tests/engine-contract/export-corpus.test.ts`** runs `createZip` and
  `exportConfigsProgressively` with real JSZip and replaces only browser
  downloads and the worker transport. It verifies archive names, exact file
  lists, file contents, and geometry. It also verifies that a
  single-configuration archive reloads with only its configuration and
  injections, that a configs-only archive holds no generated files, and that a
  failed configuration gets `error.txt` instead of outputs. It counts switch and
  probe-pad footprints separately before it checks their placement.
- **Shared engine behavior.** All requests in one test file share one engine
  instance, so an injected footprint stays registered. Browser bulk export
  starts a fresh worker per configuration instead. Bulk export tests therefore
  use the probe pad under its own name (`bulkProbePadInjection` in
  `tests/engine-contract/corpus/corpus.ts`) so the test fails if bulk export
  does not pass its injections to the worker.
  `tests/corpus-in-process-worker.test.ts` checks the adapter itself. It
  verifies that a handler that throws or does not reply reaches `onerror` at
  once and that a failed import restores the globals it replaced.
- **`tests/engine-contract/preview-consistency.test.ts`** regenerates the
  geometry of every tracked preview in `public/images/previews` and compares it
  with the tracked file while ignoring path direction and start point. It
  requires one preview per drawable example, excluding `Empty YAML
configuration`, and covers only these previews.
- **`tests/corpus-inspect.test.ts`** checks the shared SVG reader. It verifies
  that the `viewBox` consists of four finite numbers that frame the paths
  exactly and that only closed chains count as regions.

The corpus ignores only documented volatile data: the KiCad 8 title-block date
(stripped by `withoutPcbGenerationDate`) and the date matched by pattern in
archive names.
