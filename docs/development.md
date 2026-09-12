# Development

## Install a local checkout

Requires Node.js 22.19+ and the bb CLI on PATH. Keep bb running while you install or reload the plugin.

```sh
git clone https://github.com/kujolang/bb-kujo.git
cd bb-kujo
npm ci
npm run build
bb plugin install "path:$PWD" --yes
bb theme set plugin:bb-kujo:kujo
```

Select **Light**, **Dark**, or **System** under Settings → Appearance. Both appearances use the same Kujo theme entry.

Remove with `bb plugin remove bb-kujo`. Choose another palette with `bb theme set default`.

## Edit and reload

```sh
npm ci
npm run dev
```

The watcher serializes generation, `bb plugin build .`, and `bb plugin reload bb-kujo`. Install the plugin once before starting it. Edit `themes/palette.json`, `themes/palette-light.json`, `themes/surfaces.css`, `themes/signal.css`, or `src/`; do not edit generated `kujo.css`, `tokens.css`, `kujo-code.json`, or `kujo-code-light.json`.

```sh
npm run check         # generated assets, TypeScript, contracts and contrast
npm run build         # includes bb's actual plugin compiler
npm run qa            # Chrome lifecycle, motion, focus and idle comparison
BB_SERVER_URL=http://127.0.0.1:48896 node scripts/host-qa.mjs
BB_SERVER_URL=http://127.0.0.1:48896 node scripts/signature-qa.mjs
BB_SERVER_URL=http://127.0.0.1:48896 BB_QA_THREAD_ID=YOUR_TEST_THREAD node scripts/workspace-qa.mjs
BB_SERVER_URL=http://127.0.0.1:48896 BB_QA_APPEARANCE=light node scripts/signature-qa.mjs
BB_SERVER_URL=http://127.0.0.1:48896 BB_QA_THREAD_ID=YOUR_TEST_THREAD BB_QA_APPEARANCE=light node scripts/workspace-qa.mjs
npm pack --dry-run
```

Host QA requires an isolated running bb with Kujo and the bundled Theme Preview plugin installed. It changes that instance's theme and reloads/disables/re-enables Kujo. Workspace QA additionally opens a file, types/undoes unsaved editor text, and creates a terminal in the supplied disposable thread. Do not point either check at an active work session. Chrome is used through Playwright; `KUJO_BROWSER=chromium` selects an installed Playwright Chromium.

See [QA results](qa.md), [architecture](architecture.md) and [compatibility](compatibility.md) for implementation details.
