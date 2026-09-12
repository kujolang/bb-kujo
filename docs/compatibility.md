# Compatibility

Target: bb **0.43.0**, desktop/web client, Plugin SDK **0.4.84**. Also inspected upstream main `3b37d2790d084a47c96eb78267da5d159598f203` (SDK 0.4.87). The narrow engine range intentionally requires review before 0.44. Test records: `qa.md`.

## Supported extension points

- `bb.themes` and `codeTheme.dark` in the package manifest.
- `definePluginApp`, `app.contentScripts.register`, mount AbortSignal and returned disposer.
- bb's semantic CSS variables; its code theme supplies Shiki/Pierre and Monaco through the host bridge.
- All 16 xterm ANSI colors and reverse foregrounds for transcript terminal output.

## Internal selector inventory

| Selector | Source at reviewed bb revision | Purpose / failure behavior |
| --- | --- | --- |
| `:root.dark` | hooks/useTheme.ts | Host appearance class; stock light fallback if absent |
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

- Dark only. Selecting light appearance yields bb's stock light palette, not an unfinished Kujo light variant.
- No fabricated section numbers or runtime labels. Real bb text/state is preserved.
- No font preference writes or terminal/editor input modifications.
- Mobile web is checked responsively; native mobile device behavior requires device validation.
- Longer profiling and more third-party panel coverage can extend the measured QA record; do not infer all-day performance from a short sample.

Cohesion correction: `[data-timeline-row-id] .opacity-40` restores settled timeline text to full opacity. bb's `ThreadTimelineRows.tsx` declares `PAST_ROW_DIM_CLASS_NAME = "opacity-40"`; composing that with readable token colors makes actual text fail AA. Disabled controls use a different `disabled:opacity-40` class and are not affected. Recheck this narrow fallback whenever the timeline renderer changes.

## Open runtime investigation

Switching away from an edited-and-undone Monaco file produced an undefined-index exception during model disposal in bb’s bundled editor. Typing, undo and terminal output still passed. The strict workspace QA script deliberately fails on this exception. The same exception also reproduces with Kujo disabled (`workspace-baseline-qa.json`). See `workspace-qa.json`; no claim of a zero-error full workspace run is made.
