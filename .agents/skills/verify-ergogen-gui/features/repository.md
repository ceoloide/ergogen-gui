# Repository loading

The user names a repository on GitHub, Codeberg, or a Forgejo host, or links
to a YAML file in one. The app reads the configuration and the footprints,
outlines, and templates next to it, opens the configuration in the editor,
adds the injections to Custom Libraries, and generates.

## Sub-features

- `repo-github` loads `user/repo` or a GitHub URL that the user types in the
  field `Repository URL or path` of the Welcome page, with GitHub chosen in
  `Repository provider source`, which is the default.
- `repo-codeberg` and `repo-forgejo` load from Codeberg, or from the Forgejo
  or Gitea host that the address names, when the user chooses that provider.
- `repo-config-search` reads `config.yaml` or `config.yml` at the root, then
  in the folder `ergogen`, and then searches the repository for a YAML file. It
  searches the branch `main`, and the branch `master` when `main` fails.
- `repo-file` loads the YAML file that a link to a file names.
- `repo-injections` loads each `.js` file of the folder `footprints` next to
  the configuration as a footprint, named by its path in that folder without
  `.js`. While the feature flags are on, it loads the folders `outlines`, which
  can also hold `.svg` files, and `templates` the same way.
- `repo-submodules` loads the footprints of each submodule in `.gitmodules`
  whose path is below the folder `footprints`.
- `repo-address` loads the repository that `?github=`, `?codeberg=`,
  `?forgejo=`, or `?gitea=` in the address names, when the app opens.
- `repo-conflict` asks the user to skip, overwrite, or keep both when an
  injection has the name of a stored one.
- `repo-error` shows an error banner that starts with
  `Failed to load from GitHub repository:`, or the name of the other
  provider, and a warning when GitHub limits the requests.

## How to get to it (user POV)

- On the Welcome page, type `user/repo` or a link in `Repository URL or path`
  under `From Repo`, and choose `Load configuration from repository` or press
  Enter.
- Choose another provider in `Repository provider source` first.
- Open the address of the app with `?github=user/repo`.

## Driving it with pnpm verify

Journey: `pnpm verify repository` runs
`e2e/journeys/repository.journey.ts`.

Preconditions:

- A new browser context with empty storage at `/`, so Custom Libraries is
  empty and no conflict dialog shows.
- The repository `journey-owner/journey-keyboard`, which the journey serves
  through routes for `raw.githubusercontent.com` and `api.github.com` before it
  opens the app. Its branch `main` holds `config.yaml`, which places the
  footprint `journey_marker` at each of four keys of the PCB `board`, and
  `footprints/journey_marker.js`, whose designator is `JM`. Every other path
  answers 404.

- **Open the app.** Go to `/`. The heading `Ergogen Web UI` is visible.
- **Load journey-owner/journey-keyboard From Repo.** Fill the textbox
  `Repository URL or path` and choose the button
  `Load configuration from repository`. The editor shows
  `what: journey_marker` within 30 seconds. `observed.read` lists the files
  that the app read.
- **Wait for the outputs.** The label `Download board.kicad_pcb` appears
  within 30 seconds, and no error banner shows.
- **Download board.kicad_pcb from Outputs.** The saved PCB holds the footprint
  `journey_marker` with the references `JM1` to `JM4`, which only the served
  footprint can give. `observed.pcb` keeps them.
- **Proof.** `reports/verify/repository/` holds a screenshot and an ARIA
  snapshot after each step, and `result.json` with the observed values.

The journey does not drive `repo-codeberg`, `repo-forgejo`, the fallbacks of
`repo-config-search`, `repo-file`, outlines and templates of
`repo-injections`, `repo-submodules`, `repo-address`, `repo-conflict`, or
`repo-error`. Do not report them as verified by this journey.

`pnpm test:e2e` covers part of the feature too. `e2e/github-loading.spec.ts`
loads mocked repositories from the field and from `?github=`, with a
submodule and with a link to a file, and checks the conflict dialog of a
second load. `src/utils/github.test.ts` and `src/utils/gitProvider.test.ts`
check the parsing of the address and the order of the searches without a
browser.

## Gotchas

- The fixture of `e2e/fixtures.ts` blocks every request to another host.
  Register the routes of the repository on the page before the journey loads
  it, or the load fails with an error banner.
- The app lists a folder through the contents API of `api.github.com` and
  reads each file from `raw.githubusercontent.com`. A route must answer both.
- Each missing folder, such as `outlines`, and `.gitmodules` answer 404. The
  app treats that as an empty folder, so it shows no error.
- The editor shows the configuration before the generation ends. Wait for an
  output, and read the PCB, to prove that the footprint reached Ergogen.
