# @suneyde/web-tokens

[![npm version](https://img.shields.io/npm/v/@suneyde/web-tokens.svg)](https://www.npmjs.com/package/@suneyde/web-tokens)

Design tokens for the web. A single source of truth for color, spacing, and typography, authored as [W3C DTCG](https://www.designtokens.org/) JSON and compiled with [Style Dictionary](https://styledictionary.com/) into CSS custom properties, ready-made typography classes, and typed JavaScript values.

## Install

```bash
pnpm add @suneyde/web-tokens
```

## Usage

The package ships three entry points. Import the CSS once at your app's root, then reference the tokens anywhere.

### CSS variables

```ts
// main.tsx / index.ts, before your own styles
import "@suneyde/web-tokens/css";
```

```css
.card {
  background: var(--color-bg);
  color: var(--color-fg);
  padding: var(--space-inset-md);
  border-radius: 8px;
}
```

### Typography classes

```ts
import "@suneyde/web-tokens/typography";
```

```tsx
<h1 className="text-display-xl">Heading</h1>
<p className="text-body-md">Body copy.</p>
```

### Typed values in JS

For the cases a stylesheet can't cover (passing a value to a charting library, inline logic):

```ts
import { ColorAccent } from "@suneyde/web-tokens";
```

Types ship with the package, so these are fully autocompleted. Check `dist/tokens.js` for the exact export names.

## Fonts

The kit uses exactly two font families, each exposed as a CSS variable you can override:

| Variable                | Role                                      | Default                                       |
| ----------------------- | ----------------------------------------- | --------------------------------------------- |
| `--font-family-sans`    | UI and body text (headlines, labels…)     | `system-ui, -apple-system, …, sans-serif`     |
| `--font-family-display` | Large display headings (`text-display-*`) | `Georgia, Cambria, Times New Roman, …, serif` |

The defaults are **system font stacks** — they render on every platform with no webfont to load, so
the kit looks right out of the box. Every typography class references these variables, so changing a
variable updates **all** the matching text styles at once — you never edit individual classes.

### Changing a font

Customizing is two steps: **load** the font, then **point** the variable at it.

**1. Load the font.** Use whichever method your project already prefers.

- **[Fontsource](https://fontsource.org/)** (self-hosted via npm — recommended for app bundlers):

  ```bash
  pnpm add @fontsource/playfair-display
  ```

  ```ts
  // main.tsx / index.ts — import the weights you use
  import "@fontsource/playfair-display/600.css";
  ```

- **Google Fonts** (CDN `<link>` in your HTML `<head>`):

  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap"
    rel="stylesheet"
  />
  ```

- **Self-hosted** (`@font-face` in your own CSS):

  ```css
  @font-face {
    font-family: "Playfair Display";
    src: url("/fonts/PlayfairDisplay-SemiBold.woff2") format("woff2");
    font-weight: 600;
    font-display: swap;
  }
  ```

**2. Point the variable at it.** In your own global stylesheet, override the variable in `:root`
**after** the package's CSS is imported. The order matters — your `:root` wins because it comes last:

```ts
// main.tsx / index.ts
import "@suneyde/web-tokens/css"; // defaults first
import "./app.css"; // your overrides last
```

```css
/* app.css */
:root {
  --font-family-display: "Playfair Display", Georgia, serif;
  /* --font-family-sans: "Söhne", system-ui, sans-serif; */
}
```

Always include fallback families after your custom one — they render while the webfont loads and if
it ever fails.

### Reverting

To go back to the kit's defaults, **delete your override** (and, if you like, the font you loaded).
With no `--font-family-display` / `--font-family-sans` in your `:root`, the values shipped in
`@suneyde/web-tokens/css` take over again. There's nothing to "uninstall" — the override is the only
thing you added.

> Importing `@suneyde/web-tokens/typography` on its own still works without `./css`: each class
> falls back to the default stack baked into `var(--font-family-*, …)`. Import `./css` (or set your
> own `:root` values) to customize.

## What's inside

**CSS variables** (`./css`) cover the primitive and semantic layers:

- Color: `--color-bg`, `--color-fg`, `--color-accent`, plus the raw ramp (`--color-neutral-0`, `--color-brand-500`, ...)
- Spacing: a 4px scale, `--space-1` through `--space-8`, plus semantic `--space-inset-*`, `--space-stack-*`, `--space-inline-*`
- Type primitives: `--font-family-sans`, `--font-family-display` (see [Fonts](#fonts)), `--font-size-xs` through `--font-size-4xl`, `--font-weight-regular|medium|semibold`

**Typography classes** (`./typography`) are complete text styles, one class each. Each one references
`--font-family-sans` or `--font-family-display`, so overriding those variables restyles every class:

| Group    | Classes                                                                 |
| -------- | ----------------------------------------------------------------------- |
| Display  | `text-display-xl` `text-display-lg` `text-display-md` `text-display-sm` |
| Headline | `text-headline-lg` `text-headline-md` `text-headline-sm`                |
| Body     | `text-body-lg` `text-body-md` `text-body-sm`                            |
| Label    | `text-label-lg` `text-label-md` `text-label-sm`                         |

`prepublishOnly` rebuilds `dist` automatically before each publish.

## License

MIT
