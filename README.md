# JARVIS AI v1.5 Multi-language Prototype

## Language coverage in the interface
Priority quality targets:
- Marathi (India) `mr-IN`
- Hindi (India) `hi-IN`
- English (India) `en-IN`
- English (United States) `en-US`

Additional selectable locales include Bengali, Gujarati, Kannada, Malayalam, Tamil, Telugu, Punjabi, Urdu, Odia, Assamese, Nepali, Sanskrit, Arabic, German, Spanish, French, Italian, Japanese, Korean, Portuguese (Brazil), Russian and Chinese (Mandarin).

The voice picker lists matching voices installed on the device/browser. Speech recognition availability and accuracy depend on the browser, operating system, selected locale, language packs, microphone and network.

## Quality requirements
Marathi and Hindi are priority languages. Production testing must cover natural Indian pronunciation, colloquial speech, regional accents/dialects, code-switching, names, numbers and background noise. A locale dropdown alone does not guarantee accurate dialect recognition or flawless grammar.

## Translation
The translator UI supports selecting from the same language list, source auto-detect selection, source/target swap, text entry and speech input. The translation engine is not connected yet. A secure translation/AI backend is required before it can provide actual translations. The prototype does not fabricate translated text.

## Limitations
This is a front-end prototype. Full AI chat, full-duplex voice, cloud accounts, Google OAuth, cloud backup and Play Store release are not implemented. 120 FPS is a rendering target, not a guarantee.
