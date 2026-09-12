# Compatibility

Target: bb **0.43.0**, desktop/web client, Plugin SDK **0.4.84**. Also inspected upstream main `3b37d2790d084a47c96eb78267da5d159598f203` (SDK 0.4.87). The narrow engine range intentionally requires review before 0.44. Test records: `qa.md`.

## Supported extension points

- `bb.themes` and `codeTheme.dark` / `codeTheme.light` in the package manifest.
- `definePluginApp`, `app.contentScripts.register`, mount AbortSignal and returned disposer.
- bb's semantic CSS variables; its code theme supplies Shiki/Pierre and Monaco through the host bridge.
- All 16 xterm ANSI colors and reverse foregrounds for transcript terminal output.

## Internal selector inventory

| Selector | Source at reviewed bb revision | Purpose / failure behavior |
| --- | --- | --- |
| `:root.dark` | hooks/useTheme.ts | Host appearance class; Kujo light tokens when absent |
| `.bb-code-highlight` | components/ui/markdown-code-highlight.css | Override locally redeclared sugar-high tokens; default syntax if renamed |
| `[data-markdown-preview]` | Markdown renderer | Reading leading, links, quotes, code borders; default styling if absent |
| `[data-sidebar="sidebar"]` | components/ui/sidebar.tsx | Static alignment rail; no layout dependency |
| `[data-sidebar="group-label"]` | SidebarStickyTier | Technical font/uppercase and separator; leaves label text intact |
| `[data-sidebar="menu-button"][data-active="true"]` | SidebarMenuButton | Active edge; no status inference |
| `.bb-sidebar-selected-row` | components/ui/theme.css, sidebar rows | Selected edge; native active background remains |
| `[id="root-compose-main-panel"]` | Home composer panel | Static grid background; default paint if renamed |

Generic HTML controls and ARIA dialog/menu/listbox/tab roles receive modest corners and focus outlines. There are no positional `nth-child` chains, label text matches, DOM replacements, global subtree observers, or editor internals. The signal node's `.bb-kujo-signal` and its child/data-paused attribute are plugin-owned.

## bb limitations

- Native theme CSS is loaded verbatim, with no relative asset resolution. Generated single-file CSS embeds the local font.
- xterm background/cursor are coupled to sidebar/foreground; there is no independent terminal-surface API. Kujo accepts the native #111111 terminal surface.
- Monaco's bridge is experimental and translates TextMate scopes to Monaco; this theme also supplies Monarch scopes. Languages with custom semantic providers may differ.
- Fenced-code sugar-high uses fewer token categories than Monaco/Shiki; exact token-for-token parity is unavailable.
- Third-party plugins with hard-coded colors, iframe styles, or their own closed shadow roots cannot be reliably reskinned through host variables. No cross-origin DOM access is attempted.
- UI geometry lacks a dedicated stable theme contract. The small selector list above is intentionally version-bounded.

## Plugin limitations / future work

- Native light, dark and system appearance are supported under one Kujo theme entry.
- No fabricated section numbers or runtime labels. Real bb text/state is preserved.
- No font preference writes or terminal/editor input modifications.
- Mobile web is checked responsively; native mobile device behavior requires device validation.
- Longer profiling and more third-party panel coverage can extend the measured QA record; do not infer all-day performance from a short sample.

Cohesion correction: `[data-timeline-row-id] .opacity-40` restores settled timeline text to full opacity. bb's `ThreadTimelineRows.tsx` declares `PAST_ROW_DIM_CLASS_NAME = "opacity-40"`; composing that with readable token colors makes actual text fail AA. Disabled controls use a different `disabled:opacity-40` class and are not affected. Recheck this narrow fallback whenever the timeline renderer changes.

## Verified editor repair

Stock bb's model-disposal exception reproduces with Kujo disabled. The separate disposal-order repair now passes workspace QA with no page exceptions. See [monaco-compatibility.md](monaco-compatibility.md). The theme does not apply it automatically; stock upstream remains affected.

## Signature selector additions

- `[data-thread-window]`: actual EmbeddedThreadChat root; quiet static background only. No editor content transform.
- `[data-sidebar="sidebar"] > .bg-sidebar`: the native scroll region's opaque paint hid the artwork; make this direct child's background transparent over the original sidebar tone.
- `[data-sidebar="sidebar"] > .shrink-0:first-child::before`: native chrome controls row; adds static Kujo branding before the existing controls without replacing them. Recheck this structural fallback on bb upgrades.
- Sidebar/home `::before` / `::after`: background artwork and clipped glitch duplicates. Native stylesheet removal removes both. No observer or recurring DOM query.

## Typography and icons (0.1.1)

Uses native `experimental_icons.register` and `experimental_useCodeTheme`, including the documented same-name nested builtin fallback. Registration ownership and cleanup are managed by bb. The code-theme identity prefix is `bb:plugin:bb-kujo:kujo:${mode}`, optionally followed by bb’s file fingerprint. Test palette/appearance fallback on SDK upgrades. Core/extended shared icons are covered except native GitHub/Discord marks; provider-specific artwork is untouched. Generic heading/tab/keyboard roles and sidebar buttons/links receive Departure Mono. See `typography-icons.md`.
