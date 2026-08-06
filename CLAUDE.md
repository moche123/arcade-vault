# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Arcade Vault — plataforma para jugar online y competir por puntos (per README.md). Currently a fresh `create-next-app` scaffold (App Router, TypeScript, Tailwind CSS v4) with no game logic yet.

## Critical: Next.js version mismatch with training data

This repo pins `next@16.3.0`, a version ahead of this model's training data. **Before writing any Next.js code** (routing, layouts, pages, data fetching, config), check `node_modules/next/dist/docs/` for the current API — do not assume APIs from older Next.js versions still apply. Key differences already visible in this codebase:

- `layout.tsx` / `page.tsx` use global, import-free `LayoutProps<'/route'>` and `PageProps<'/route'>` helper types instead of manually-typed `{ children }` / `{ params, searchParams }` props. See `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md` and `page.md`.
- Full docs tree: `node_modules/next/dist/docs/01-app/` (App Router), `02-pages/` (Pages Router), `03-architecture/`. Check `01-getting-started/18-upgrading.md` and `02-guides/upgrading/codemods.md` when in doubt about migrated APIs.

## Commands

```bash
npm run dev      # start dev server (Turbopack)
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint (flat config: eslint.config.mjs)
```

No test runner is configured yet.

## Architecture

- App Router under `app/`: `app/layout.tsx` (root layout, Geist fonts), `app/page.tsx` (home page). Path alias `@/*` → repo root (`tsconfig.json`).
- Styling: Tailwind CSS v4 via `@tailwindcss/postcss` (config in `postcss.config.mjs`), global styles in `app/globals.css`.
- `next.config.ts` is currently empty (no custom config).

## Spec-driven workflow

Per README.md, this project follows Spec Driven Design using `/spec` and `/spec-impl`, based on conventions from https://github.com/Klerith/fernando-skills, installed via:

```bash
npx skills@latest add Klerith/fernando-skills
```

Prefer writing/updating a spec before implementing non-trivial features, if `/spec` tooling is present.
