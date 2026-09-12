# Departure Mono and Tabler

The bundled, unmodified Departure Mono WOFF2 now supplies bb's technical mono variable, navigation, tabs, display headings, keyboard shortcuts and sample text. Editors/code surfaces that consume `--font-mono` inherit it. Ordinary conversation paragraphs and form reading text keep Inter/system sans. No user font preference is written. Single-weight display/navigation rules disable synthetic bold.

`themes/icons.json` maps **149 bb names to 139 Tabler outline SVGs**, pinned to **Tabler Icons 3.46.0** from https://tabler.io/icons and the official `@tabler/icons` distribution. Raw local SVGs and the MIT license are bundled. The generator admits only basic SVG geometry, rejects scripts/external references and emits `src/tabler.generated.ts`. There is no runtime icon font, CDN or whole-library dependency.

`src/icons.ts` registers artwork through the native `app.experimental_icons.register` API. The native code-theme hook selects Tabler only for Kujo dark mode. For other themes/light mode, the SDK's documented same-name nested icon handling resolves to bb's builtin icon. Reload/unload cleanup belongs to bb's registry; there are no DOM icon replacements or observers. Parent sizing, color, accessible label and loading animation remain owned by bb.

The four GitHub/Discord brand names and provider-specific logos are intentionally not remapped. Third-party icons that bypass bb's shared registry remain their own artwork. bb's lexical plugin precedence applies if another plugin overrides the same icon names. The API is experimental and covered by the narrow bb 0.43.x compatibility range.

Validation: generated-source freshness and safe SVG contracts; native Tabler rendering; Departure font loading; light/default palette fallback; five native reloads; disable/enable restoration; responsive screenshot matrix. `scripts/host-qa.mjs` records the computed font and active Tabler node count.

Source archive SHA-256: `6d727ad0489854d2d7d07ba9baa6476af7ee415aaa2eba1adc0deab48556852b` (`@tabler/icons` 3.46.0).
