Adds **Kujo**, a light and dark bb theme derived from Kujo and SiteKit. It includes matching code, diff and terminal palettes, Departure Mono, Tabler icons, and a restrained background signal effect with reduced-motion support.

Source: `https://github.com/kujolang/bb-kujo.git`, range `^0.2.1` (release commit `6e84492`). Requires bb 0.43.x.

Validation: plugin generation, TypeScript, all 14 tests and the native bb plugin compiler pass. Browser checks cover theme switching, five reloads, unload cleanup, reduced motion, controls and narrow windows. Native editor typing/undo and terminal input/output pass with the documented isolated bb Monaco compatibility repair; the skin does not patch bb internals. The light diff contrast fix has [before/after evidence](https://github.com/kujolang/bb-kujo/tree/main/docs/bug-sweep).

The plugin registers a native palette/code theme, local icons and a disposable decorative content script. It adds no model tools, prompt instructions, external services, telemetry or runtime network calls. Font and artwork licenses are bundled. The existing bb 0.43 Monaco disposal issue is disclosed in the overview and compatibility notes.

Screenshots show the actual dark workspace, light workspace and a completed conversation describing the theme, captured at DPR 2. Each is 2880×1920 and under 2 MiB. No mockups or synthetic responses are included.

The overview is copied verbatim from the plugin repository's `PLUGIN_OVERVIEW.md`.

Marketplace build and the v1 compatibility gate pass. The registry test suite has one pre-existing timestamp-format failure: `a later entry edit does not change its first addition date` expects `2026-01-02T03:04:05Z` but gets the equivalent `2026-01-02T03:04:05+00:00` with Git 2.42.0. The same failure reproduces on untouched upstream commit `5022d639`. No registry implementation or test was changed in this entry PR. The full source-liveness check and separately run upload-retry shell tests also pass.
