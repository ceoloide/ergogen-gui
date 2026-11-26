---
name: ergogen-gui-intake
description: Add a new bug report or feature request of ceoloide/ergogen-gui to the queue. Read the issue, set its type, reproduce a bug, propose a priority, choose its release by the priority rules, and add it with pnpm queue:add. Use when an open issue has no milestone, or when the owner answers about an issue that this skill added; not for a roadmap task or an issue in the milestone Backlog.
---

# Intake

The queue is the GitHub Project "Ergogen GUI 2027" of the user `ceoloide`. Each
item is an issue of `ceoloide/ergogen-gui`. This skill adds a new bug report or
feature request to the queue. Follow these steps in order, from the root of a
clone of the repository, with `gh` signed in. Install the dependencies first
with `pnpm install --frozen-lockfile`.

Keep these rules in every step:

- Change an issue and its item in the Project only with `pnpm queue:add`. Do
  not edit the body, title, labels, milestone, or status by hand, and do not
  close the issue.
- Leave each issue in the milestone `Backlog` as it is. Those issues wait until
  v1.0 is released.
- Commit nothing, and open no pull request.

## 1. Pick the issue

When you were given an issue number, use it. Otherwise, list the open issues
that have no milestone, oldest first:

```sh
gh issue list -R ceoloide/ergogen-gui --state open --search 'no:milestone sort:created-asc'
```

Run steps 2 to 7 for one issue at a time. The steps write its number as
`<issue>`. Read the issue and its comments:

```sh
gh issue view <issue> -R ceoloide/ergogen-gui
gh issue view <issue> -R ceoloide/ergogen-gui --comments
```

- When the issue has a milestone, skip it. For an issue that this skill added
  earlier, follow [When the owner answers](#when-the-owner-answers).
- When the issue is neither a bug report nor a feature request, such as a
  question or a duplicate, skip it and name it in your reply.

## 2. Set the type

The type is `Bug` when the app does something wrong. It is `Feature` when the
issue asks for something that the app does not do.

## 3. Reproduce a bug

Skip this step for a feature request.

1. Check out the latest `origin/main`. Start the app with `pnpm dev`, and open
   the URL that the command prints.
2. Load the configuration, share link, or files that the report gives.
3. Follow the steps of the report.

When the defect shows, note the commit, the steps, and what you saw. When it
does not show, note what you tried, and rate the defect that the report
describes. Task R21-01, issue #290, adds `pnpm verify`. From then on, reproduce
the report with `pnpm verify` instead of this step.

## 4. Propose the priority

| Priority | Meaning                                       |
| -------- | --------------------------------------------- |
| `P0`     | The site does not work, or a user loses data. |
| `P1`     | A main journey fails without a workaround.    |
| `P2`     | A feature fails, and a workaround exists.     |
| `P3`     | A small defect.                               |
| `P4`     | A cosmetic defect.                            |

Rate a feature request by the gap that it closes, on the same scale. The owner
can change the priority later.

## 5. Choose the release

List the open release milestones in version order. The first line is the
current release:

```sh
gh api --paginate repos/ceoloide/ergogen-gui/milestones --jq '.[].title' | grep '^v' | sort -V
```

The priority chooses the release of a bug and of a feature request. For a
feature request, the fix is the change that the request asks for.

- `P0` or `P1`: the current release.
- `P3` or `P4`: the next open release after the milestone of the task that
  makes the fix small. List the open tasks of a release with
  `gh issue list -R ceoloide/ergogen-gui --milestone <release>`, and read the
  Change of each task that touches the same code. When that task is in the last
  release, use that release. When no open task makes the fix smaller, use the
  current release.
- `P2`: never the current release before the owner confirms it. Use the
  release that `P3` gives when it comes after the current release. Otherwise,
  use the first open release after the current release. When no open release
  comes after the current release, write nothing for the item: skip steps 6
  and 7, and ask the owner in your reply.

Do not add the task that makes the fix small to `dependsOn`. `pnpm queue:next`
puts `P3` and `P4` items after every other ready item, whatever their release.
The next-task skill then takes such an item early when the quota allows a task
and no other item is ready, such as while the other items wait for the owner. A
dependency on the task would stop that.

## 6. Write the item

Write the item as one JSON object, in a file outside the clone. The header
comment of `scripts/queue/add.mts` describes every field. Give these values:

- `issue`, `type`, `priority`, and `release`: the values of steps 1, 2, 4, and 5.
- `size`: `S` for one pull request, `M` for about two, and `L` for about four
  dependent ones.
- `mode`: `review` for a feature request. For a bug, `auto` when a test can
  prove the fix, and `review` otherwise.
- `track`: the track of the task that makes the fix small. Without such a task,
  `verification` for a bug and `architecture` for a feature request.
- `evidence`: for a bug, what step 3 found. For a feature request, what the
  reporter needs and the workaround today.
- `change`: what a developer changes, with the files or the behavior.
- `exitCondition`: one check that proves the item is done, such as a test that
  fails on `main` and passes after the change.
- `dependsOn`: the issues of `ceoloide/ergogen-gui` that must close before the
  work can start, or `[]`.

## 7. Add the item

Check the item first. The command prints each change and writes nothing:

```sh
pnpm -s queue:add <item.json> --dry-run
```

When the changes are right, run the command again without `--dry-run`.

- When the command exits with 0, GitHub holds the item. A bug enters the
  Project with the status `Todo`. A feature request enters with the status
  `Proposed`, and the next-task skill skips it until the owner accepts it. An
  item that was in the Project before keeps its status.
- When the command exits with 2, it rejected the item and wrote nothing. Fix
  each value that the output names, and run the command again. When the output
  says that `pnpm queue:add` leaves the comments alone, stop and put the output
  in your reply.
- When the command exits with 1, a read or a write failed. Run the command
  again once, because the script writes only what still differs. When it fails
  again, stop and put the output in your reply.

## When the owner answers

To accept a feature request, the owner sets its status to `Todo` in the
Project. An agent never does.

When the owner confirms a `P2` item for the current release, set `release` to
the current release. When the owner asks for a new release for it, add the
release as [Add a release](#add-a-release) says, and set `release` to it. When
the owner gives another priority, choose the release for that priority as step
5 says. Take each value that did not change from the issue and, when it exists,
from the comment that `pnpm queue:add` wrote on it. Then run steps 6 and 7.

## Add a release

Create the milestone of a release only when the owner asks for it. Write a
release item as the header comment of `scripts/queue/add.mts` shows, and add it
as step 7 says.

## Reply

End with one reply. For each issue that you added, give its number, type,
priority, release, and the result of step 3. Put a `P0` or `P1` bug first.
Then ask the owner each open question:

- For a `P2` item that you added, whether it moves into the current release.
- For a `P2` item that step 5 stopped, its number, type, and the result of step
  3, and whether it goes into the current release or into a new release.
- For a feature request, whether to accept it by setting its status to `Todo`.

Name each issue that you skipped, and the reason.
