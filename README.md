# Flexodoro

Flexible focus timer built with Next.js App Router, TypeScript, Tailwind, Zustand, Prisma, and PostgreSQL.

## Features Implemented (Sprint 0 -> Sprint 5)
- Drift-safe timer engine (start, pause, reset)
- Fixed and flexible focus modes
- Break suggestion modal with dynamic break calculations
- Focus music engine (track selection, play/pause, volume)
- Fullscreen deep-work mode and minimal timer interface
- Session persistence API (`/api/sessions`)
- Analytics APIs (`/api/stats`, `/api/insights`)
- Stats dashboard (daily focus, weekly trend, insights)
- Landing page section (hero, CTA, feature highlights)
- Settings panel (theme, default mode, duration preferences, flexible break ratio)

## Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Zustand
- Prisma ORM
- PostgreSQL

## Local Development
1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
```

Optional:
- `NEXT_PUBLIC_APP_URL` for production canonical URL/metadata.

3. Start dev server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Build and Lint
```bash
npm run lint
npm run build
```

## API Routes
- `GET /api/health`
- `POST /api/sessions`
- `GET /api/stats`
- `GET /api/insights`

## Deployment (Vercel)
See: [docs/deployment/vercel.md](docs/deployment/vercel.md)

## Release Checklist
See: [docs/deployment/launch-checklist.md](docs/deployment/launch-checklist.md)
