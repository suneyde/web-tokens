import StyleDictionary from "style-dictionary";

// Resolve a typography token's font-family to a CSS value. When the token
// references a family primitive (e.g. "{font.family.display}"), emit the CSS
// variable it compiles to with the resolved stack as a fallback:
//   var(--font-family-display, HeadlandOne, ...)
// This lets a consumer override --font-family-sans/--font-family-display in
// their own :root and have every typography class follow, while the class
// still renders correctly if only ./typography (not ./css) is imported.
const resolveFamily = (originalFamily, resolvedFamily) => {
  // Quote multi-word family names (e.g. Segoe UI -> "Segoe UI"). Single
  // identifiers and generic keywords (sans-serif, system-ui) must stay
  // unquoted, so key the rule on whitespace rather than hyphens.
  const quote = (name) => (/\s/.test(name) ? `"${name}"` : name);
  const fallback = (
    Array.isArray(resolvedFamily) ? resolvedFamily : [resolvedFamily]
  )
    .map(quote)
    .join(", ");
  const ref =
    typeof originalFamily === "string" && originalFamily.match(/^\{([^}]+)\}$/);
  if (!ref) return fallback;
  return `var(--${ref[1].replace(/\./g, "-")}, ${fallback})`;
};

StyleDictionary.registerFormat({
  name: "css/typography-classes",
  format: ({ dictionary }) => {
    const tokens = dictionary.allTokens.filter(
      (t) => (t.$type ?? t.type) === "typography",
    );
    return tokens
      .map((t) => {
        const v = t.$value ?? t.value;
        const original = t.original?.$value ?? t.original?.value ?? {};
        const family = resolveFamily(original.fontFamily, v.fontFamily);
        const decls = [
          family && `  font-family: ${family};`,
          v.fontSize && `  font-size: ${v.fontSize};`,
          v.fontWeight && `  font-weight: ${v.fontWeight};`,
          v.lineHeight && `  line-height: ${v.lineHeight};`,
          v.letterSpacing && `  letter-spacing: ${v.letterSpacing};`,
        ]
          .filter(Boolean)
          .join("\n");
        return `.text-${t.path.slice(1).join("-")} {\n${decls}\n}`;
      })
      .join("\n\n");
  },
});

const sd = new StyleDictionary({
  source: ["src/**/*.json"],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "dist/",
      files: [
        {
          destination: "tokens.css",
          format: "css/variables",
          filter: (t) => (t.$type ?? t.type) !== "typography",
          options: { outputReferences: true },
        },
      ],
    },
    cssTypography: {
      transforms: ["attribute/cti", "name/kebab"],
      buildPath: "dist/",
      files: [
        { destination: "typography.css", format: "css/typography-classes" },
      ],
    },
    ts: {
      transformGroup: "js",
      buildPath: "dist/",
      files: [
        { destination: "tokens.js", format: "javascript/es6" },
        { destination: "tokens.d.ts", format: "typescript/es6-declarations" },
      ],
    },
  },
});

await sd.buildAllPlatforms();
