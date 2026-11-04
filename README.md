# JARVIS AI v1.6 Speed-Optimized Prototype

This is a zero-cost-first front-end prototype. It improves local responsiveness and reduces unnecessary network and animation work.

## Speed improvements
- Removes the external Google Fonts dependency so the first screen does not wait for a font download.
- Uses system fonts and lightweight CSS containment.
- Limits saved chat history to the latest 100 messages and handles storage errors safely.
- Pauses the animated orb when the page is in the background.
- Caps animation to a practical 60 FPS by default, lowers it in battery saver, and limits canvas pixel ratio.
- Reduces orb particles and uses a desynchronized canvas context when supported.
- Service worker caches only same-origin app files, not third-party requests, and uses a fresh cache version.

## Important limitations
This remains a front-end prototype. It does not yet have a real AI model/backend, real translation engine, Google sign-in, cloud sync, or full-duplex voice. Browser speech recognition and speech synthesis depend on the phone/browser and installed language voices. No speed claim versus Gemini or ChatGPT is made.

## Publish
Upload the files and `docs/` folder contents to the repository root on the `main` branch, replacing the existing files. Keep the repository Pages source set to `main` / root.


## v1.7 Custom Orbit UI
- Added Appearance Studio with four orb presentation styles.
- Five accent color palettes, motion presets, orb size and glow controls.
- Preferences save locally on the device and apply instantly.
- No paid service, external font, or API key is used by the customization layer.
- This remains a front-end prototype. Full AI backend, real translation, cloud login and cross-device sync are not included.
