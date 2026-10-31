# Adding a component

One component is one `.html` file in `components/<category>/<slug>.html`. The folder is the category; the filename is the slug. Categories are listed in `kit.json`.

After adding or editing, run:

```bash
node scripts/build.mjs
```

That regenerates `navigator/registry.js` and `CREDITS.md`, and lints every component. Commit all three. Browsing machines never need Node; only the machine where you author components does.

## File layout

```html
<!--
@title Stat strip
@description One sentence: what it is and when to use it.
@tags kpi, numbers, summary
@preview fill
@height 360
@added 2026-10-31
@source Material Design 3 | https://m3.material.io | inspired-by
@license MIT
-->
<style>
  .c-stat-strip { ... }
  .c-stat-strip .item { ... }
</style>

<section class="c-stat-strip"> ... </section>

<script>
(() => {
  document.querySelectorAll('.c-stat-strip').forEach((root) => { ... });
})();
</script>
```

### Metadata

| Field | Required | Meaning |
|---|---|---|
| `@title` | yes | Display name |
| `@description` | yes | One sentence: what it is and when to use it |
| `@added` | yes | `YYYY-MM-DD`, drives "Newest" |
| `@tags` | no | Comma-separated search terms |
| `@preview` | no | `fill` (default, full-width block), `center` (centred on a padded ground) or `slide` (16:9) |
| `@height` | no | Minimum preview height in px. The preview grows to fit content |
| `@replay` | no | `true` shows a replay button (for motion) |
| `@featured` | no | `true` puts it on the home page first |
| `@source` | no | `Name \| URL \| relation`, repeatable. Relation is `inspired-by`, `adapted-from` or `ported-from` |
| `@license` | if code was reused | License of the reused code. Defaults to the repo license (MIT) |
| `@author` | no | Defaults to the kit author |

### Credits are mandatory and honest

- **inspired-by**: the idea or look came from the source, the code is written from scratch. Most components.
- **adapted-from**: code was taken and changed. The source license must allow it, and `@license` must name it.
- **ported-from**: code was taken mostly as is. Same license rule.
- No `@source` means the component is original.

Never copy code from a source whose license does not allow redistribution in a public repo. When in doubt, write it from scratch and use `inspired-by`.

When code is adapted or ported, the upstream license text must be in `LICENSES/` (for example `LICENSES/diagram-design-MIT.txt`), the `@source` must point at the upstream repo, and for Apache-2.0 code the file must say in a comment that it was changed.

## Rules the build enforces

1. **Root class.** The outermost element carries `class="c-<slug>"`.
2. **Scoped CSS.** Every selector includes `.c-<slug>`. `@keyframes` names start with `c-<slug>`. No `:root`, `body` or bare element selectors, so pasting never leaks.
3. **No en or em dashes** anywhere in the file. Use a comma, colon or full stop.
4. **IIFE scripts.** JavaScript is wrapped in `(() => { ... })();`, finds its roots with `document.querySelectorAll('.c-<slug>')` and initialises each one. No globals, no libraries, no network.

## Rules for the design system

- **Tokens only.** Colours, fonts, radii, shadows, spacing and durations come from `--ds-*` variables (see `design-system/tokens.css` and `design-system/themes/house.css`). The build warns on hardcoded hex or rgb colours in CSS. `color-mix(in srgb, var(--ds-x) 20%, transparent)` is the way to get a tint.
- **Colour means a category.** `info` for data and results, `neutral` for system and given, `note` for annotation and positive, `highlight` for the one step that matters, `danger` for errors and negative change. Never colour something just to make it louder.
- **Mono only for code, paths and literal data.** Headings and labels use the sans.
- **One display element per component**: a title or one big number, not both.
- **Air over density.** Generous padding; hierarchy by nesting containers, not heavier borders.
- **Slides** (`@preview slide`): the root is `width: 100%; aspect-ratio: 16 / 9; container-type: inline-size;` and sizes everything in `cqi` units, so a slide scales to any width.
- **Motion** reads `--ds-dur-*` and `--ds-ease*`, and respects `prefers-reduced-motion` (the tokens drop to 0ms; JS animations check `matchMedia('(prefers-reduced-motion: reduce)')`).
- **Email** (`components/email/`): table-based layout, styles inline on elements (`style="color: var(--ds-ink)"`), widths in px, max 600px wide. Use `var(--ds-*)` freely: the navigator replaces every variable with the selected theme's value when copying, because email clients ignore CSS variables. No JavaScript in the email markup.
- **Social** (`components/social/`): `@preview center`, root `width: min(540px, 100%); aspect-ratio: 4 / 5; container-type: inline-size;`, sizes in `cqi`, so it exports at 1080x1350 by scaling.
- **Fonts**: `--ds-font-sans`, `--ds-font-display`, `--ds-font-serif` (editorial quotes), `--ds-font-hand` (hand annotations only), `--ds-font-mono`.
- **Responsive.** Works from 360px wide upward. Test the mobile viewport in the navigator.
- **Accessible.** Real buttons, labels on inputs, `aria-*` where a widget needs it, visible focus via `var(--ds-focus)`.
- **Realistic placeholder copy**, never lorem ipsum.

## Adding a brand theme

Copy `design-system/themes/house.css` to `design-system/themes/<brand>.css`, change values (never names), run the build. Or use **Theme builder** in the navigator, which exports the file for you.
