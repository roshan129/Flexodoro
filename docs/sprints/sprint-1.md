# Sprint 1 - Timer Core

## Goal
Fully working timer (logic + UI).

## Epic 1.1: Timer Engine

### Story 1.1.1 - Timer Hook
**Description:**
Create reusable timer hook with start/pause/reset.

**Acceptance Criteria:**
- Accurate timing (test 30 min)
- Pause/resume works
- No drift

### Story 1.1.2 - Timer Store Integration
**Description:**
Connect timer logic with Zustand store.

**Acceptance Criteria:**
- State updates correctly
- UI reflects state instantly

## Epic 1.2: Timer UI

### Story 1.2.1 - Timer Display
**Description:**
Create main timer UI.

**Acceptance Criteria:**
- Large readable timer
- Centered layout
- Responsive

### Story 1.2.2 - Timer Controls
**Description:**
Add Start, Pause, Reset controls.

**Acceptance Criteria:**
- Buttons functional
- Disabled states handled

## Epic 1.3: Fixed Pomodoro

### Story 1.3.1 - Presets
**Acceptance Criteria:**
- 25/5 and 40/10 available
- Switching resets timer

### Story 1.3.2 - Auto Transition
**Acceptance Criteria:**
- Work -> Break auto
- Sound triggers
