# Changelog

## Load Configs From Local Files

November 02, 2025

![Selecting a local Ergogen archive with the new load button.](./public/images/changelog/placeholder.png)

You told us that sharing designs over GitHub was overkill when the file was already sitting on your desktop. Until now, the only workaround was to copy and paste YAML manually, which meant losing any custom footprints the project depended on.

The welcome screen now includes a "Load File" option that understands Ergogen configurations in plain YAML/JSON as well as zipped `.zip` and `.ekb` archives. Drop in an archive and the app automatically imports the `config.yaml` along with every footprint under the `footprints` folder, prompting you when a footprint name collides with something you've already loaded. If the archive is missing the required `config.yaml`, you'll get a clear error so you can fix it right away.

**What changed:**

- **Local file loader**: New button on the welcome screen accepts `.yaml`, `.yml`, `.json`, `.zip`, and `.ekb` files
- **Archive footprint import**: Automatically loads footprint scripts from the `footprints` directory inside local archives
- **Conflict resolutions reused**: Existing skip/overwrite/keep-both dialog now appears for locally loaded footprints too
- **Helpful errors**: Archives missing a root `config.yaml` surface a direct explanation instead of failing silently

## Load Keyboards Directly from GitHub

October 13, 2025

![The settings page showing footprints loaded from GitHub.](./public/images/changelog/2025-10-13.png)

Ever wanted to share your keyboard design with a friend or try out someone else's layout? You can now load complete keyboard configurations directly from GitHub, including all the custom footprints!

Previously, loading a configuration from GitHub only brought in the basic layout file. You'd have to manually recreate any custom components (like special switches or connectors) that the design depended on. This was time-consuming and error-prone, often leading to confusing errors about missing parts.

Now, when you load a keyboard from GitHub, the app automatically discovers and loads all custom footprints from the repository – even those stored in separate libraries using Git submodules. If you already have a footprint with the same name, you'll get a friendly dialog asking whether to skip, overwrite, or keep both versions.

The app also got smarter about finding configurations. It can now search through entire repositories to locate the right files, and it'll warn you if you're running low on your hourly request allowance so you know to take a break before trying again.

**What changed:**

- **Automatic footprint loading**: Custom components are now loaded alongside configurations from GitHub repositories
- **Smart conflict resolution**: Interactive dialog lets you choose how to handle duplicate footprint names
- **Git submodule support**: Loads footprints from external libraries referenced in the repository
- **Intelligent file discovery**: Searches entire repositories to find configuration files in any location
- **Usage monitoring**: Proactive warnings when approaching GitHub's request limits, with clear guidance
- **Better feedback**: Loading progress bar now appears when fetching from GitHub
