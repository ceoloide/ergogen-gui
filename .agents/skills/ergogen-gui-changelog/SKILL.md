---
name: ergogen-gui-changelog
description: Decide whether an Ergogen Web UI change needs a CHANGELOG.md entry and write it in the repository's blog-post style. Use when finishing or describing a user-facing change in ceoloide/ergogen-gui or when asked to edit its changelog; not for release notes or changelogs of other projects.
---

# Ergogen Web UI changelog

`CHANGELOG.md` at the repository root tells users what changed, newest entry
first, directly under the `# Changelog` heading.

## When to add an entry

Add one for new features, major enhancements, bug fixes users would notice and
changes to how people work with the app.

Skip internal refactoring, dependency updates, minor fixes and documentation-only
changes. If unsure, ask the owner rather than adding a marginal entry.

## Entry shape

Keep each entry under 300 words and write it for users, not contributors:

```markdown
## Feature Title

Month D, YYYY

![What the screenshot shows.](./public/images/changelog/YYYY-MM-DD.png)

What was difficult or broken before, in one or two sentences.

How it works now and why that is better, in two or three sentences.

**What changed:**

- **Key change**: What users can now do.
- **Another change**: How it improves their work.
```

- **Title**: a short name for the change in title case, as a level-two heading.
- **Date**: the full month name and an unpadded day, such as `November 3, 2025`.
  Use the date the owner gives or the date the change ships; ask if neither is
  known instead of guessing.
- **Screenshot**: optional. Include one only when a real image of the change
  exists, stored in `public/images/changelog/` and linked with a relative
  `./public/...` path and descriptive alt text. Do not create, generate or
  reference placeholder images.
- **Problem and solution**: plain prose paragraphs, with UI labels in bold and
  code, file and option names in backticks.
- **What changed**: three or so bullets, each starting with a bold label and a
  colon.

Writing an entry does not by itself authorize committing, pushing or publishing
it; follow the scope of the task at hand.
