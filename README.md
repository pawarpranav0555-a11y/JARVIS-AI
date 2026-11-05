# JARVIS AI v1.8 — AI Brain Foundation

This package is built from the saved v1.7 Custom Orbit UI ZIP. It preserves the existing v1.7 app files, corrects the manifest metadata, and bumps the service-worker cache to `jarvis-v18-ai-foundation`.

## Included
- Existing v1.7 HTML/CSS/JS and orb customization
- Corrected `manifest.webmanifest`
- Updated `sw.js` cache version to prevent stale v1.7 assets
- `docs/MASTER-PLAN.md`: complete available 110-point plan and 15 sections
- `docs/REQUIREMENTS-LOCK.md`: project constraints and 87-vs-110 reconciliation note
- `docs/AI-BRAIN-DATABASE-ARCHITECTURE.md`: Firebase/Firestore + secure Gemini gateway architecture
- `docs/UI-DIRECTION.md`: approved minimal main-screen direction

## Important truth about status
This is still a front-end prototype plus architecture documents. Firebase is not connected. Gemini is not connected. No live database, authentication, AI brain, billing, or native APK is included. No paid services or billing were activated.

## Before publishing
Upload all root files and the complete `docs/` folder to the existing repository `main` branch. Test the published app on Android Chrome, clear/refresh old service-worker cache if needed, and verify every flow. Do not upload secrets.
