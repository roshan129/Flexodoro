# Flexodoro Sprint Plan

This document is the master index for Flexodoro sprint planning.

## Tech Stack (Final Decision)

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state)

### Backend (Phase 1: MVP / Fast Build)
- Next.js API Routes (built-in backend)
- Database: PostgreSQL (via Prisma)
- Auth: optional (later)

### Why This Stack
- Single codebase (fast dev)
- Scales later easily
- No need for separate backend initially

### Future Upgrade (if needed)
- Move to NestJS / Express
- Or keep Next.js API (totally fine for this app)

## Sprint Files
- [Sprint 0 - Foundation](docs/sprints/sprint-0.md)
- [Sprint 1 - Timer Core](docs/sprints/sprint-1.md)
- [Sprint 2 - Flexible Mode](docs/sprints/sprint-2.md)
- [Sprint 3 - Experience (Premium Feel)](docs/sprints/sprint-3.md)
- [Sprint 4 - Analytics](docs/sprints/sprint-4.md)
- [Sprint 5 - Productization](docs/sprints/sprint-5.md)

## Final Architecture Summary

### Frontend
- Next.js (App Router)
- Zustand
- Tailwind

### Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL
