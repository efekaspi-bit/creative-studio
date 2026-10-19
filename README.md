# Creative Studio

A creative assistant for creative industry students, built for Efe's PPB Skills project. The wider product supports idea exploration, storytelling, concept development and creative feedback. **Campaign Lab is the first implemented module**, not the entire product. Other modules are clearly marked as planned. The first case study uses an independently imagined Stüssy brief. This project is not affiliated with or endorsed by Stüssy.

## Version 1 — Campaign Lab
- Edit a brand, product, audience, goal, platform, tone and production brief.
- Compare three curated campaign concepts and choose a direction.
- Get a timed vertical-video shot plan and edit a caption.
- Record dated creative decisions, changes and reasons.
- Copy an AI-ready brief or download the campaign and decision journal.
- Keep drafts in local browser storage.

**This version uses deterministic templates, not live AI generation.** It is a functional interaction prototype for testing the creative workflow. Arbitrary brief constraints are shown in the shoot plan but are not automatically interpreted or guaranteed by the template engine.

## Run locally
No build or package installation is required.

```sh
python3 -m http.server 8080 --directory dist
```
Open http://localhost:8080. Data stays in this browser; use Download campaign for a portable record. Font files load from Google Fonts with system-font fallbacks.

## Next iteration
Connect a server-side model API with protected credentials, structured responses, error handling and clear generation provenance. Test whether its output is more useful than the three curated concepts. Never embed API keys in browser code.

## Files
- `dist/index.html`: semantic application shell
- `dist/style.css`: responsive visual design
- `dist/app.js`: briefs, concepts, shoot plans, local drafts and exports

No private PPB documents, interview data or credentials are included.
