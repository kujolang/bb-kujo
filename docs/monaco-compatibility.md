# bb 0.43.0 File Editor compatibility

Stock bb's bundled Monaco editor disposes its model before the editor watching it. In Chrome 152, typing, undoing and switching panels then throws from `_postDetachModelCleanup`. The same failure was recorded with Kujo disabled. This is independent of theme colors and decoration.

Disposing the editor first, then its saved model, passes the same real workspace check: typing, undo, panel switching and terminal input/output, with no page exceptions. The source change is [monaco-dispose-order.patch](../compatibility/monaco-dispose-order.patch). It applies cleanly to bb source commit `3b37d2790d084a47c96eb78267da5d159598f203`. No bb fork is required or shipped.

For the exact published bb 0.43.0 editor bundle, an **explicit maintenance command** provides the same repair. It is never called by the Kujo plugin. Stop using the editor before applying it; reload its plugin afterward.

```sh
node scripts/monaco-compat.mjs /path/to/builtin-plugins/monaco-editor --check
node scripts/monaco-compat.mjs /path/to/builtin-plugins/monaco-editor --apply
bb plugin reload monaco-editor
```

For npm bb-app, the directory is under `bb-app/server/dist/builtin-plugins/monaco-editor`. Locate the installed bb-app package rather than assuming a global npm prefix. The command accepts only SHA-256 `e11a0d305e104a607e4416b8e3ee5ba851906c4f2018de0f168c8fa0d1d615e2` or its verified patched counterpart. Unknown builds are rejected without changes. It saves the original and replaces the file atomically.

```sh
node scripts/monaco-compat.mjs /path/to/builtin-plugins/monaco-editor --restore
bb plugin reload monaco-editor
```

Apply/check/restore was verified against a copy of the actual published bundle, including byte-for-byte restoration. The runtime fix was verified in the disposable bb instance. bb updates may replace this repair; use `--check` afterward. Stock bb has not been changed upstream, and no upstream acceptance is claimed. The source patch is ready for maintainer review.
