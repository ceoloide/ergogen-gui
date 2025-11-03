# Changelog

## Load Configurations from Local Files

November 2, 2025

![The welcome page showing the new "From Local File" option with drag and drop support.](./public/images/changelog/2025-11-02.png)

Working with keyboard configurations used to mean you could only start from scratch or load from GitHub. If you had a configuration file saved on your computer, you'd need to copy and paste it manually – and forget about loading custom footprints that way!

Now you can load entire keyboard configurations directly from your computer. Simply click the "Choose File" button or drag and drop any supported file onto the page. The app accepts YAML and JSON configuration files, as well as ZIP and EKB archives that include both the configuration and custom footprints.

When loading archives, the app automatically extracts custom footprints from the `footprints` folder, just like when loading from GitHub. If you already have footprints with the same names, you'll see the same friendly conflict resolution dialog to choose how to handle duplicates.

**What changed:**

- **Local file loading**: Load configurations directly from your computer using YAML, JSON, ZIP, or EKB files
- **Drag and drop support**: Drop files anywhere on the welcome page for quick loading
- **Archive support**: ZIP and EKB archives automatically extract configurations and footprints
- **Conflict resolution**: Same interactive dialog for handling duplicate footprints as GitHub loading

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
