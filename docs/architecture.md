# Architecture

SiteKit / Kujo → `themes/palette.json` + `themes/palette-light.json` → deterministic generator → bb palette + code theme + small signature stylesheet.

`package.json` is bb's native manifest. Theme identity is `plugin:bb-kujo:kujo`, visible name **Kujo**. `src/plugin.ts` is the required inert server entry. `src/app.ts` registers one content script through the stable SDK. There are no services, settings, RPCs, network requests or storage.

## Token mapping

| Kujo primitive | bb destination |
| --- | --- |
| SiteKit black #060606 | Canvas, code, recessed work surfaces |
| SiteKit gray-900 #111111 | Sidebar, popovers, raised surfaces |
| Adapter intermediate #1b1b1b; SiteKit gray-700 #2b2b2b | Nested work surfaces and selected/hover tone |
| SiteKit gray-100 / gray-300 | Primary and muted text |
| Adapter gray #a3a3a3 | Readable tertiary metadata/comments (AA even on the #363636 decorative composite) |
| Adapter #3e3e3e / #858585 | Quiet separators / identifiable control boundaries |
| SiteKit white action | Primary action, focus, active edge |
| SiteKit dark state colors | Success/addition, warning/modification, danger/deletion, info |
| SiteKit 4px unit, 1px borders, 2/4px corners, no shadows | Native spacing/radius/shadow variables; targeted controls |
| SiteKit Departure Mono | Bundled licensed navigation, display headings, tabs, shortcuts and code typography |
| bb local Inter/system sans | Conversation and ordinary controls; deliberate readability adaptation |
| Departure Mono with system mono fallback | Native code/technical font variable, without writing user font preferences |
| Site's ordered dither and brief signal displacement | Actual locally bundled workflow hero, static CSS grids, decorative background slices and a 2px signal rail |

The bridge generates all ANSI colors, reverse-color foregrounds, Pierre diff overrides and editor JSON from one source. Brand-discord and PR-merged keep bb's existing external-brand semantics. Syntax is a separate content grammar: muted sage strings, amber numbers, cool types, chalk keywords; UI colors never signal invented execution state.

## CSS and assets

bb reads theme CSS verbatim and caches it in the client; it does not resolve relative imports or font URLs. `generate.mjs` concatenates tokens, surface and signal CSS and embeds the 22,496-byte WOFF2. This keeps theme switching atomic, fonts offline and the complete CSS below bb's 256,000-character limit. The 66,810-byte optimized Kujo hero is embedded once; the small mark has ink and chalk variants. Raw font plus license remain in the distribution for provenance. SVG metadata uses the actual Kujo mark with the XML preamble removed to satisfy bb's icon validator.

The native stylesheet owns both appearances. `:root:not(.dark)` applies SiteKit paper and ink; `:root.dark` applies the original dark palette. The manifest registers matching light and dark code themes under one Kujo entry. Changing palettes removes Kujo's CSS. It never changes the user's appearance preference.

## Lifecycle

A content-script generation appends exactly one inert, aria-hidden decorative node with one child. No IDs, global variables, observer, polling, rAF or layout read. A visibility listener pauses the CSS animation in hidden tabs. A single idempotent disposer removes that listener, the abort listener and the node, whether invoked by abort or the host return contract. Pre-aborted generations mount nothing.

The node has inline `display:none`; only active Kujo CSS enables it. Thus other themes and plugin CSS removal cannot leave a visual layer behind. Decoration is two pixels high at the viewport edge, clips itself, ignores pointer input and carries no information. The 12s CSS timeline changes transform/opacity for 100ms; reduced motion, coarse pointers and narrow screens disable it. No editor, terminal, message or alert is transformed. Native background pseudo-elements add the actual Kujo hero behind the home, sidebar and thread surfaces; only duplicate slices shift for 117ms every nine seconds. Reduced motion disables slices while keeping the static artwork. Hidden-tab pause is shared through the owned signal node. The sidebar wordmark is a CSS pseudo-element, with no DOM injection or invented status.

## Maintenance

Edit `palette.json`, `surfaces.css` and `signal.css`; never hand-edit generated outputs. Commit regenerated CSS/JSON so bb can install from Git without lifecycle scripts. Prefer semantic variables over additional selectors. Every internal selector is listed in compatibility.md. If an upstream selector disappears the associated paint becomes a no-op; functionality remains bb's.

## Native icon adapter

The Tabler subset is generated from local source SVGs and registered through `experimental_icons.register`. The native code-theme hook selects active Kujo artwork; the supported same-name nested fallback restores builtin icons outside Kujo. Provider/brand marks remain native. See `typography-icons.md` for source/version, coverage, fallback and lifecycle details.

## Light mapping (0.2.0)

`themes/palette-light.json` derives canvas #f9f9f9, raised white, recessed/selected #eeeeee, ink #060606, secondary #2b2b2b and muted #5d5d5d from SiteKit `css/generated/themes.css` and `tokens.css`. Semantic green #0f6b35, amber #765000, red #a31515 and blue #1646d2 use SiteKit base values. Cyan #075d6c is the syntax type color; string and purple syntax shades are adapter-specific contrast-safe companions. The adapter uses gray-300 for quiet separators and gray-500 for control boundaries.

Light artwork uses the original paper/ink orientation at 6% opacity; dark retains inverted artwork. The light contrast bound is #d8d8d8 (darker than the stacked paper, rail, artwork and signal). All text/semantic/syntax roles exceed 4.5:1 against this bound and every neutral surface. Font and workflow bytes appear once in the shared stylesheet. Icons follow the native code theme identity in either mode, reverting only for other palettes.
