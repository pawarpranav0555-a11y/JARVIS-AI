# JARVIS AI Starter 0.3.0

This is a local-first **starter foundation**, not a finished ChatGPT/Gemini/Claude replacement and not yet a native Android app.

## Included and working
- Marathi-first mobile-friendly assistant interface
- Local instant commands for date, time, notes, tasks and help
- Browser speech-to-text when supported by the Android browser
- Text-to-speech using the device's installed speech voices
- Local notes, tasks and reminders using browser storage
- Reminder checks while the page is running
- PWA manifest and service worker for basic offline app-shell caching
- Safe DOM rendering for user-provided notes and messages

## Not yet connected
- Online AI provider APIs / model router
- Offline on-device LLM
- Cloud database / account sync
- Background microphone / wake word
- Reliable lock-screen alarms
- Native camera vision
- Android app-control / accessibility automation
- Coding agent that executes projects in a sandbox
- Website and APK build pipeline

These require separate modules, permissions, device testing and, for online AI, a secure backend. Never put provider API keys in `app.js` or any public GitHub file.

## Phone-first free workflow
1. Upload the files in this folder to the existing GitHub repository root.
2. In GitHub repository Settings → Pages, publish from the `main` branch and `/ (root)`.
3. Open the published HTTPS URL on Android Chrome.
4. Use Chrome menu → Add to Home screen / Install app if offered.
5. Test notes, tasks, voice and reminders with the page open.

## Approved requirements and development status
The complete locked scope is in `docs/REQUIREMENTS-LOCK.md`. The current verified implementation and next milestone are in `docs/DEVELOPMENT-BOARD.md`. The technical architecture remains in `docs/MASTER-PLAN.md`.

## Testing
Open `tests/manual-checklist.md` and verify each item on the actual Android phone. Browser speech recognition and notifications vary by device/browser and permission state.
