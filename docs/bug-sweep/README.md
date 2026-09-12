# Pre-submission bug sweep

Reviewed on 2026-09-12 against bb 0.43 and SDK 0.4.84. Baseline: v0.2.0; fix: v0.2.1.

## Confirmed and fixed: light diff contrast

The light palette passed neutral-surface checks but its colored word highlights were too dark for comment text. Chromium renders `#5d5d5d` comments over the shipped deletion emphasis at **4.01:1** and addition emphasis at **4.34:1**. Both fall below the 4.5:1 AA threshold for normal text.

The fix reduces light Pierre emphasis from 24% to 18%. It also reduces Monaco's light line/word fills and merge-header fills; line and word alpha must be checked together. Text colors, semantic hues and dark appearance stay unchanged.

| Browser fixture | Before | After |
| --- | ---: | ---: |
| Removed comment | 4.01:1 | 4.53:1 |
| Added comment | 4.34:1 | 4.76:1 |

[Before](diff-before.png) · [After](diff-after.png) · [Before measurements](diff-before.json) · [After measurements](diff-after.json)

These images are **focused CSS reproduction fixtures**, not screenshots of a failing bb session. They use the shipped theme CSS in Chromium and resolve `color-mix` through Canvas. The regression test separately checks every shipped syntax foreground on Pierre fills, composited Monaco line/word fills, and merge surfaces. The new light test failed on v0.2.0 values and passes on v0.2.1; the dark test passes unchanged. Subpixel composition and rounded browser pixels explain small differences between test and screenshot ratios.

Reproduce from the repository root:

```sh
git show v0.2.0:themes/kujo.css > /tmp/bb-kujo-before.css
KUJO_QA_CSS=/tmp/bb-kujo-before.css node scripts/diff-contrast.mjs before
node scripts/diff-contrast.mjs after
node --test tests/diff-contrast.test.mjs
```

The JSON receipts include the CSS content hash. No speculative runtime bug was changed. Temporary comment edits used to inspect bb's diff panel were restored.

## Runtime and scope

Native bb checks covered light/dark preview surfaces, menus, dialogs, tooltips, notifications, forms, command palette, reduced motion, 375–2560px windows, five reloads, default-theme restoration, and disable/enable cleanup. No page errors were recorded. Editor typing/undo and terminal input/output passed with the previously documented isolated Monaco repair; this does not establish that stock bb's editor disposal bug is fixed.

The existing upstream Monaco disposal issue remains documented in [compatibility](../monaco-compatibility.md). Failed exploratory locator scripts are test-harness failures, not evidence of theme bugs. No real-model request was needed for this sweep; the marketplace chat image reuses the completed public theme-description conversation.

## Performance and model context

The isolated 13-second browser samples recorded 5.72ms baseline task time and 4.05ms themed task time, with zero extra layouts. This is noise-scale overhead, not evidence that the theme speeds bb up. Heap readings were 0.72MB baseline and 1.74MB after loading the fixture and theme; they include the test harness and are not a retained-memory measurement. After 100 mount/abort/dispose cycles, event listeners decreased from 31 to 27 and no decorative nodes remained.

The fix changes color values only. The stylesheet remains 143,194 characters. Font and workflow artwork remain embedded once each. Runtime effects add two DOM elements and one visibility listener, with no timer, observer, animation loop or model call. The server entry registers no tools, skills, services or prompt instructions. Host plugin metadata may still appear in bb context; this is not a claim of literally zero billed tokens.

These are short isolated observations plus native interaction checks, not all-day CPU, typing-latency or memory certification. Full receipts sit beside this report.
