# Branch rules

[Branch rules in DEVELOPMENT.md](../../DEVELOPMENT.md#branch-rules) states what
these settings require of a pull request. This file records why and how the
owner applied them, and holds the owner's procedures to check, re-apply, and
roll back the settings and to change the required check.

Since 2026-11-15 (UTC), GitHub has enforced two repository settings, recorded in
the [cutover record](#cutover-record). The ruleset `main: require CI` (ID 27290096) gates merges into `main`, and the Actions token defaults are
read-only. Two reviewed payloads define these settings, and
`pnpm check:settings` reports whether GitHub still enforces them:

- `scripts/ci/ruleset-proposal.json` defines a ruleset for the default branch
  only. It requires a pull request with resolved conversations and the
  `lint-and-test` check from the GitHub Actions app on a branch up to date with
  `main`. It also blocks force pushes and deletion, with no bypass. It requires
  no approvals because the owner is the only collaborator and GitHub does not
  count an author's approval of their own pull request. Automated tests keep it
  aligned with the contract.
- `scripts/ci/workflow-permissions-proposal.json` sets the default
  `GITHUB_TOKEN` to read-only and stops Actions from approving pull requests.
  Every job in `ci.yaml` and `deploy.yaml` declares explicit permissions at the
  job or workflow level, and tests verify those declarations, so `deploy` and
  `rollback` keep `contents: write`. GitHub's own `pages-build-deployment` run,
  which serves `gh-pages`, also declares its own permissions, recorded as
  `contents: read` and `pages: write` in its logs.

While the ruleset is active, nobody can push to `main`, including the owner.
Merges require a fresh `lint-and-test` run on a branch that is up to date with
`main` using **Update branch**, `gh pr update-branch`, or a rebase. The ruleset
does not cover `gh-pages`, so releases and rollbacks are unchanged. Open pull
requests without such a check are blocked as intended.

## Limits

These branch rules are a merge gate for ordinary pull requests, not confinement:

- GitHub accepts a required check that concludes `success`, `skipped`, or
  `neutral`. See
  [GitHub's required status checks documentation](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks).
  Skipped tests in a running job fail the job and block the merge, but a pull
  request that skips the whole job, for example with a job-level `if:` in its
  own `ci.yaml`, passes. The [assessor](../../DEVELOPMENT.md#pull-request-evidence) rejects a
  skipped job and any missing, skipped, or failed required step, but the ruleset
  does not run it.
- The GitHub Actions app reports the check from the workflow in the pull request
  itself. A pull request that keeps the job and step names, changes what the
  steps run, and writes passing reports and evidence passes both the ruleset and
  the assessor. Both check names, conclusions, and reports rather than commands,
  so only trusted review of workflow and script changes catches that.
- The owner is an admin and can change or delete the ruleset at any time. Having
  no bypass means only that the rules also apply to the owner's merges and
  pushes. Confining an agent would need a separate non-admin account and trusted
  review, such as required code-owner approval from another identity. That setup
  is out of scope here.

## Settings check

`pnpm check:settings` performs read-only checks and must run as the owner
because only admins can read a ruleset's bypass list. It exits 0 when all of
these conditions hold:

- The live ruleset contains every value of the proposal, has the exact same
  rules, and cannot be bypassed by you. The checker ignores defaults that GitHub
  adds for unnamed parameters.
- The Actions workflow permission defaults match the proposal.
- Across all active repository and organization rulesets, `main` receives
  exactly the proposal's rules and `gh-pages` receives none.

Otherwise, `pnpm check:settings` exits 1 with a list of differences, as it did
before the cutover, or exits 2 if it cannot run. `tests/settings-check.test.ts`
covers it with the recorded pre-cutover responses and one test per weakened
setting or foreign rule.

## Cutover

These steps applied the settings on 2026-11-15, and the
[cutover record](#cutover-record) lists what each step returned. Run them again
only to re-apply the settings after a [rollback](#rollback), using a new
snapshot directory. Only the owner runs them, from a clean checkout of the
reviewed commit that holds the proposals, which is the head of `main` after the
pull request that last changed them merged. Each stage can be rolled back alone.

1. **Take a snapshot.** Save the start state outside the checkout and keep it
   until you confirm the cutover:

   ```shell
   repo=repos/ceoloide/ergogen-gui
   snap="$HOME/ergogen-gui-settings-$(date -u +%Y%m%dT%H%M%SZ)"; mkdir "$snap"
   echo "$snap"                                   # record this path
   git rev-parse HEAD > "$snap/reviewed-commit"   # the commit every later step runs from
   git status --porcelain                         # expect no output
   gh api "$repo/rulesets?includes_parents=false" > "$snap/rulesets.json"
   gh api "$repo/actions/permissions/workflow" > "$snap/workflow-permissions.json"
   gh api "$repo/branches/main/protection"   # expect: Branch not protected (HTTP 404)
   pnpm check:settings                       # expect exit 1, three problems
   ```

   Before you continue, verify all five checks. `reviewed-commit` must match the
   reviewed head of `main`, `git status --porcelain` must print nothing,
   `rulesets.json` must be `[]`, `workflow-permissions.json` must be
   `{"default_workflow_permissions":"write","can_approve_pull_request_reviews":true}`,
   and `main` must not be protected. Otherwise, review the difference first
   because the rollback below would not restore the start state.

   If you run a later step in a new shell, set `repo` and `snap` to the existing
   directory that `echo "$snap"` printed. Do not rerun the `snap=` line or
   `mkdir` above because that creates a new empty directory:

   ```shell
   repo=repos/ceoloide/ergogen-gui
   snap='<existing directory step 1 printed>'
   ```

2. **Record the baseline.** Run `gh pr view <number> --json mergeStateStatus`
   for the pull requests used in the [drill](#drill). Open the drill's failing
   pull request now so you can compare each later state with this baseline.
   Opening it switches your checkout to a new branch, so wait until the drill
   commands return it to the reviewed commit before you continue.
3. **Update Actions defaults.** Apply the workflow permissions proposal and
   confirm that only the ruleset difference remains:

   ```shell
   gh api --method PUT "$repo/actions/permissions/workflow" --input scripts/ci/workflow-permissions-proposal.json
   pnpm check:settings   # expect exit 1, only the ruleset problem left
   ```

4. **Create the ruleset.** Apply the ruleset proposal, save its ID, and confirm
   enforcement:

   ```shell
   gh api --method POST "$repo/rulesets" --input scripts/ci/ruleset-proposal.json --jq .id > "$snap/ruleset-id"
   pnpm check:settings   # expect: ENFORCED, exit 0
   ```

5. **Run the drill.** Follow [Drill](#drill) below. Its passing row needs a real
   pull request that is up to date with `main`. Read its state before anything
   merges, then merge it as usual. That merge and its release are the first
   under the new settings. Check that its `deploy` job log lists
   `Contents: write` under "GITHUB_TOKEN Permissions" and that its `smoke` job
   passes. Then update the status at the top of this file and in
   [Branch rules in DEVELOPMENT.md](../../DEVELOPMENT.md#branch-rules), and the
   [cutover record](#cutover-record).

## Drill

The drill proves the gate without merging anything. Do not use `gh pr merge` as
a probe because it merges a pull request that passes. Read the merge state
instead:

```shell
gh pr view <number> --json mergeStateStatus,headRefOid
```

Only `CLEAN`, `UNSTABLE`, and `HAS_HOOKS` can merge. `UNSTABLE` means a
non-required check failed. `BLOCKED` means a required rule is not met, and
`BEHIND` means the branch must be updated first. GitHub does not document which of `BLOCKED` or
`BEHIND` it reports when both apply. GitHub computes the state lazily, so repeat
the command if it returns `UNKNOWN`. Because `pnpm check:settings` confirms that
you cannot bypass the ruleset, these states apply to the owner too.

After step 4, expect these merge states:

| Pull request                                          | Before     | After                 |
| ----------------------------------------------------- | ---------- | --------------------- |
| Failing `lint-and-test` (opened for the drill)        | `UNSTABLE` | `BLOCKED`             |
| No `lint-and-test` run on its head                    | `CLEAN`    | `BLOCKED` or `BEHIND` |
| Passing `lint-and-test`, behind `main`                | `CLEAN`    | `BEHIND` or `BLOCKED` |
| Passing `lint-and-test`, up to date, threads resolved | `CLEAN`    | `CLEAN` (step 5)      |

Open a new pull request only for the failing row. For the two middle rows, use
an open pull request that already matches, if one exists. Inspect
`statusCheckRollup` to see whether `lint-and-test` ran on `headRefOid` and how
it concluded:

```shell
gh pr view <number> --json statusCheckRollup,headRefOid,baseRefOid
```

If no open pull request matches a row, record that row as unavailable instead of
opening one for it. The drill then does not cover that row.

The failing pull request adds one failing test on top of the current `main`.
Open it from the cutover checkout in the shell of step 1, and only when
`git status --porcelain` prints nothing. In a new shell, set `snap` to the
recorded directory first as step 1 shows. Each run creates a new branch named
`drill/required-check-` followed by the UTC time and a random suffix, and saves
the name in `$snap/drill-branch` so a branch left over from an earlier drill is
never reused. The subshell in parentheses stops at the first command that fails
so a failed `git switch -c` cannot commit on or push another branch. Do not add
`||` or `&&` after the closing parenthesis because the shell then ignores
`set -e` inside it. The last three lines run either way and return to the
reviewed commit without discarding anything. If `git status --porcelain` prints
anything there, the drill stopped partway and you must read the error before
trying again.

```shell
(
set -eu
test -d "$snap"                        # the directory of step 1
test -z "$(git status --porcelain)"    # stops on local changes
branch="drill/required-check-$(date -u +%Y%m%dT%H%M%SZ)-$(od -An -N3 -tx1 /dev/urandom | tr -d ' \n')"
printf '%s\n' "$branch" > "$snap/drill-branch"
git fetch origin main
git switch -c "$branch" origin/main
cat > tests/drill.test.ts <<'TEST'
import { expect, it } from 'vitest';

it('fails on purpose for the branch rules drill; never merge', () => {
  expect(true).toBe(false);
});
TEST
git add tests/drill.test.ts
git commit -m 'test: fail on purpose for the branch rules drill (never merge)'
git push -u origin "$branch"
gh pr create --base main --head "$branch" --title 'Branch rules drill: failing check (never merge)' --body 'Must show BLOCKED once the ruleset is active. Close without merging.'
)
git status --porcelain                                # expect no output
git switch --detach "$(cat "$snap/reviewed-commit")"  # refuses rather than discard changes
git rev-parse HEAD                                    # expect the reviewed commit
```

Run steps 3 and 4 from that detached checkout. Once `lint-and-test` has failed
and you have read the state after step 4, close the pull request by its saved
branch name. In a new shell, set `snap` first:

```shell
branch="$(cat "$snap/drill-branch")" && gh pr close "$branch" --delete-branch
```

Because a pull request of this repository can still change `ci.yaml`, the drill
proves only that the required check gates merges, not that the check is honest.
See [Limits](#limits).

## Cutover record

The owner applied the settings on 2026-11-15 (UTC) from `main` at `81604c2`. The
pull request that added the proposals and this runbook (#245) had already
merged, so the reviewed commit was the head of `main`, not an unmerged cutover
branch as an earlier version of these steps assumed.

The cutover recorded these stages:

- **Snapshot.** Saved in `ergogen-gui-settings-20261115T015515Z` in the owner's
  home directory. It recorded no rulesets, an unprotected `main` branch, and
  Actions defaults set to `write` and able to approve pull requests.
  `pnpm check:settings` exited 1 with three problems. Keep this directory
  because [Rollback](#rollback) uses it until the settings are applied again.
- **Actions defaults.** Set to `read` and unable to approve pull requests.
  `pnpm check:settings` then reported only the missing ruleset.
- **Ruleset.** Created ruleset 27290096 (`main: require CI`), active on the
  default branch only with no bypass actors, so the owner can never bypass it.
  It blocks deletion and force pushes, requires a pull request with resolved
  threads and no approvals, and requires `lint-and-test` from the GitHub Actions
  app (ID 15368) on a branch that is up to date with `main`. GitHub applies
  exactly these four rules to `main` and none to `gh-pages`.
  `pnpm check:settings` reported `ENFORCED` and exited 0, and reported the same
  after the drill.

The drill recorded these merge states with `gh pr view`:

| Pull request                                                           | Before                     | After                                         |
| ---------------------------------------------------------------------- | -------------------------- | --------------------------------------------- |
| #246, failing `lint-and-test`, head `187f8e8` on `81604c2`             | `UNSTABLE` (check running) | `BLOCKED` while pending and after the failure |
| #93, no `lint-and-test` on its head, 235 commits behind `main`         | `CLEAN`                    | `BEHIND`                                      |
| #209, passing `lint-and-test` from July 2026, 20 commits behind `main` | `CLEAN`                    | `BEHIND`                                      |
| #247, passing `lint-and-test`, head `c2cc92c` on `81604c2`, no threads | —                          | `CLEAN`                                       |

Follow-up observations from the drill and merge:

- #246 failed only on purpose. In run 43665718955, format, lint, and types
  passed, and `tests/drill.test.ts` was the one failed unit test (724 passed).
  It was closed without merging. `gh pr close --delete-branch` deleted only its
  remote branch. The local `drill/required-check` branch (`187f8e8`) stayed in
  the owner's checkout. For that reason, the drill now creates a unique branch
  name each time.
- #93 and #209 show that the ruleset now blocks both, but #93 is behind `main`
  as well as missing the check, and GitHub reports one state. The drill
  therefore did not isolate the missing-check row from the stale row.
- #247, which added this record, read `CLEAN` at head `c2cc92c`, up to date with
  `main` at `81604c2`. Its run 43667010586 (job 132668524192) passed 724 unit
  tests and 26 browser tests with none skipped, and `pnpm check:settings` still
  reported `ENFORCED`. That check applied to that head only. Every later push
  needs its own passing run before a pull request can merge.
- #247 merged at `40061af` on 2026-11-15 (UTC), and its release
  ([run 43670475998](https://github.com/ceoloide/ergogen-gui/actions/runs/43670475998))
  deployed under the new defaults and passed its `smoke` job. The rollout
  tracker #226 is closed. The last release before the cutover (run 43655577978)
  had already listed `Contents: write` for `deploy` from the job's own
  permissions.

## Rollback

Rollback restores the saved snapshot. In a new shell, first set `repo` and
`snap` to the recorded directory from step 1, and do not rerun the `snap=` line
from step 1. Run these commands to remove the ruleset, restore the Actions
defaults, and compare the live settings with the snapshot:

```shell
gh api --method DELETE "$repo/rulesets/$(cat "$snap/ruleset-id")"
gh api --method PUT "$repo/actions/permissions/workflow" --input "$snap/workflow-permissions.json"
diff <(gh api "$repo/rulesets?includes_parents=false") "$snap/rulesets.json"
diff <(gh api "$repo/actions/permissions/workflow") "$snap/workflow-permissions.json"
```

You can run either of the first two commands alone to undo only its stage. If a
problem outside the repository, such as a GitHub outage, prevents pull requests
from passing the required check, delete the ruleset with the first command.
Later, recreate it with step 4, which records the new ID, and run
`pnpm check:settings`. Because `scripts/ci/ruleset-proposal.json` holds the
whole ruleset, nothing else needs saving.

To change the required check itself, such as renaming the job, change
`scripts/ci/contract.mts`, `.github/workflows/ci.yaml`, and
`scripts/ci/ruleset-proposal.json` in one pull request. Because that pull
request cannot report the old check, finish review first. Then update the live
ruleset from its checkout with
`gh api --method PUT "$repo/rulesets/<id>" --input scripts/ci/ruleset-proposal.json`,
run `pnpm check:settings`, and merge the pull request.
