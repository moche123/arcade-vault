# 01 — Port Visual Screens (MVP)

**State:** Approved
**Depends on:** —
**Date:** 2026-08-13

**Objective:** Port the 5 reference-template screens (`references/templates/`) into real Next.js App Router pages with the same neon-arcade visual design, mock auth, and mock score-save — no actual game logic.

## Scope

**In:**
- 5 screens, each a real route: Library/home (`/`), Game Detail (`/juego/[id]`), Game Player (`/juego/[id]/jugar`), Auth (`/auth`), Hall of Fame (`/salon`).
- Shared `Nav` (desktop + mobile hamburger panel) and footer, rendered from root layout.
- Mock data ported from `references/templates/data.jsx` (`GAMES`, `CATS`, `PLAYERS`, `seededScores`) into typed TS.
- Mock auth: guest/username-only "login" persisted to `localStorage` (`av_user`), shared across pages via a client-side Auth context.
- Mock score save on game-over: writes to `localStorage` (`av_scores`); not read back anywhere (matches template — Hall of Fame always shows seeded fake data).
- Visual CSS ported near-verbatim from `references/templates/styles.css` into `app/globals.css`, including background/noise layers, CRT/pixel/neon effects.
- Fonts: Press Start 2P, Courier Prime, JetBrains Mono via `next/font/google`, replacing the current Geist fonts in `app/layout.tsx`.
- TypeScript interfaces for `Game`, `ScoreRow`, `ScoreEntry`, `User`.
- Spanish UI text throughout (matches template).

