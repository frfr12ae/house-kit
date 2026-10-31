# Instructions for AI coding agents

This repo is a library of copy-paste UI components on one design system. Use it when a user asks for a deck, report, page section, chart, motion graphic or AI interface, and wants it to look like their kit.

## Finding a component

- `navigator/registry.js` holds every component as JSON (`window.OK_REGISTRY.components`): `id`, `title`, `description`, `tags`, `category`, `html`, `css`, `js`, `tokens`, `sources`. Search it instead of opening every file.
- Or list `components/<category>/*.html`. Categories are in `kit.json`.

## Using a component in a project

1. Copy the component's `<style>`, markup and `<script>` as one block. Keep the `c-<slug>` root class and the scoped selectors.
2. Make sure the `--ds-*` tokens exist. Either the project already loads `design-system/tokens.css` plus a theme from `design-system/themes/`, or you add a `:where(:root) { ... }` block with only the tokens the component lists in its `tokens` field (values from `design-system/themes/house.css` and `design-system/tokens.css`).
3. If the project has its own brand, map the brand onto the `--ds-*` names in a theme file. Never hardcode colours, fonts, radii or durations inside the component.
4. In a framework project (React, Vue, Svelte, Astro), convert to an idiomatic component with the same class names and tokens. Move the IIFE's work into the framework's mount hook.
5. Keep the credit comment, and replace placeholder copy with real content.

## Adding a component

Follow [CONTRIBUTING.md](CONTRIBUTING.md) exactly, then run `node scripts/build.mjs` and fix every lint error. Credit any source honestly with `@source`; never copy code whose license does not allow it. Do not use en or em dashes; the lint rejects them.
