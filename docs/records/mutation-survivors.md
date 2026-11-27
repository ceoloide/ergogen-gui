# Undetected mutants

`pnpm test:mutation` runs Stryker on `share.ts`, `zip.ts`, `injections.ts`, and
`configAnalyzer.ts` in `src/utils/`, as
[Mutation testing in DEVELOPMENT.md](../../DEVELOPMENT.md#mutation-testing)
describes. This file names each mutant that no unit test detects, under the
reason why it stays undetected. The mutant behaves like the original code, it
changes only console output, it needs an input that no caller passes, or a
proposed task changes the code that it mutates.

`pnpm check:survivors` reads `reports/mutation/mutation.json`. It lists each
undetected mutant that this file does not name, and each entry here that names
no undetected mutant. The nightly workflow
[mutation.yaml](../../.github/workflows/mutation.yaml) runs it after Stryker,
and a line in either list fails the run. When a change adds or moves an
undetected mutant, kill the mutant with a test that asserts behavior. If no
test can tell the mutant from the original code, add the line that
`pnpm check:survivors` prints for it under the reason that fits.

Each entry is that line. It names the file and the range of code that Stryker
replaces, in the form that `stryker run --mutate` reads, then the Stryker
mutator and the code that Stryker puts in place of the range.

[Run 46055161348](https://github.com/ceoloide/ergogen-gui/actions/runs/46055161348)
of `mutation.yaml`, on 2026-11-27 at commit 628ea11, left 226 mutants
undetected. The property tests of
[#423](https://github.com/ceoloide/ergogen-gui/pull/423) detect 16 of them. The
tests added with this file detect 107, and this file names the other 103.

## Equivalent mutants

No input that the types of the function allow makes one of these mutants behave
differently from the original code.

### JSZip returns a folder for every name

`folder(name)` in JSZip creates the folder when it is missing and returns a
JSZip object rooted at it. For a string, it never returns `null`, as
`jszip/lib/object.js` shows. A check that the returned folder exists is always
true. A second call for the same path returns a folder at the same path, so the
folder cache in `writeInjections` saves calls but changes no entry of the
archive.

- `src/utils/zip.ts:38:9-38:21` ConditionalExpression `true`
- `src/utils/zip.ts:46:13-46:24` ConditionalExpression `true`
- `src/utils/zip.ts:48:11-48:48` CallExpression `;`
- `src/utils/zip.ts:76:15-76:30` ConditionalExpression `true`
- `src/utils/zip.ts:79:15-79:29` ConditionalExpression `true`
- `src/utils/zip.ts:94:9-94:19` ConditionalExpression `true`
- `src/utils/zip.ts:110:13-110:25` ConditionalExpression `true`
- `src/utils/zip.ts:113:13-113:24` ConditionalExpression `true`
- `src/utils/zip.ts:127:9-127:20` ConditionalExpression `true`
- `src/utils/zip.ts:166:7-166:20` ConditionalExpression `true`

### An empty list leads to the same result

`writeInjections` writes one file for each injection, so an empty list writes
nothing. `filterInjectionsForSharing` returns an empty list for an empty list,
and `encodeConfig` leaves an empty injection list out of the link. The test
`leaves an empty injection list out of the link` checks the last rule.

- `src/utils/share.ts:237:34-237:55` ConditionalExpression `true`
- `src/utils/share.ts:237:34-237:55` EqualityOperator `injections.length >= 0`
- `src/utils/share.ts:244:5-244:54` ConditionalExpression `true`
- `src/utils/share.ts:244:26-244:54` ConditionalExpression `true`
- `src/utils/share.ts:244:26-244:54` EqualityOperator `injectionsToShare.length >= 0`
- `src/utils/share.ts:397:22-397:45` ConditionalExpression `false`
- `src/utils/zip.ts:170:21-170:42` ConditionalExpression `true`
- `src/utils/zip.ts:170:21-170:42` EqualityOperator `injections.length >= 0`

### The date of an ISO timestamp has no colon or period

`generateAndSaveZip` replaces each `:` and `.` of `toISOString()` and then keeps
only the date before `T`. The date has neither character, so the replacement
text never reaches the file name.

- `src/utils/zip.ts:150:23-150:26` StringLiteral `""`

### JSON has no undefined value

`decodeConfig` checks that `injections` is a key of the parsed link and that
its value is not `undefined`. An object from `JSON.parse` has no `undefined`
value and inherits no `injections` key, so each check alone gives the same
result.

- `src/utils/share.ts:149:7-150:47` LogicalOperator `'injections' in shareableConfig || shareableConfig.injections !== undefined`
- `src/utils/share.ts:150:7-150:47` ConditionalExpression `true`

### The hash of a URL is empty or longer than one character

`window.location.hash` is the empty string when the URL has no fragment or an
empty one. Otherwise it is `#` followed by the fragment. It is never `#` alone,
so `hash.length <= 1` is true only when `!hash` is true.

- `src/utils/share.ts:260:7-260:32` LogicalOperator `!hash && hash.length <= 1`
- `src/utils/share.ts:260:16-260:32` ConditionalExpression `false`
- `src/utils/share.ts:260:16-260:32` EqualityOperator `hash.length < 1`

### A string, number, or boolean has nothing for the next check to keep

The canonical output reaches `extractUsedInjectionsFromCanonical` from the
engine worker through a structured clone, and `analyzeConfiguration` reads YAML.
Neither holds a function. A value that fails a check for an object is then a
string, a number, a boolean, `null`, or `undefined`, and the code around each
of these checks already handles `null` and `undefined`. Without the check, the
code reads properties of the value, and none of them changes the result.

`Object.values` of a string gives strings of one character, which the next
check skips, and `Object.values` of a number or a boolean is empty. A string, a
number, or a boolean has no `pcbs`, `outlines`, `meta`, or `zone` property.
`getPointZone` returns a zone that is a number or a boolean unchanged, and no
zone name equals it, because zone names are strings.

- `src/utils/configAnalyzer.ts:156:14-156:36` ConditionalExpression `false`
- `src/utils/configAnalyzer.ts:158:16-158:40` ConditionalExpression `false`
- `src/utils/configAnalyzer.ts:164:7-164:31` ConditionalExpression `true`
- `src/utils/share.ts:328:21-328:50` ConditionalExpression `false`
- `src/utils/share.ts:335:31-335:71` ConditionalExpression `true`
- `src/utils/share.ts:337:19-337:42` ConditionalExpression `false`
- `src/utils/share.ts:345:29-345:63` ConditionalExpression `true`
- `src/utils/share.ts:361:5-361:49` ConditionalExpression `true`
- `src/utils/share.ts:364:28-364:60` ConditionalExpression `false`

### Callers of checkForInjectionConflict read only hasConflict

`checkForInjectionConflict` is private. `mergeInjectionArraysWithResolution`
always passes it an array, and `some` on an empty array finds no conflict.
Both callers read only `hasConflict`, which is falsy in `{}` and in
`{ hasConflict: false }`. `getInjectionConflicts` returns a conflict only when
`hasConflict` is true. Without its own check for missing injections,
`getInjectionConflicts` passes `undefined` or an empty list to
`checkForInjectionConflict`, which finds no conflict, so the result is still an
empty list.

- `src/utils/injections.ts:58:7-58:61` ConditionalExpression `false`
- `src/utils/injections.ts:58:7-58:61` LogicalOperator `!existingInjections && existingInjections.length === 0`
- `src/utils/injections.ts:58:30-58:61` ConditionalExpression `false`
- `src/utils/injections.ts:58:63-60:4` BlockStatement `{}`
- `src/utils/injections.ts:59:12-59:34` ObjectLiteral `{}`
- `src/utils/injections.ts:70:10-70:32` ObjectLiteral `{}`
- `src/utils/injections.ts:83:7-83:61` ConditionalExpression `false`
- `src/utils/injections.ts:83:30-83:61` ConditionalExpression `false`
- `src/utils/injections.ts:83:63-85:4` BlockStatement `{}`

### Each conflict strategy has one path

`mergeInjectionArraysWithResolution` handles each strategy of
`ConflictResolutionStrategy` in one branch. When the `skip` branch is empty or
never runs, `skip` matches no other branch, so the new injection is still left
out. The type has three strategies, and after `skip` and `overwrite` only
`keep-both` is left, so its check is always true. The `overwrite` branch finds
the injection with the same test that found the conflict, so `findIndex` never
returns -1 there.

- `src/utils/injections.ts:178:11-178:32` ConditionalExpression `false`
- `src/utils/injections.ts:178:26-178:32` StringLiteral `""`
- `src/utils/injections.ts:178:34-181:8` BlockStatement `{}`
- `src/utils/injections.ts:186:13-186:33` ConditionalExpression `true`
- `src/utils/injections.ts:189:18-189:44` ConditionalExpression `true`

### SHA-256 writes each word before it reads it

`sha256` sets each word of `words` with `|=`, which turns a string into 0, and
sets `w[0]` to `w[15]` before it reads them, so an array that starts with a
string gives the same digest. One more step of the first loop reads the
character after the end. That character code is `NaN`, and `NaN << n` is 0, so
`|=` changes nothing. One more step of the copy loop sets `w[16]`, which the
next loop sets again before any read. One more step of the expansion loop sets
`w[64]`, which the compression loop never reads.

- `src/utils/configAnalyzer.ts:32:27-32:29` ArrayDeclaration `["Stryker was here"]`
- `src/utils/configAnalyzer.ts:54:21-54:38` EqualityOperator `idx <= utf8.length`
- `src/utils/configAnalyzer.ts:66:25-66:27` ArrayDeclaration `["Stryker was here"]`
- `src/utils/configAnalyzer.ts:67:21-67:27` EqualityOperator `i <= 16`
- `src/utils/configAnalyzer.ts:70:22-70:28` EqualityOperator `i <= 64`

### An earlier line already settles the check

`getPointZone` returns early for a falsy zone, so the zone is never `null` at
the next check. Without a matrix zone, the loop over matrix zones runs zero
times, and the counts stay empty strings. That loop reads only the zones that
`matrixZonesList` kept as objects, so `zone?.mirror` never reads `undefined`.
`getPointZone` returns a zone name only for a point that is an object with an
object `meta`, so the checks of `pt` and `ptMeta` after it are always true.

- `src/utils/configAnalyzer.ts:161:35-161:48` ConditionalExpression `true`
- `src/utils/configAnalyzer.ts:234:7-234:17` ConditionalExpression `true`
- `src/utils/configAnalyzer.ts:254:9-254:21` OptionalChaining `zone.mirror`
- `src/utils/configAnalyzer.ts:255:17-255:29` OptionalChaining `zone.mirror`
- `src/utils/configAnalyzer.ts:255:46-255:58` OptionalChaining `zone.mirror`
- `src/utils/configAnalyzer.ts:267:13-267:41` ConditionalExpression `true`
- `src/utils/configAnalyzer.ts:267:13-267:41` LogicalOperator `pt || typeof pt === 'object'`
- `src/utils/configAnalyzer.ts:267:19-267:41` ConditionalExpression `true`
- `src/utils/configAnalyzer.ts:269:15-269:51` ConditionalExpression `true`
- `src/utils/configAnalyzer.ts:269:15-269:51` LogicalOperator `ptMeta || typeof ptMeta === 'object'`
- `src/utils/configAnalyzer.ts:269:25-269:51` ConditionalExpression `true`

## Console output only

### Error and warning text

These mutants change only the text or the data of a `console.error` or
`console.warn` call. No code reads the console.

- `src/utils/injections.ts:162:9-162:82` StringLiteral `""`
- `src/utils/share.ts:81:9-81:68` StringLiteral `""`
- `src/utils/share.ts:95:21-95:78` StringLiteral `""`
- `src/utils/share.ts:95:80-99:8` ObjectLiteral `{}`
- `src/utils/share.ts:98:30-98:60` MethodExpression `decompressed`
- `src/utils/share.ts:115:7-122:10` CallExpression `;`
- `src/utils/share.ts:115:21-115:73` StringLiteral `""`
- `src/utils/share.ts:115:75-122:8` ObjectLiteral `{}`
- `src/utils/share.ts:117:20-117:78` ConditionalExpression `false`
- `src/utils/share.ts:117:20-117:78` ConditionalExpression `true`
- `src/utils/share.ts:117:48-117:56` StringLiteral `""`
- `src/utils/share.ts:117:60-117:68` StringLiteral `""`
- `src/utils/share.ts:119:11-119:69` ConditionalExpression `false`
- `src/utils/share.ts:119:39-119:47` StringLiteral `""`
- `src/utils/share.ts:119:51-119:59` StringLiteral `""`
- `src/utils/share.ts:121:15-121:20` StringLiteral `""`
- `src/utils/share.ts:164:11-164:67` StringLiteral `""`
- `src/utils/share.ts:165:11-168:12` ObjectLiteral `{}`
- `src/utils/share.ts:191:19-191:75` StringLiteral `""`
- `src/utils/share.ts:191:77-195:6` ObjectLiteral `{}`

### The debug log

These mutants change whether `decodeConfig` logs the decoded link when the page
URL has `?debug`, or what the log holds. The test
`decodes a link without injections when the page URL has ?debug` checks that
the log does not stop the link from loading.

- `src/utils/share.ts:63:36-66:2` BlockStatement `{}`
- `src/utils/share.ts:65:10-65:47` ConditionalExpression `false`
- `src/utils/share.ts:65:10-65:47` ConditionalExpression `true`
- `src/utils/share.ts:65:10-65:47` EqualityOperator `queryParameters.get('debug') === null`
- `src/utils/share.ts:65:30-65:37` StringLiteral `""`
- `src/utils/share.ts:180:9-180:14` ConditionalExpression `false`
- `src/utils/share.ts:180:9-180:14` ConditionalExpression `true`
- `src/utils/share.ts:180:16-187:6` BlockStatement `{}`
- `src/utils/share.ts:181:19-181:64` StringLiteral `""`
- `src/utils/share.ts:181:66-186:8` ObjectLiteral `{}`
- `src/utils/share.ts:183:24-183:64` ConditionalExpression `false`
- `src/utils/share.ts:183:24-183:64` ConditionalExpression `true`
- `src/utils/share.ts:183:24-183:64` EqualityOperator `shareableConfig.injections === undefined`
- `src/utils/share.ts:184:26-184:65` LogicalOperator `shareableConfig.injections?.length && 0`

## Unreachable mutants

### The engine writes every zone as an object

The engine reserves `zone` in a key and sets `meta.zone` of each point to the
zone object with its `name`, in `src/points.js` of the engine. This mutant
changes the result only for a point whose zone is the empty string, in a
configuration with a zone named with the empty string. The engine never writes
a zone as a string.

- `src/utils/configAnalyzer.ts:160:7-160:12` ConditionalExpression `false`

## Mutants that a proposed task changes

### Detect every mirror that the engine accepts

The engine accepts `mirror` as a number or an object and rejects `true`, but
`analyzeConfiguration` treats only `true` and objects as mirrors. It reports
`is_mirrored: false` for every configuration that the engine accepts. It counts
each key once when the mirror is a number. These mutants change only the checks
for `mirror === true`, which the task replaces.

- `src/utils/configAnalyzer.ts:254:9-254:30` ConditionalExpression `false`
- `src/utils/configAnalyzer.ts:254:26-254:30` BooleanLiteral `false`

### Count the keys of a zone whose name starts with `mirror_`

`analyzeConfiguration` leaves out each point whose name starts with `mirror_`,
so a zone named `mirror_pad` reports no keys. The engine marks each mirror copy
with `meta.mirrored: true`, which the line before already checks. The task
deletes the check of the name, and these mutants go with it.

- `src/utils/configAnalyzer.ts:274:13-274:36` ConditionalExpression `false`
- `src/utils/configAnalyzer.ts:274:13-274:36` MethodExpression `k.endsWith('mirror_')`
- `src/utils/configAnalyzer.ts:274:45-274:50` BooleanLiteral `true`
