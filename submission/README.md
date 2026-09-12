# Community marketplace submission

Prepared for [get-bb/marketplace](https://github.com/get-bb/marketplace), category **Themes & Appearance**. This folder is a copy-ready bundle, not a second plugin. No pull request has been opened.

- `entries/bb-kujo.json`: listing and public Git range `^0.2.1`.
- `icons/`: content-hashed Kujo SVG.
- `screenshots/bb-kujo/`: actual bb dark workspace, light workspace and completed theme-description thread. Captured at 1440×960, DPR 2; each PNG is under 2 MiB.
- `overview/bb-kujo.md`: exact copy of the root `PLUGIN_OVERVIEW.md`.
- `pr-body.md`: prepared pull request description.

## Prepare the PR branch

From a clean fork checkout of the current marketplace main branch:

```sh
git switch -c codex/bb-kujo
```

Copy this folder's `entries/`, `icons/`, `screenshots/` and `overview/` files into the corresponding marketplace directories. Do not copy this README, the validation receipt or PR body into the registry.

```sh
git add entries/bb-kujo.json icons/bb-kujo-*.svg screenshots/bb-kujo overview/bb-kujo.md
git commit -m "Add plugin entry: bb-kujo"
npm ci --ignore-scripts
npm run build
npm test
npm run gate:v1
npm run check
git diff --check
git push -u origin codex/bb-kujo
```

The registry build requires full Git history and a commit for each new entry to derive its publication date. Commit locally before validation. See `validation.md` for the baseline upstream test failure found during this preparation.

Then open the PR against `get-bb/marketplace:main`, using `pr-body.md`. The verified submitter account is `robertdevore`. Recheck current registry contracts and source liveness before submission if time has passed.

## Recapture

Use an isolated bb instance with Kujo and Theme Preview enabled, plus a completed thread containing only public-safe content. Run this from the plugin repository root; do not run another native QA script alongside it because bb broadcasts thread-open events.

```sh
BB_SERVER_URL=http://127.0.0.1:48896 \
BB_MARKETPLACE_THREAD_ID=YOUR_COMPLETED_THREAD_ID \
node scripts/marketplace-capture.mjs
```

The script opens existing content and takes screenshots. It does not submit a prompt. Inspect every new image before copying it to the marketplace.
