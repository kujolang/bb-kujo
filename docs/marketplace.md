# Distribution and marketplace

The package uses bb's current native manifest, local SVG branding, version bounds, deterministic committed theme assets and a files allowlist. `npm pack --dry-run` audits the package. There are no runtime dependencies, install scripts, remote fonts or network permissions.

Local installation is supported now. Public marketplace publication is a separate release step: provision the public Git repository, add verified repository/homepage/bugs metadata, push these commits, tag `v0.1.0`, and submit to the bb community marketplace. No unverified marketplace slug is advertised and nothing is submitted automatically.

The marketplace schema is strict (`schemaVersion: 1`). A single root plugin does not need `.bb/plugins.json`; that file indexes nested plugins in collections. Generate a catalog from the actual remote using:

```sh
node scripts/marketplace.mjs https://github.com/OWNER/bb-kujo > marketplace.json
```

The generator includes the visible name, description, local icon and real screenshot paths. Review the resulting source URL before submission. The screenshot captions distinguish bb's built-in Theme Preview fixtures from real editor/terminal surfaces.

Sources: bb `docs/plugin-marketplace-plan.md`, current domain/server manifest schemas, and reference repositories recorded in research.md.
