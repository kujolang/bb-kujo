# Screenshot matrix

Captured from bb 0.43.0 in Chrome 152.0.7977.84, September 12, 2026.

| Capture | Surface |
| --- | --- |
| [Home](home.png) | Real project/new-thread composer and empty state |
| [Editor and files](editor-files.png) | Real Monaco editor, file tree, long markdown thread |
| [Diff](diff.png) | Real working-tree diff panel |
| [Terminal](terminal.png) | Real xterm session; keyboard input and ANSI output |
| [Thread preview](preview-thread.png) | bb's bundled Theme Preview thread, code, status and controls fixture |
| [New-thread preview](preview-new-thread.png) | bb's bundled empty/composer fixture |
| [Split preview](preview-split.png) | bb's bundled split workspace fixture |
| [Settings preview](preview-settings.png) | bb's bundled settings fixture |
| [Dialog](dialog.png) / [Menu](menu.png) / [Popover](popover.png) | Native bb overlay components in Theme Preview |
| [Tooltip](tooltip.png) / [Toast](toast.png) | Native bb tooltip/notification components |
| [Command palette](command-palette.png) | Actual quick command palette |
| [375](viewport-375.png) / [768](viewport-768.png) / [1024](viewport-1024.png) / [2560](viewport-2560.png) | Responsive Theme Preview surfaces |
| [Light home](light-background-still.png) | SiteKit paper and ink with Kujo signal artwork |
| [Light editor](light-editor-files.png) | Native Monaco, file tree and Departure Mono |
| [Light diff](light-diff.png) | Native light diff colors |
| [Light terminal](light-terminal.png) | Light terminal with readable ANSI colors |
| [Reduced motion](reduced-motion.png) | Static dark theme with decorative animation disabled |

The workspace uses an offline echo-provider test thread. Its diagnostic text is fixture output, not an AI-generated implementation report. Preview fixtures contain bb's example conversation, not Kujo copy. No screenshot is a rebuilt imitation of bb.

Loading/error badges and disabled controls are exercised by Theme Preview; actual provider failures and native mobile devices are outside this screenshot set. Tests and qualification notes are in [QA](../docs/qa.md).

## Revised Kujo signature

- `background-still.png`: actual bb home with the Kujo workflow artwork and wordmark.
- `background-signal.png`: same native UI, decorative animation held at its 3px slice phase.
- `background-reduced-motion.png`: static artwork retained, animations disabled.

Editor/terminal captures in this revision use the separately repaired bundled Monaco editor. See `docs/workspace-repaired-qa.json`; stock baseline exceptions remain documented.
