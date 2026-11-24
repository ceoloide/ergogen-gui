---
name: ergogen-gui-quota
description: Check with pnpm queue:quota whether the weekly quota of Claude, Antigravity, and Codex allows new work, and choose the provider and the task size from the result. Use before you start or assign a task in ceoloide/ergogen-gui; not for the quota of other tools.
---

# Weekly quota

`pnpm queue:quota` reads the weekly quota of each provider that this machine is
signed in to, and prints one line for each weekly limit. Read it before you
start or assign a task.

## Run the command

Run the command once for each decision, not in a loop. The Anthropic usage
endpoint answers HTTP 429 to runs a few seconds apart, and the Claude line then
says `unknown`.

```sh
pnpm -s queue:quota
```

The command exits 0 after a normal run, whatever the results, so read the
`result` column, not the exit code. It exits 2 only for an invalid argument.
`pnpm -s` still prints one `$ node ...` line before the table. This example uses
invented numbers:

```text
$ node scripts/queue/quota.mts
provider     limit                   used  elapsed  result    go at                 note
claude       all models                 -        -  unknown   -                     HTTP 429 from api.anthropic.com
antigravity  Gemini models          70.0%    35.0%  wait 17h  2026-01-11T15:36:00Z  resets 2026-01-15T12:00:00Z
antigravity  Claude and GPT models  20.0%    35.0%  go        -                     resets 2026-01-15T12:00:00Z
codex        all models             48.0%    35.0%  go        -                     resets 2026-01-15T12:00:00Z, read 3 h ago
```

## Read a line

- `provider` is `claude`, `antigravity`, or `codex`. A provider whose tool has
  no folder in the home directory gets no line.
- `limit` names the models that the line covers. The `all models` line binds
  every model of its provider. A line that names one model, or one group of
  models, binds only those models. For Gemini work in Antigravity, the
  `Gemini models` line counts, not `Claude and GPT models`.
- `used` is the percent of the weekly window used. `elapsed` is the percent of
  the window that has passed, which is the pace.
- `result` is `go` while `used` is at most the allowance above `elapsed`, and
  `wait` beyond that. The allowance is 25 points unless the run passed
  `--ahead=<points>`. It is `unknown` when the quota could not be read.
- `go at` is the UTC time at which a `wait` turns to `go` if no more quota is
  used.
- `note` gives the reset time, the reason for `unknown`, or the age of an old
  reading. A Codex line can say `read 3 h ago`, because Codex writes the
  reading only while it works. An old reading understates the use.

## Act on the result

A task goes to a provider only when all three of these hold:

1. At least one line of the provider covers the model of the task.
2. Every line of the provider that covers the model says `go`.
3. No line of the provider says `unknown`.

A line that is missing never counts as `go`. When a request fails, the provider
gets one `unknown` line and no other, and that line is named after its main
limit: `all models` for Claude and Codex, `Gemini models` for Antigravity. A
failed Antigravity request leaves no line for `Claude and GPT models`, and
rule 3 stops work for those models too.

Each result means this for its line:

- `go`: the line allows new work.
  [Choose the task size](#choose-the-task-size) from its headroom.
- `wait`: start no new task on that provider. Store the `go at` timestamp, and
  run the command again at that time. The hours, such as `wait 17h`, tell a
  person how long the wait lasts, so that the person can decide whether to
  override it.
- `unknown`: send no new work to that provider, for any of its models. The note
  says why.

When no provider can take the task, run the command again at the earliest
`go at` time.

Only a person overrides a wait. `--ahead=<points>` changes the allowance of 25
points for one run, such as `pnpm -s queue:quota --ahead=35`. Pass it only when
a person tells you to.

## Choose the task size

The headroom of a line is the number of points that the line can use before it
turns to `wait`: `elapsed + allowance - used`, and at most `100 - used`. The
allowance is the one that the run used, which is 25 points unless the run passed
`--ahead=<points>`. In the example, the `Claude and GPT models` line has 40 points of headroom. The Codex
line shows 12 points, but its reading is 3 hours old, so Codex has fewer. The
pace adds about 14 points a day, so the headroom of a provider grows while it
does no work.

The `size:S`, `size:M`, or `size:L` label of a task issue gives its size.

- Give a `size:L` or `size:M` task to the provider with the most headroom on
  the lines that bind the task.
- Give a provider with less than 10 points of headroom a `size:S` task or none.
- To learn how many points a task of one size takes on a provider, compare
  `used` before and after such a task.
