# Output Kit

Copy-paste templates for decks, reports, page sections, email, social posts, motion graphics, data viz, diagrams, forms and AI interfaces. Every component sits on one token design system, so a single theme file reskins the whole kit to any brand.

**Nothing to install.** Plain HTML, CSS and JavaScript. No package manager, no build step, no network calls, no web fonts. It works offline on a locked-down machine.

## Use it

1. Get the folder: `git clone`, or *Code > Download ZIP* on GitHub if git is not allowed.
2. Open `index.html` in a browser (double-click is fine; it runs from `file://`).
3. Pick a preview theme, open a component, copy.

Each component offers:

| Format | Use it when |
|---|---|
| **Snippet** | Pasting into a page. With *Bundle tokens* on, it carries its own token defaults as zero-specificity `:where(:root)` rules, so it works in any project and never overrides tokens the project already has |
| **HTML / CSS / JS** | You want the parts separately |
| **Standalone file** | You want a complete `.html` file that opens on its own |
| **Prompt for AI** | Handing it to Claude, Cursor or another coding agent: the prompt carries the integration rules and the code, and asks the agent to convert it to the project's framework |

## Layout

```
index.html                 the navigator
design-system/
  tokens.css               spacing, type scale, radii, shadows, motion (theme-independent)
  base.css                 optional minimal reset
  themes/house.css         default theme; copy it to make a brand theme
  themes/nordic.css        demo brand theme
  themes/midnight.css      demo dark brand theme
  themes/ink.css, studio-dark.css   more demo brand themes
components/<category>/     one self-contained .html file per component
skills/<name>/             downloadable agent skills (folder + .zip), shown in the Skills category
LICENSES/                  upstream licenses for adapted code
navigator/                 navigator code + registry.js (generated)
scripts/build.mjs          regenerates registry.js and CREDITS.md, lints components
kit.json                   name, author and categories
```

## Rebrand

Open **Theme builder** in the navigator, start from any theme, change colours, fonts and corner roundness, and watch the preview. Then *Download* the file into `design-system/themes/` and rebuild. Or copy `themes/house.css` by hand and change values, never names.

## Add a component

See [CONTRIBUTING.md](CONTRIBUTING.md). In short: one `.html` file with a metadata comment, a `c-<slug>` root class, scoped CSS, tokens only and an honest `@source` credit. Then:

```bash
node scripts/build.mjs
```

Node 18+ is needed only on the machine where you author components; the generated `navigator/registry.js` is committed, so browsing machines never need it. CI fails if it is stale.

## Using it with AI agents

[AGENTS.md](AGENTS.md) tells a coding agent how to find, use and add components. Point your agent at it, or use the *Prompt for AI* tab on any component.

## Credits

Ideas come from many places, and each component records its source in its metadata. [CREDITS.md](CREDITS.md) lists them all; the navigator has a Credits page. The navigator's sidebar-and-grid layout is inspired by [21st.dev](https://21st.dev/community/components).

## License

[MIT](LICENSE) for everything in this repo unless a component's `@license` says otherwise.
