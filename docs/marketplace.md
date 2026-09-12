# Distribution and marketplace

Public repository: https://github.com/kujolang/bb-kujo. The root is directly installable as a bb plugin; generated assets are committed. `marketplace.json` uses the current **schemaVersion 2**, supporting categories and screenshots. The native manifest, bounded engines, local icon, attribution and package allowlist are included.

```sh
bb marketplace add https://raw.githubusercontent.com/kujolang/bb-kujo/main/marketplace.json
bb plugin install bb-kujo@kujo
bb theme set plugin:bb-kujo:kujo
```

This is a self-hosted Kujo catalog. It is not an approved listing in bb-community. Community submission/review remains a separate external action. Adding a catalog installs nothing.

Regenerate metadata and audit packaging:

```sh
node scripts/marketplace.mjs https://github.com/kujolang/bb-kujo > marketplace.json
npm pack --dry-run
```

The Git source and screenshot URLs point to the public repository. The screenshot captions identify actual workspace surfaces and the bundled preview fixtures. The optional stock-editor repair is documented separately in `monaco-compatibility.md`; the theme never patches another plugin automatically.
