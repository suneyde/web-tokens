import StyleDictionary from "style-dictionary";

StyleDictionary.registerFormat({
  name: "css/typography-classes",
  format: ({ dictionary }) => {
    const tokens = dictionary.allTokens.filter(
      (t) => (t.$type ?? t.type) === "typography",
    );
    return tokens
      .map((t) => {
        const v = t.$value ?? t.value;
        const family = Array.isArray(v.fontFamily)
          ? v.fontFamily.join(", ")
          : v.fontFamily;
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
