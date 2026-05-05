# Flexodoro Project Context

## What this project is
Flexodoro is a focus timer product built on Next.js App Router with a PostgreSQL-backed session store and client-side timer/audio state. It supports fixed Pomodoro mode and flexible deep-work mode with dynamic break suggestions.

## Stack
- Next.js `16.2.3` (App Router)
- React `19.2.4`
- TypeScript
- Tailwind CSS v4
- Zustand (state + persistence)
- Prisma ORM + `@prisma/adapter-pg`
- PostgreSQL
- Framer Motion, Lucide, Recharts

## Top-level structure
- `app/`: App Router pages, layouts, API routes
- `features/`: feature modules (timer, stats, music, settings, figma)
- `store/`: global Zustand store
- `lib/`: shared logic (time, break calculations, stats aggregation, Prisma client)
- `prisma/`: Prisma schema
- `docs/`: sprint/deployment docs
- `design/`: separate design/prototype assets and routes

## Routes currently mounted
- `/` -> `features/figma/LandingPage`
- `/app` -> `features/figma/TimerScreen`
- `/app/stats` -> `features/figma/StatsPage`
- `/app/settings` -> `features/settings/components/settings-panel`

Routing files:
- `app/page.tsx`
- `app/app/page.tsx`
- `app/app/stats/page.tsx`
- `app/app/settings/page.tsx`
- `app/app/layout.tsx`

## Important implementation split
There are two UI tracks in the repo:

1. `features/figma/*`
- Rich, styled screens used by currently mounted routes for landing/timer/stats.
- Includes a lot of inline style and mock/demo data in some places.

2. `features/timer`, `features/stats`, `features/music`, `features/settings`
- Functional feature modules with real app state and API integration.
- `TimerPanel` and `StatsDashboard` are production-like functional components.

Current state: mounted timer/stats pages are from `features/figma/*`, while more data-integrated components exist in `features/timer/*` and `features/stats/*`.

## State model (Zustand)
Main state lives in `store/use-app-store.ts`.

### Core timer state
- `mode`: `fixed | flexible`
- `status`: `idle | running | paused`
- `phase`: `work | break`
- `workDurationMinutes`, `breakDurationMinutes`
- `remainingSeconds`
- `currentWorkStartedAtMs`
- `showBreakSuggestionModal`, `lastWorkDurationSeconds`, `suggestedBreakSeconds`

### UI/audio state
- `isMinimalUi`, `isFullscreenMode`
- `selectedTrackId`, `isMusicPlaying`, `musicVolume`
- `isDarkMode`

### Persistence
Zustand persist key: `flexodoro-store`.
Persisted subset includes theme/mode/durations/flexible ratio/selected track/volume.

## Timer engine behavior
Implemented in `features/timer/hooks/use-timer-engine.ts`.

- Drift-safe countdown: stores target end timestamp and computes remaining time based on wall clock.
- Tick interval: 250ms.
- On work completion:
  - Saves session to `/api/sessions`.
  - In `fixed` mode: auto-switches to break and continues.
  - In `flexible` mode: computes dynamic break and opens break suggestion modal.
- On break completion:
  - Transitions back to work phase.

## Break logic
`lib/break.ts`:
- Break = `workDurationSeconds * ratio`
- Ratio clamped to `[0.1, 0.5]`
- Rounded to nearest 30s
- Min 60s, max 20m

## Music engine
`features/music/hooks/use-focus-audio-engine.ts`:
- Web Audio generated tracks (no external audio files).
- Tracks: `deep-focus`, `soft-rain`, `alpha-pulse`.
- Uses gain ramps for smooth fade in/out and volume changes.

## Data model
`prisma/schema.prisma`:
- `Session` model with:
  - `id` (cuid)
  - `mode` enum: `FIXED | FLEXIBLE`
  - `type` enum: `WORK | BREAK`
  - `durationSec`
  - `startedAt`, optional `endedAt`, `createdAt`

## API surface
- `GET /api/health`
- `POST /api/sessions`
- `GET /api/stats`
- `GET /api/insights`

### API behavior
- Sessions are written via Prisma in `app/api/sessions/route.ts`.
- Stats and insights read `WORK` sessions only.
- Aggregation logic in `lib/stats.ts`:
  - totals, average session, daily focus
  - 7-day trend buckets
  - best focus hour and average session length

## Prisma setup
`lib/prisma.ts` uses `PrismaClient` with `PrismaPg` adapter and `DATABASE_URL` fallback:
`postgresql://postgres:postgres@localhost:5432/flexodoro?schema=public`

## Styling/theme
- Global styles in `app/globals.css`
- CSS variables for light/dark palettes
- Utility classes like `surface-card`, `btn-primary`, `animate-rise`, `animate-pulse-soft`
- Root layout currently renders `<html className="... dark">`, so dark mode is forced globally.

## Known technical observations
1. Route wiring mismatch:
- `features/figma/TimerScreen` and `features/figma/StatsPage` are mounted for `/app` and `/app/stats`.
- More integrated modules (`TimerPanel`, `StatsDashboard`) are present but not mounted by those routes.

2. Theme toggle mismatch:
- `isDarkMode` exists in store and settings panel toggles it.
- Global dark class is hardcoded in root layout, so toggling store state alone does not switch document theme.

3. Prototype/design artifacts coexist with app code:
- `design/` and `features/figma/` include design-oriented components and mock-heavy views.

## Quick read path for future sessions
If you need fast onboarding, read in this order:
1. `PROJECT_CONTEXT.md` (this file)
2. `README.md`
3. `store/use-app-store.ts`
4. `features/timer/hooks/use-timer-engine.ts`
5. `app/api/sessions/route.ts`, `app/api/stats/route.ts`, `app/api/insights/route.ts`
6. `lib/stats.ts`, `lib/break.ts`, `lib/prisma.ts`
7. Mounted route files under `app/`

## Next.js version caveat
Per repo instruction in `AGENTS.md`: this project uses a Next.js version with possible breaking changes; consult docs under `node_modules/next/dist/docs/` before making framework-level changes.
