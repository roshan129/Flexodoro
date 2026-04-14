# Sprint 0 - Foundation

## Goal
Production-ready setup with clean architecture.

## Epic 0.1: Project Initialization

### Story 0.1.1 - Initialize Next.js App
**Description:**
Set up a new Next.js project with TypeScript and App Router.

**Acceptance Criteria:**
- App runs locally (`npm run dev`)
- TypeScript enabled
- No errors in console

### Story 0.1.2 - Folder Architecture
**Description:**
Create scalable folder structure for features.

**Acceptance Criteria:**
- Structure includes:
  - `/app`
  - `/features`
  - `/components`
  - `/store`
  - `/lib`
- Each feature isolated (timer, music, stats)

## Epic 0.2: UI Foundation

### Story 0.2.1 - Tailwind Setup
**Description:**
Configure Tailwind CSS with dark mode support.

**Acceptance Criteria:**
- Tailwind working
- Dark mode toggle possible
- Base styles applied

### Story 0.2.2 - Design System
**Description:**
Define global colors, typography, spacing.

**Acceptance Criteria:**
- Theme config defined
- Reusable classes created

## Epic 0.3: State Management

### Story 0.3.1 - Zustand Store Setup
**Description:**
Create global store for timer and app state.

**Acceptance Criteria:**
- Store created
- State accessible globally
- Basic test state works

## Epic 0.4: Backend Setup

### Story 0.4.1 - Setup Prisma + PostgreSQL
**Description:**
Initialize database connection using Prisma.

**Acceptance Criteria:**
- Prisma installed
- DB connected
- First model created (`Session`)

### Story 0.4.2 - API Route Setup
**Description:**
Create basic API routes in Next.js.

**Acceptance Criteria:**
- `/api/health` returns success
- API structure defined
