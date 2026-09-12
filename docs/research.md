# Source review — 2026-09-12

Implementation starts after this review. No bb fork or component replacements.

## Sources of truth

- bb 0.43.0, commit `3b37d2790d084a47c96eb78267da5d159598f203`, https://github.com/get-bb/bb. Reviewed domain/plugin-manifest.ts, server services/plugins/manifest.ts and plugin-service.ts, app useAppTheme/useTheme, ui/theme.css, sidebar.tsx, shared-ui controls, ThreadTerminalView, markdown-code-highlight.css, Monaco theme adapter, content-script example and theme-preview fixtures.
- SiteKit commit `9629c4cb2a42f62f80be6159c9d63a141ccbb696`, https://github.com/kujolang/site-kit. css/generated/tokens.css and themes.css, base.css, components, fonts and licenses.
- Kujo site checkout commit `01274501bc40ac8be922f3dcdef47a2f8be98e36`: assets/css/style.css, assets/js/site.js, vendor/scramble-decode.js, logomark. Live https://kujolang.ai was unavailable through the research browser; actual local source used.
- SSG/CMS consumers: source-vendored SiteKit styles in docs.kujolang.ai, source and kujo-workflows dashboard; cms-example theme manifest. Consumers reinforce token-based composition, sparse borders and technical labels.

## Extension boundaries

`package.json` is the manifest. `bb.themes` contributes CSS and a VS Code JSON `codeTheme.dark`. The server reads the CSS verbatim into `#bb-app-theme`: relative imports/fonts would resolve against the app URL, not the plugin folder. Generate a single CSS file and embed the small licensed WOFF2 locally as a data URL. Keep below 256,000 characters.

Native semantic CSS variables reach the shell, tabs, panels, dialogs, forms, badges, tooltips, menus, command palette, thread states and notifications. xterm reads sidebar/foreground/muted plus all 16 `--ansi-*` properties. Its background is coupled to the sidebar. Sugar-high fences redeclare `--sh-*` locally, requiring a scoped override. Pierre uses inherited `--diffs-*-override` properties across its shadow root. Monaco uses the host's experimental code-theme bridge; supply both TextMate and Monarch scopes. No editor DOM overrides.

Content scripts use `definePluginApp` and `app.contentScripts.register`; mount receives an AbortSignal and returns a disposer. The host retains frontend CSS for that generation. Do not infer statuses, rewrite labels or replace components. Scope all structural styling to the active dark stylesheet. In light appearance, leave bb's stock light palette intact.

## Reference implementations

| Reference | Source and useful technique | Adapter decision |
| --- | --- | --- |
| Monokai | sms unarto: https://github.com/smsunarto/bb-plugins/tree/main/plugins/monokai; generated semantic palette, ANSI background foreground pairs, dedicated code JSON, content scripts for fonts/Monaco/terminal | Generate one token bridge; rely on current upstream editor/terminal support instead of patching their DOM |
| Aura | https://github.com/MateoCerquetella/bb-plugins/tree/main/plugins/aura; generation-safe disposal, panel ID targets, filtered subtree observer, wallpaper settings, 15s refresh, GPU shaders | No network, shader, wallpaper persistence or subtree observer; use CSS-only backgrounds and a tiny owned signal rail |
| Conductor | https://github.com/bottlebrushes/bb-plugin-conductor-theme; two registered variants, chat tokens, server entry; external Geist import | Follow native registration; bundle fonts and cover all ANSI colors |
| Vercel | https://github.com/divyesh-puri/bb-plugin-vercel-theme; code themes, diff override bridge, separate syntax selectors, metadata and tests | Use matching generated code/semantic colors; no design copied |
| Tokyo Night | https://github.com/krehel/bb-plugin-tokyo-night; paired light/dark rules, small server registration and palette files | Ship one carefully scoped dark palette |
| Ayu | https://github.com/vburojevic/bb-plugin-ayu; palette generator and explorer/screenshot workflow | Keep source tokens machine-readable; no extra explorer feature in production plugin |

The three supplied X status pages (2098123334395510825, 2098138440097493382, 2098067040078815314) returned errors and exact-ID searches found no accessible source. No implementation claims are inferred from those posts.

## Design inventory and decisions

SiteKit dark: #060606 canvas, #111111 raised, #2b2b2b structural gray, #b8b8b8 muted, #eee secondary, white primary. Semantic success #6fdc8c, warning #ffd166, danger #ff8c8c, info #7dd3fc. Primary action is neutral white. Keep info cyan separate from monochrome interaction.

Four-pixel spacing, 1px borders, 0/2/4px corners, no shadows, 120/180/260ms timing. SiteKit's `font-sans` actually names a monospace stack; Departure Mono is its display/metadata face. Deliberately retain bb's readable local Inter/system sans for long conversations; use Departure Mono only for small technical hierarchy. Editor retains the user's compatible system code face.

Kujo site's dither canvas and scramble/glitch are promotional treatments. Translate their raster geometry into faint static CSS grids and a 100ms horizontal slice every 12 seconds at the viewport edge, never on content. No text scramble. Reduce motion disables the signal entirely. Narrow/touch screens omit the decorative layer.

## Three-pass plan

1. Foundation: centralized source palette, complete bb semantics, ANSI, code and diffs; no decorative layer.
2. Cohesion: inspect real bb screens, repair locally redeclared syntax, radii/focus/readability, light fallback, narrow widths and cleanup.
3. Signature: sidebar technical labels and alignment rail, quiet background architecture, lifecycle-owned signal; repeat interaction and performance checks.

## Follow-up: stronger Kujo signature

The user rejected the edge-only result as too generic. Supersede that initial visual decision: bundle the actual `home-agent-workflow.webp` at 960px (66,810 bytes), preserving source attribution. CSS inversion produces the dark version; native pseudo-elements place it behind home, sidebar and thread surfaces. The background-only duplicate slices move 3px for 117ms/9s. A static Kujo mark/wordmark identifies the shell. Faint text is now #a3a3a3 and all text is tested against the brightest conservative #363636 composite. Static reduced-motion artwork remains visible. No text, terminal/editor surface or control is transformed.

The marketplace uses the actual v2 schema, required for category/screenshots fields. The previous v1 generator mixed in v2 fields and was corrected before public release. Native local catalog validation now passes.
