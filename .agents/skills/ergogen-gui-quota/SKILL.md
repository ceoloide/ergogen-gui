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
antigravity  Gemini models          55.0%    35.0%  wait 17h  2026-01-11T15:36:00Z  resets 2026-01-15T12:00:00Z
antigravity  Claude and GPT models   5.0%    35.0%  go        -                     resets 2026-01-15T12:00:00Z
codex        all models             33.0%    35.0%  go        -                     resets 2026-01-15T12:00:00Z, read 3 h ago
```

## Read a line

- `provider` is `claude`, `antigravity`, or `codex`. A provider whose tool has
  no folder in the home directory gets no line.
- `limit` names the models that the line binds: one model, a group of models,
  or `all models`, which binds every model of the provider. When the script
  cannot read a provider, it prints one `unknown` line for `all models`.
- `used` is the percent of the weekly window used. `elapsed` is the percent of
  the window that has passed, which is the pace.
- `result` is `go` while `used` is at most the allowance above `elapsed`, and
  `wait` beyond that, with the hours until `go at`, such as `wait 17h`. The
  allowance is 10 points unless the run passed `--ahead=<points>`. It is
  `unknown` when the quota could not be read.
- `go at` is the UTC time at which a `wait` turns to `go` if no more quota is
  used.
- `note` gives the reset time, the reason for `unknown`, or the age of an old
  reading. A Codex line can say `read 3 h ago`, because Codex writes the
  reading only while it works. An old reading understates the use.

## Act on the result

Start a task for a model on a provider only when at least one line of that
provider binds the model, and every line that binds the model says `go` with
more than zero points of headroom.

The headroom of a line is the number of points that the line can use before it
turns to `wait`: `elapsed + allowance - used`, and at most `100 - used`. Use the
allowance of the run. The headroom of a task is the smallest headroom among the
lines that bind its model.

These cases follow from the rule:

- A line that binds other models does not count. In the example, a task for a
  Gemini model cannot start on Antigravity, because `Gemini models` says
  `wait`. A task for a Claude model can, because `Claude and GPT models` says
  `go`.
- A provider with no line gets no task.
- The `unknown` line of a provider that the script cannot read binds all
  models, so the provider gets no task. An `unknown` line for one model, such
  as a reading from a window that has ended, stops tasks for that model only.
- With the default allowance, a line at 100% used says `go` from 90% elapsed.
  Its headroom is zero, so it stops the task.

A line stops a task when it binds the task's model but does not say `go` with
more than zero points of headroom. When lines stop a task on a provider, check
that provider again at this time:

- When each line that stops the task says `wait`, at the latest `go at` time
  among those lines.
- Otherwise, on the next run of the queue. Do not run the command again at
  once, because the Anthropic usage endpoint answers HTTP 429 to runs a few
  seconds apart.

When no provider can take the task, check again at the earliest of these times.

Only a person overrides a wait. `--ahead=<points>` changes the allowance of 10
points for one run, such as `pnpm -s queue:quota --ahead=35`. Pass it only when
a person tells you to.

## Choose the task size

The `size:S`, `size:M`, or `size:L` label of a task issue gives its size.

- Give a `size:L` or `size:M` task to the provider where the task has the most
  headroom.
- Give a `size:S` task, or none, to a provider where the task has less than 10
  points of headroom.
- To learn how many points a task of one size takes on a provider, compare
  `used` before and after such a task.

In the example, a task for a Claude model on Antigravity has 40 points of
headroom. The Codex line shows 12 points, but its reading is 3 hours old, so
Codex has fewer. The pace adds about 14 points a day, so the headroom of a
provider grows while it does no work.
