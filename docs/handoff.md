# Session Memory · bb-kujo · SiteKit adapter release candidate · 2026-09-12

- Repository: /Users/robertdevore/2026/Kujolang/kujo-repos/bb-kujo, main.
- Source commits: 013a12f research, 20baac7 implementation, 1dbc234 contrast/code polish, aab99a7 release QA/docs.
- Outcome: installable Kujo dark adapter for bb 0.43.x, with three documented design passes; public release gates remain open.
- Current state: native package bb.themes registration plugin:bb-kujo:kujo, generated semantic CSS/code JSON, local licensed Departure Mono, independent inert signal content script and idempotent unload. No bb fork, runtime network, telemetry, timers or observers.
- Evidence: docs/research.md pins actual SiteKit/site/bb sources and six reference skins. docs/architecture.md maps tokens. docs/qa.md, browser-qa.json, host-qa.json and screenshots preserve measured coverage; eight tests, TypeScript, native build, 100 cleanup cycles and five native reloads pass. The short idle sample is not all-day certification.
- Open commitments: obtain an existing writable Git remote and push main; no remote is configured and GitHub CLI authentication is unavailable. Generate marketplace metadata only after the actual public URL is known.
- Release limitation: strict workspace QA fails on bb's bundled Monaco model-disposal exception after edit/undo/panel switching. It also reproduces with Kujo disabled. Editor typing/undo and terminal I/O pass. Evidence: workspace-qa.json and workspace-baseline-qa.json. Do not report a fully green workspace run or mask this exception.
- Human-review pointer: SignalBox capture cap_8561c059-d0b6-4e41-bc97-72e43fec7a0f; signal sig_a829b547-b210-43b1-b96b-8879a796deb6. Exact-ID and Monaco concept retrieval both pass. No duplicates found; routine work summaries rejected from SignalBox.
- Next starting point: README install/development commands, then compatibility.md and the open workspace gate. Isolated QA used /tmp/bb-kujo-data on port 48896 and bb runtime under /tmp/bb-kujo-runtime; these temporary paths are not distribution dependencies. The npm host required Node 22.22.0 because this machine's Node 24 SQLite build crashed.
- Boundaries: dark-only with native stock-light fallback; third-party hardcoded/iframe colors, native-device certification and long-duration profiling are not covered. X reference posts were inaccessible. No marketplace submission or upstream issue was sent.
- Retrieval cues: bb-kujo, Kujo bb skin, SiteKit theme adapter, Monaco disposal, bb marketplace release handoff.
