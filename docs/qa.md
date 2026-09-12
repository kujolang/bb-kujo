# Verification — 2026-09-12

## Three explicit passes

1. **Foundation:** inspected bb's real manifest/runtime and all six reference implementations before writing code. Generated the semantic palette, all ANSI colors, code JSON and diff bridges. Eight contract/lifecycle tests and TypeScript checks passed. Native `bb plugin build` produced both bundles; local install and theme registration succeeded.
2. **Cohesion:** captured bb's real UI and its bundled Theme Preview. Corrected sugar-high's locally redeclared colors, readable input borders and secondary/tertiary contrast. Real timeline inspection found upstream `opacity-40` defeating token contrast; a narrow documented override restores readable settled metadata. Preserved native disabled states. Verified Monaco typing and undo through its actual `native-edit-context` surface; its hidden IME textarea is not an editable test target. Source files were not saved or changed by typing QA.
3. **Signature:** added thin sidebar alignment/active rails, technical Departure Mono labels, static 48px home grid and the 100ms/12s signal edge. Reduced-motion and narrow/touch modes disable the decorative animation. Removed stock rainbow bracket colors through native code-theme colors. Repeated browser/lifecycle checks after polish.

## Automated and runtime checks

- `npm run check`: manifest/assets, canonical theme ID, generated consistency, code JSON/scopes, offline asset rules, all 16 ANSI pairs, contrast, SVG validation, idempotent cleanup and pre-aborted generation; TypeScript passes.
- `bb plugin build .`: bb 0.43.0 / SDK 0.4.84 compiler succeeds; `bb plugin install path:… --yes` reports running; `bb theme set plugin:bb-kujo:kujo` resolves the native palette and code theme.
- `npm run qa`: 100 content-script mount/abort/dispose cycles; no retained decorative nodes, no increasing listener count, no browser exceptions. Pointer transparency, input, keyboard focus, reduced motion, theme removal and widths 375/768/1024/1440/2560 pass. Raw result: [browser-qa.json](browser-qa.json).
- `scripts/host-qa.mjs`: five native plugin reloads, dark/light appearance, native palette switch, plugin disable/enable, visible controls, menus, dialog, popover, checkbox/switch, toast, command palette and responsive screenshots. No page exceptions. Raw result: [host-qa.json](host-qa.json).
- Real offline echo-provider thread rendered markdown, fenced code, table and long scroll content. Monaco editor/file tree loaded the Kujo theme; insertion of `// KUJOtyping` appeared, Undo removed it, and the disk file remained unchanged.
- Real xterm created a shell, accepted keyboard input and emitted `\x1b[32mKujo terminal ready\x1b[0m`. Scrollback confirmed the output. A separate command terminal exited with code 0.
- Working-tree diff panel rendered actual changes using the Kujo diff bridge. Screenshots record the source changes present during QA, not a clean release checkout.

## Release gate still open

`scripts/workspace-qa.mjs` confirms editor typing/undo and terminal input/output, but its strict zero-exception assertion fails when Monaco disposes an edited model while switching panels. The stack originates in the bundled `monaco-editor` plugin (`_postDetachModelCleanup` → `dispose`), not the Kujo content script. The same exception reproduces with Kujo disabled ([baseline](workspace-baseline-qa.json)); this is not a clean full-workspace pass. See [workspace-qa.json](workspace-qa.json). No bb internals were patched.

## Accessibility

All text ladder, syntax and semantic colors clear 4.5:1 against each of #060606, #111111, #1b1b1b and #2b2b2b. Strong control borders clear 3:1 on #2b2b2b. Primary white action/focus is distinct from semantic green/amber/red/cyan. Links remain underlined, diff signs remain present, and decoration is noninteractive, inert and aria-hidden. Native keyboard interactions are preserved. Disabled controls retain bb's visual treatment and are excluded from minimum text contrast requirements. Native mobile screen readers/device behavior was not certified.

## Performance

The isolated 13-second Chromium samples measured **0.003766 seconds** of main-thread work without the theme and **0.004127 seconds** with it. This is a small bounded sample, not an all-day CPU guarantee. Raw values and heap/layout counters are in browser-qa.json. Post-GC listener count decreased after 100 cycles. Heap difference during initial styling includes CSS/font/module setup and is not a leak measurement.

The frontend bundle is about **1.75 KB**, server entry **446 bytes**, generated CSS about **41.6 KB** including the **22,496-byte** embedded WOFF2. No runtime network, JavaScript timer, mutation observer, rAF or global object writes. Only a two-pixel clipping box animates transform/opacity; hidden tabs pause it. Native editor typing/undo and terminal responsiveness were functionally verified; no precise whole-app latency percentile or long-duration memory slope is claimed.

## Environment and limits

QA used a disposable bb data directory and npm bb-app 0.43.0. This machine's Node 24 native SQLite build crashed; an isolated Node 22.22.0 build ran bb successfully. Intermittent local Node HTTP failures were worked around using the same public bb routes through curl. bb's Theme Preview catalog occasionally reported loading/timeouts; those are not errors in Kujo. Screenshot/UI checks distinguish built-in preview fixtures from real editor/terminal/thread surfaces.

The three supplied X posts were inaccessible. No upstream change or issue was submitted. Native-device coverage, third-party iframe palettes, long-duration profiling and marketplace publication remain outside the verified scope. See [compatibility](compatibility.md) for the exact boundaries.
