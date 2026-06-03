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

## What's inside

**CSS variables** (`./css`) cover the primitive and semantic layers:

- Color: `--color-bg`, `--color-fg`, `--color-accent`, plus the raw ramp (`--color-neutral-0`, `--color-brand-500`, ...)
- Spacing: a 4px scale, `--space-1` through `--space-8`, plus semantic `--space-inset-*`, `--space-stack-*`, `--space-inline-*`
- Type primitives: `--font-family-sans`, `--font-family-display`, `--font-size-xs` through `--font-size-4xl`, `--font-weight-regular|medium|semibold`

**Typography classes** (`./typography`) are complete text styles, one class each:

| Group    | Classes                                                                 |
| -------- | ----------------------------------------------------------------------- |
| Display  | `text-display-xl` `text-display-lg` `text-display-md` `text-display-sm` |
| Headline | `text-headline-lg` `text-headline-md` `text-headline-sm`                |
| Body     | `text-body-lg` `text-body-md` `text-body-sm`                            |
| Label    | `text-label-lg` `text-label-md` `text-label-sm`                         |

`prepublishOnly` rebuilds `dist` automatically before each publish.

## License

MIT
