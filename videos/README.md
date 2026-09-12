# bb-kujo // live walkthrough

[Watch the MP4](bb-kujo-walkthrough.mp4)

An uninterrupted browser recording of bb 0.43 with Kujo 0.2.0. Opens the app, starts a new project chat, selects Codex 5.5 Medium, enters a read-only prompt asking about the theme, and waits for the real response. No reconstructed UI, substituted response, time acceleration, music or voiceover. 1600 × 1000, 25 fps, 67.76 seconds. MP4 is a transcode of the original Playwright WebM.

Approximate moments: opening 0:00, new chat 0:12, model picker 0:17, prompt submission 0:36, model activity 0:41–1:02, completed response 1:02–1:08. Event receipts use the script clock; video capture starts slightly later.

The recording uses an isolated bb instance. Codex CLI 0.144.4 initially rejected the machine's custom model catalog because newer entries omit two fields its schema requires. For this recording only, a temporary catalog copy supplies missing `supports_reasoning_summaries` and `supports_parallel_tool_calls` booleans as false. A temporary CLI wrapper in the isolated host's executable directory passes that catalog as a configuration override. The global catalog is unchanged; no compatibility wrapper or catalog ships in bb-kujo. 5.6-Sol also rejected the older CLI's Responses Lite request format, so the completed recording uses 5.5. These are provider setup issues, not theme behavior. Failed preliminary chats remain visible in the isolated sidebar; their output is not used in the delivered recording.

## Reproduce

Use an isolated bb instance with Kujo installed and an authenticated, compatible Codex CLI. This sends one real model prompt and creates a real thread in the `bb-kujo` project. It can consume normal model usage. It does not mock provider output.

```sh
BB_SERVER_URL=http://127.0.0.1:48896 BB_VIDEO_MODEL=5.5 node scripts/record-walkthrough.mjs
ffmpeg -i artifacts/walkthrough/bb-kujo-walkthrough.webm -c:v libx264 -crf 19 -pix_fmt yuv420p -movflags +faststart -an videos/bb-kujo-walkthrough.mp4
```

The script requires Chrome and the existing development dependencies. `BB_VIDEO_DIR` changes the recording directory. It fails on provider startup errors, waits for a completed assistant response, saves a response screenshot and records browser errors. Model and project picker labels track bb 0.43 and may need updating on newer hosts. `recording.json` is the successful capture receipt; `response.png` shows the actual answer. The MP4 was fully decoded without errors and opening/model/running/response frames were inspected.
