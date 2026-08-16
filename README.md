# Try the Work

Try the Work lets people experience possible career transitions before committing to them.

## Current V0

- Business Analyst → Product Manager
- Software Engineer → Product Manager
- Three scenarios per transition
- Cumulative Career Snapshot
- My Futures
- Local persistence and resume
- Netlify-ready feedback and custom-transition waitlist

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

## Production build

```bash
npm run build
```

The production files are written to `dist`.

## Product principle

**Try the Work doesn't tell you whether you're fit for a career. It helps you discover whether the career is fit for you.**

## Deployment

Netlify uses `npm run build`, publishes `dist`, and reads the SPA redirect and form configuration from `netlify.toml` and `index.html`.

Before launch, add the real LinkedIn URL to `src/config/site.js`. No environment variables are required for V0.