**Not in (deferred):**
- Any real game logic/mechanics for any of the 8 games — Game Player stays a decorative placeholder (fake auto-incrementing score, static sprites), exactly as the template already is.
- Real backend/API/database — auth and scores stay `localStorage`-only mocks.
- Real social login (Google/GitHub buttons are visual only, non-functional, as in template).
- Reading back saved scores anywhere (template doesn't do this either).
- Tailwind-utility rewrite of the visual design — raw CSS port only.
- Any screen not in the 5 template files.

## Data model

New TypeScript types, in `lib/types.ts`:

```ts
export interface Game {
  id: string;
  title: string;
  short: string;
  long: string;
  cat: "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";
  cover: string;
  color: "cyan" | "magenta" | "green" | "yellow";
  best: number;
  plays: string;
}

export interface ScoreRow {
  rank: number;
  name: string;
  score: number;
  date: string;
}

export interface ScoreEntry {
  game: string;
  score: number;
  name: string;
  at: number;
}

export interface User {
  name: string;
}
```

`lib/data.ts` exports `GAMES: Game[]`, `CATS: string[]`, `PLAYERS: string[]`, and `seededScores(seed: number, count?: number): ScoreRow[]` — direct port of `data.jsx`'s logic.

`lib/storage.ts` wraps `localStorage` access (`getUser`, `saveScore`), called only from client components inside `useEffect`/event handlers, never during render, to avoid SSR hydration mismatches.

Auth state (`user`, `login`, `logout`) lives in a client `AuthProvider` context (`components/AuthProvider.tsx`) mounted in root layout, initialized from `localStorage` on mount. Replaces the template's single `App`-level `useState`, since App Router pages remount independently across navigations and need a shared source of truth for the Nav to reflect login state immediately after `/auth` redirects to `/`.

## Implementation plan

1. Add `lib/types.ts` and `lib/data.ts` (ported `GAMES`/`CATS`/`PLAYERS`/`seededScores`).
2. Add `lib/storage.ts` (`getUser`/`setUser`/`clearUser`/`saveScore` over `localStorage`).
3. Add `components/AuthProvider.tsx` (client context: `user`, `login(user)`, `logout()`).
4. Update `app/layout.tsx`: swap Geist → Press Start 2P / Courier Prime / JetBrains Mono via `next/font/google`; wrap children in `AuthProvider`; render `Nav`, `av-bg`/`av-noise` background layers, and footer; use `LayoutProps<'/'>` for props typing per this repo's Next 16 conventions.
5. Port `styles.css` into `app/globals.css` (append after the existing Tailwind import), keeping all template class names (`.av-nav`, `.card`, `.crt`, `.pixel`, `.neon-cyan`, etc.) unchanged so ported components need no class renaming.
6. Add `components/Nav.tsx` (client component): desktop links + mobile hamburger panel, active-link state via `usePathname()`, login/logout button wired to `AuthProvider`.
7. Add `components/GameCard.tsx` (client component, tilt-on-hover) — extracted from `biblioteca.jsx`.
8. Add `app/page.tsx` (client component): Library screen — hero, search input, category chips, `GameCard` grid, `Link`s to `/juego/[id]`.
9. Add `app/juego/[id]/page.tsx` (client component, `PageProps<'/juego/[id]'>`): Game Detail screen — cover, tags, stats, leaderboard aside (`seededScores`), "JUGAR AHORA" → `/juego/[id]/jugar`.
10. Add `app/juego/[id]/jugar/page.tsx` (client component, `PageProps<'/juego/[id]/jugar'>`): Game Player screen — HUD, CRT arena with decorative fake score ticker (`setInterval`, matches template), pause/end/save-score modal writing via `lib/storage.ts`.
11. Add `app/auth/page.tsx` (client component): login/create-account tabs, guest button, all calling `AuthProvider.login` then redirecting to `/` via `useRouter`.
12. Add `app/salon/page.tsx` (client component): Hall of Fame — per-game tabs, podium, table, "your best" row when `user` is set.
13. Remove now-unused default Next.js scaffold content from `app/page.tsx`/`app/globals.css` that the Library screen replaces.
14. Run `npm run lint` and `npm run build`; fix any type/lint errors.

## Acceptance criteria

- [ ] `/` renders the Library screen: hero, search, category chips, game grid; each card links to `/juego/[id]`.
- [ ] `/juego/[id]` renders Game Detail: cover, tags, description, stat strip, leaderboard aside, "JUGAR AHORA" and "VOLVER AL VAULT" actions.
- [ ] `/juego/[id]/jugar` renders Game Player: HUD (player/score/lives/level), CRT arena, pause toggle, end-game modal with save-score form writing to `localStorage`.
- [ ] `/auth` renders login/create-account tabs and a guest button; any of the three paths sets the user in `AuthProvider` and redirects to `/`.
- [ ] `/salon` renders Hall of Fame: per-game tabs, 3-slot podium, ranked table, and a highlighted "your score" row when logged in.
- [ ] `Nav` (desktop + mobile) is present on every route, highlights the active section, and reflects logged-in/guest state without a full page reload.
- [ ] Fonts are Press Start 2P / Courier Prime / JetBrains Mono via `next/font/google`; no remaining Geist references in `app/layout.tsx`.
- [ ] Background (`av-bg`), noise (`av-noise`), and all template CSS effects (neon text, CRT scanlines, pixel font, card tilt) render as in the template.
- [ ] `npm run lint` and `npm run build` both pass with no errors.
- [ ] No real game mechanics exist anywhere — Game Player's score movement is the same decorative placeholder as the template.

## Decisions taken and discarded

- **Real App Router routes** over replicating the template's hash-based SPA router — idiomatic for this Next 16 App Router project; user confirmed.
- **CSS ported near-verbatim** into `globals.css` over a Tailwind-utility rewrite — preserves exact visual fidelity for this visual-only MVP; a utility rewrite is deferred as separate scope. User confirmed.
- **Auth state moved into a client Context (`AuthProvider`)** instead of the template's single top-level `App` `useState` — necessary because App Router pages remount per navigation; still backed by the same `localStorage` key (`av_user`) and mock-login behavior the user confirmed.
- **Fonts swapped to the template's three fonts** via `next/font/google`, replacing Geist — user confirmed.
- **Proper TypeScript interfaces** (`Game`, `ScoreRow`, `ScoreEntry`, `User`) added — user confirmed, matches this being a TS project.
- **Game Player keeps its decorative fake-score placeholder** (not a static "coming soon" message) — user confirmed this still counts as "visual part," no real gameplay implied.
- **UI text stays Spanish** — user confirmed, matches template and project README.
- **Scores are written but never read back** — matches template behavior exactly (Hall of Fame always shows seeded fake data); out of scope to change this.

## Identified risks

- `localStorage` access during render (not inside `useEffect`/handlers) would cause SSR hydration mismatches in the App Router — mitigated by centralizing all access in `lib/storage.ts`, called only client-side after mount.
- Pages that were server components by default in template-less App Router scaffolding must be explicitly marked `'use client'` wherever they use state/effects/browser APIs (Library, Game Detail, Game Player, Auth, Hall of Fame, Nav) — missing a directive will surface as a build error, not a silent bug.
