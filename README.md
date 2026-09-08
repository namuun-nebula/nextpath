# NextPath — local dev scaffold

This is the original `nextpath.jsx` prototype running inside a minimal
Next.js (App Router) project. No visual or behavioral changes were made —
`app/page.js` is byte-identical to the prototype except for one added line
(`"use client";`, required because the component uses React state, refs,
and browser APIs like `window.matchMedia`).

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Build for production

```bash
npm run build
npm start
```

## What's here

- `app/page.js` — the entire NextPath UI (unchanged from the prototype)
- `app/layout.js` — minimal root layout (just `<html>`/`<body>` + page title)
- `app/globals.css` — a two-rule reset (remove default body margin,
  `box-sizing: border-box`) so the page renders edge-to-edge like it did
  in the prototype preview. No design changes.
- `package.json` — Next.js, React, and `lucide-react` (the only external
  dependency the component uses)

## Data

Opportunity data is still the hardcoded `OPPS` array inside `app/page.js`,
exactly as it was in the prototype. Airtable is not connected yet — that's
a separate, later step.
