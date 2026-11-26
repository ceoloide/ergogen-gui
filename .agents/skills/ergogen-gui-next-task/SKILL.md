---
name: ergogen-gui-next-task
description: Run the next task of the ceoloide/ergogen-gui queue. Check the quota, pick the task with pnpm queue:next, claim it with pnpm queue:claim, do it, open its pull request, and brief a decision that is ready. Use when you are told to run, take, or do the next task in ceoloide/ergogen-gui; not for a task that a person names.
---

# Next task

The queue is the GitHub Project "Ergogen GUI 2027" of the user `ceoloide`. Each
item is an issue of `ceoloide/ergogen-gui`. Follow these steps in order, from
the root of a clone of the repository, with `gh` signed in. Install the
dependencies first with `pnpm install --frozen-lockfile`.

Take one task in a session. Change the status of an item only with
`pnpm queue:claim`.

## 1. Check the quota

Follow the [quota skill](../ergogen-gui-quota/SKILL.md). Run
`pnpm -s queue:quota` once, and find the lines that bind your own model on your
own provider. When those lines do not allow a task, stop. Take no task, write no
brief, and say in your reply when to check again, as the quota skill says.

Keep the headroom of your model for step 2.

## 2. Pick the task

```sh
pnpm -s queue:next --json
```

The command prints `{"next": {...}}` with the `issue`, `title`, `url`,
`release`, `priority`, `size`, and `mode` of the next task. The header comment
of `scripts/queue/next.mts` gives the rule that picks it. The later steps write
the value of `issue` as `<issue>`.

- When the command prints `{"next": null}`, no task is ready. Say so in your
  reply, take no task, and go to step 5. Never pick a task by another route.
- When `size` is `M` or `L` and your headroom is under 10 points, the quota
  skill gives you no task of that size. Say so, take no task, and go to step 5.

## 3. Claim the task

Claim the issue before any other work, so that no other session takes it:

```sh
pnpm -s queue:claim <issue>
```

The command assigns the issue to the login of `gh` and sets the status of its
item to `In progress`. It changes nothing else. It claims only an open issue
whose item has the status `Todo`.

- When the command exits with 0, the task is yours. Go to step 4.
- When the command exits with 3, the status of the item is no longer `Todo`.
  Another session has most likely claimed it. Run step 2 again, and claim the
  new task. When that claim fails too, stop and say so.
- When the command exits with another status, stop. Do no work on the issue,
  and put the output of the command in your reply.

## 4. Do the task and open the pull request

1. Read the issue with `gh issue view <issue> --comments`. Its Change section
   says what to do. Its Exit condition says when the task is done.
2. Read [AGENTS.md](../../../AGENTS.md) and follow it in every step.
3. Create a branch from the latest `origin/main`.
4. Make the change. Install the native tools as
   [Contributing](../../../README.md#contributing) shows. Run `pnpm precommit`
   and each validation that AGENTS.md asks for, and fix what they report.
5. Commit, push the branch, and open a pull request against `main` with
   `gh pr create`. Write `Closes #<issue>` in its body.
6. Wait for the required checks with `gh pr checks <pr> --watch --required`,
   where `<pr>` is the number that `gh pr create` printed. When a check fails,
   read its log with `gh run view <run> --log-failed`, where `<run>` is the
   number after `/runs/` in the link that `gh pr checks` printed. Fix the cause,
   push, and wait again.

Do not merge the pull request.

A task of size `M` or `L` can need more than one pull request. Open them in
order in this session. Only the last one, which meets the exit condition,
closes the issue. Write `Part of #<issue>` in the body of each other one.
GitHub closes the issue when the word close, fix, or resolve, in any form,
stands directly before its number, also after "does not". Keep those words away
from the issue number in titles, bodies, and commit messages.

## 5. Brief a decision that is ready

Run this step also when step 2 gave you no task.

```sh
pnpm -s queue:next --decision --json
```

The command prints the next issue with the label `decision` whose dependencies
are closed and whose status is `Todo`, in the form of step 2. When it prints
`{"next": null}`, no decision is ready, and the session is done. Otherwise, the
later steps write the value of `issue` as `<decision>`.

1. Claim the issue with `pnpm -s queue:claim <decision>`. The claim keeps a
   second session from writing a second brief. When the command exits with a
   status other than 0, stop and put its output in your reply.
2. Read the issue and each issue in its Depends on section.
3. Write the brief that the Change section of the issue asks for. It usually
   asks for the options, the cost of each option, the evidence, and a
   recommendation.
4. Post the brief as one comment with
   `gh issue comment <decision> --body-file <file>`. Do not commit the file.
5. Do not choose. The owner chooses. Change no other field of the issue and no
   other issue.
6. Send the owner one message in your final reply. Name the issue, link the
   brief, and state the question that the owner must answer.

## Reply

End the session with one reply. Give the task that you claimed, the URL of its
pull request, and the state of its required checks, or the reason that you took
no task. Then give the message about the decision that you briefed, if any.
