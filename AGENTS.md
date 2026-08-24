# Estúdio LP

Internal landing-page builder for the REDNA agency. Single Next.js 15 (App Router) + React 19 + TypeScript + Tailwind app. See `README.md` for the product overview (Portuguese).

## Cursor Cloud specific instructions

- Single, fully client-side app. There is no backend, database, or environment variables; projects persist in the browser's `localStorage` (`lib/store.ts`). No secrets or auxiliary services are needed to run it end to end.
- Package manager is npm (`package-lock.json`). Dependencies are installed by the startup update script, so you normally don't need to reinstall.
- Standard commands live in `package.json` scripts:
  - Dev server: `npm run dev` — Next.js on `0.0.0.0:3000`. Run it in a tmux terminal so logs stay visible; do not use `npm run build`/`npm run start` for development.
  - Build (also type-checks): `npm run build`.
- `npm run lint` (`next lint`) is NOT runnable non-interactively: no ESLint config is committed, so it prompts to set one up and hangs without a TTY. Rely on `npm run build` for type/validity checks unless you intentionally configure ESLint.
- Core flow to smoke-test the app: on `/`, click a page-type card → pick a visual language → fill the briefing → "Abrir no estúdio" creates a project and opens `/studio/<id>` with the rendered template and a quality score. Because state is in `localStorage`, created pages are per-browser-profile and won't persist across a fresh browser session.
