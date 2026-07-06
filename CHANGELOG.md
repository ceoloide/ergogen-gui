# Changelog

## Recent Configurations Preview (Pick up where you left)

July 06, 2026

![The welcome page showing the new Recent Configurations section displaying visual layouts of your recently edited keyboards.](./public/images/changelog/placeholder.png)

When launching the Ergogen Web UI, returning to your active projects meant manually browsing the side panel search or opening layouts one by one to check their visual shapes. There was no visual "dashboard" to quickly identify and resume working on your most recently edited designs from the entry page.

Now, a new "Pick up where you left" section greets you directly on the welcome page, showcasing up to 4 of your most recently edited configurations. Each layout is rendered as a visual preview card showing the compiled board shape alongside its name. Under the hood, multi-config storage has been upgraded to version 2 to embed clean, dark-themed SVG previews, which are compiled in the background for your legacy layouts to ensure your dashboard is immediately complete and responsive.

**What changed:**

- **Dashboard Recent Section**: Added a "Pick up where you left" section to the welcome page displaying cards for the 4 most recently modified keyboards
- **Visual Previews**: Show the compiled keyboard shape inline on each card with a dark style matching the examples
- **Fallback Glyph**: Center a `keyboard_off` icon on the card if a configuration is empty or fails to compile
- **Background Compiler**: Automatically generate preview SVGs in the background for all legacy and version 1 configurations without blocking the UI or running heavy STL conversions
- **Storage Version 2**: Upgraded the multi-configuration schema to version 2 to store formatted preview SVGs in local storage

## Multi-Configuration Management System

July 06, 2026

![The sidebar showing multiple configurations at once and the Download All button.](./public/images/changelog/2026-06-06.png)

Managing multiple keyboard design variations previously required manually copying and pasting configurations, importing files over and over, or managing multiple browser tabs. There was no native way to save, organize, or quickly switch between different board setups inside the GUI, making iteration on layout alternatives slow and error-prone.

Now you can create, save, rename, duplicate, and switch between multiple configurations directly inside the workspace. A new sidebar navigation lists all your saved configurations with search support, inline renaming, and quick duplication or deletion. You can also export all your designs as a bulk compilation, bundling all your keyboard variants into a single ZIP archive.

**What changed:**

- **Native Multi-Configuration Workspace**: Created a side navigation panel to manage, switch, search, and organize multiple configurations
- **Inline Actions**: Perform inline renaming, deletion, and layout duplication for any saved design
- **Bulk Compilation Export**: Added an "Export All" option that compiles and packages all saved configurations in a single ZIP folder structure
- **Preview Mode**: Enabled temporary shared URL preview loading alongside your permanent saved layouts
- **Data Migration**: Automatically migrates legacy configuration storage formats into the new system without data loss

## Custom Templates Support in GUI

July 05, 2026

![The settings panel showing the custom library tabs and a custom outline.](./public/images/changelog/2026-06-05.png)

Creating and editing custom outlines or templates previously required running the tool offline. You had no way to create, view, or manage your custom Ergogen outlines or templates inside the web interface.

Now you can manage custom templates directly from the settings panel, complete with template name editing, code editing, and conflict resolution. You can add, load from local files or folders, and fetch directly from a `templates/` or `outlines` directory in your GitHub repositories. When exporting, your custom templates are also saved in the generated ZIP.

**What changed:**

- **GUI for custom templates**: Created a new tab in custom libraries to add, edit, and delete templates in your design
- **GitHub & local ZIP template extraction**: Automatically extract templates from `templates/` folder when loading from GitHub or local archives
- **Clean template exports**: Save footprints, outlines, and templates to their respective directories when downloading the configuration ZIP
- **Default boilerplate structures**: Added helper boilerplates for newly created custom templates and custom outlines

## Share A Link To Your Keyboard Configuration

November 3, 2025

![The share dialog showing a sharable configuration link with copy button.](./public/images/changelog/2025-11-03.png)

Sharing your keyboard design with others used to be a hassle. You'd have to export your configuration file, package up all your custom footprints separately, and send multiple files or links. The recipient would then need to load everything manually, making collaboration tedious and error-prone.

Now you can share your entire keyboard configuration – including all custom footprints – with a single link. Click the share button and a dialog appears with your personalized shareable URL. The link is automatically copied to your clipboard, ready to paste anywhere. Recipients can simply click the link to load your complete configuration with all custom components intact.

**What changed:**

- **Shareable links**: Generate a single URL that contains your keyboard configuration
- **Complete configuration sharing**: All custom footprints and templates are included in the shared link

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
