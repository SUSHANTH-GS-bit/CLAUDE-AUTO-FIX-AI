# Auto Fix AI — Standalone Duplicate Build

This is a second, independent, fully working copy of Auto Fix AI. It does not depend on this chat, any API key, or any backend — it runs entirely as static files.

## What actually works right now

- **AI Mechanic Chat** (`mechanic.html`) — real offline knowledge base covering 10 common car problems (engine light, AC, knocking, battery, brakes, overheating, vibration, mileage, oil, tyres). Optional: paste a Claude API key to attempt a live call (see note below).
- **Garage Finder** (`garages.html`) — a genuine interactive map using Leaflet + OpenStreetMap (free, no API key needed), with 6 sample garages around Bengaluru, real distance calculation, and a "Use my location" button using your browser's real GPS.
- **Spare Parts Checker** (`parts.html`) — live search and brand filtering over a real dataset of 16 parts.

## How to test it

**Fastest way:** double-click `index.html` — it opens directly in your browser. Every page works from the file system with no server.

**Recommended way (avoids rare browser file:// restrictions):**
```bash
cd autofix-ai-v2
python3 -m http.server 8000
# then open http://localhost:8000
```
or, if you have Node installed:
```bash
npx serve .
```

## How to deploy it for free

Any static host works, since there's no build step:

- **Netlify:** drag the whole `autofix-ai-v2` folder onto app.netlify.com/drop
- **GitHub Pages:** push this folder to a repo, enable Pages in Settings
- **Vercel:** `npx vercel` inside this folder

## About the "live AI" option

The API key field in `mechanic.html` will try calling `api.anthropic.com` directly from the browser. In most environments this will be **blocked by CORS**, because Anthropic's API isn't designed to be called directly from client-side JavaScript — this is normal and expected for a static site. When it fails, the app automatically falls back to the offline answer instead of breaking.

To get real live AI answers, the next step is a tiny backend (a single serverless function on Vercel/Netlify/Firebase Cloud Functions) that holds your API key and forwards chat requests — happy to build that next if you want it.

## File structure

```
autofix-ai-v2/
├── index.html       Home page
├── mechanic.html     AI chat UI
├── mechanic.js       Chat logic + offline knowledge base
├── garages.html      Map UI
├── garages.js        Leaflet map logic + sample garage data
├── parts.html        Parts checker UI
├── parts.js          Search/filter logic + parts dataset
├── style.css         Shared dark theme (all pages)
├── main.js           Shared nav toggle
└── README.md         This file
```

## Editing the data

- Add/edit garages: `GARAGES` array at the top of `garages.js`
- Add/edit spare parts: `PARTS` array at the top of `parts.js`
- Add/edit offline car-problem answers: `KNOWLEDGE_BASE` array in `mechanic.js`
