# Submission validation

2026-09-12 · Registry base `5022d639aa8c51434b50351fd19270557fae232d` · Local submission commit `f2ef88f` · Plugin release `v0.2.1`, commit `6e8449228f3cf8acdc3c8dda999539d619b5ef25`.

## Passed

- Plugin: generated assets, TypeScript, 14 tests, native bb compiler and package contents.
- Native bb: both-mode controls and lifecycle checks; five reloads; theme restoration and unload; editor typing/undo and terminal input/output with the disclosed isolated Monaco repair.
- Three inspected screenshots: 2880×1920, DPR 2, each below 2 MiB. See `assets.json` for sizes and hashes and `capture.json` for the real-browser receipt.
- Exact overview copy, hashed local SVG icon, public release tag and canonical entry fields.
- Marketplace build: 183 entries in both v1 and v2 documents.
- v1 entry gate: the new entry needs no exception.
- Git whitespace check.

## Upstream test failure

`npm test` reports **34 passed, 1 failed**. The failure is `a later entry edit does not change its first addition date`, at `test/marketplace.test.mjs:284`. Git 2.42.0 returns `2026-01-02T03:04:05+00:00`; the assertion expects `2026-01-02T03:04:05Z`. These represent the same instant.

The exact failure also occurs on a detached clean worktree of upstream `5022d639`, with no Kujo entry or assets. Its temporary Git fixture and timestamp assertion do not depend on our submission. No registry source or test was changed. The chained upload-retry shell test was run separately because the failed Node suite prevents it from running under `npm test`.

```sh
node --test --test-name-pattern='a later entry edit' test/marketplace.test.mjs
bash test/r2-upload-retry.test.sh
```

The initial shallow clone could not supply publication dates. Full history and a local entry commit resolved that setup issue. The registry build needs each entry's first commit before it can derive its publication date.

## Source liveness

The first full source check hit local process-spawn limits and was discarded. A fresh check ran after native browser work stopped. **Final `npm run check`: passed**, including all 183 remote sources and both marketplace documents. The separately run upload-retry shell tests also passed. One unchanged upstream entry lacks a category and emits a warning; the Kujo entry declares `themes-and-appearance`.
