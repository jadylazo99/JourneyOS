# JourneyOS Product Specification

> Single source of truth for product vision, architecture, and feature scope.

**Version 0.3** — Life Operating System foundation

---

## Vision

JourneyOS is a **Life Operating System** — not a habit tracker.

It learns about the user once, then quietly adapts to their life every day. The product reduces decisions, infers context automatically, and guides the user through each day with calm, conversational flow.

The user should never feel punished. There are no failed days — only different types of days.

---

## Core Principles

### Core Philosophy

- JourneyOS should **always adapt to the user's life**
- The user should **never feel punished**
- There are **no failed days** — only different types of days
- JourneyOS should **automatically infer context** whenever possible instead of constantly asking questions
- The goal is to **reduce decisions, not create more**

### Daily Engine

- Every calendar day has its own record
- Use the device's **local date** and **local timezone**
- If the timezone changes because the user travels, JourneyOS **automatically adjusts**
- Each day should be **stored forever**
- **Yesterday never changes**
- **Tomorrow starts empty**

### Adaptive Days

Instead of checklists, JourneyOS guides the user through the day.

**Day types:**

- Normal Day
- Busy Workday
- Gym Day
- Rest Day
- Vacation
- Travel Day
- Sick Day
- Recovery Day
- Custom

JourneyOS automatically detects situations when possible:

- New timezone
- Different country
- Weekend
- Missed sleep
- Vacation mode

If unsure, politely ask:

> "It looks like you're traveling. How should I plan today?"

### Weigh-Ins

Weigh-ins are **never mandatory**. JourneyOS asks naturally:

> "Want to log today's weight?"

**Actions:** Log Weight · Skip Today · Skip Until I'm Home · Not Now

Skipping never reduces streaks or consistency.

### Streaks → Consistency Score

Replace habit streaks with a **Consistency Score**.

Reward showing up, not perfection.

**Examples of consistency events:**

- Opened the app
- Logged weight
- Walked Bruno
- Completed workout
- Studied
- Drank water

Missing one thing should **never destroy progress**.

### Milestones

Automatically celebrate:

- First weigh-in
- Lost first pound
- Lost 5 pounds
- Lost 10 pounds
- Goal weight
- 7 consistent days
- 30 consistent days
- 100 consistent days
- Workout PRs
- Study milestones
- Debt milestones
- Savings milestones

### AI Personality (Future)

JourneyOS should feel like a **calm coach**:

- Never guilt
- Never shame
- Always encouraging

**Examples:**

- "Small steps still count."
- "You've been consistent lately."
- "You've earned a rest day."

> **v0.3:** AI not implemented. Copy and tone guidelines apply to all static messaging.

---

## Navigation

- **Mobile:** Bottom tab bar (Today, Progress, Journey, Resources, Profile)
- **Desktop:** Sidebar navigation
- Onboarding gate: incomplete users redirect to `/onboarding`
- Today is the default home (`/`)

---

## Onboarding

First-run flow collects profile data once:

- Name, birthday, height, weight, goal weight, main goal
- Wake/bed times, work status, gym access
- Food preferences, allergies, pets

Stored in `localStorage` (`journeyos_user_profile`). Sets `onboardingComplete: true` on finish.

---

## Today

### Conversation Flow (v0.3)

No giant checklist. **One card at a time.** Conversation flow:

1. **Greeting** — "Good Morning, {name}."
2. **Ready** — "Ready to begin?"
3. **Travel prompt** *(conditional)* — Detect timezone change; ask how to plan today
4. **Weigh-in** *(conditional)* — Natural, skippable weight prompt
5. **Today's focus** — Adaptive message based on day type
6. **Next best action** — Single suggested action (module-pluggable)
7. **Celebrate progress** — Consistency highlights
8. **Done** — Effortless close

The screen should feel effortless.

### Day Record

Each day is keyed by local date (`YYYY-MM-DD`) and stores:

- Day type and detection source (auto vs user)
- Timezone at creation
- Consistency events
- Weigh-in state
- Flow progress
- Immutable once the day is in the past

---

## Progress

Track growth across life domains — metrics, trends, Consistency Score over time.

*v0.3: Placeholder UI. Powered by daily engine data model.*

---

## Journey

Long-term path mapping — chapters, milestones, goals, reflection.

*v0.3: Placeholder UI. Milestone engine defined in daily module.*

---

## Resources

Curated knowledge library — collections, categories, saved content.

*v0.3: Placeholder UI.*

---

## Profile

User identity, preferences, settings. Populated from onboarding profile.

*v0.3: Placeholder UI.*

---

## Modules

Feature modules plug into the daily engine:

| Module | Path | Status |
|--------|------|--------|
| App shell | `modules/app` | Active |
| Onboarding | `modules/onboarding` | Active |
| Daily Engine | `modules/daily` | **v0.3** |
| Workouts | `modules/workouts` | Future |
| Nutrition | `modules/nutrition` | Future |
| AI Coach | `modules/ai` | Future |

All modules read/write through the **day record** for today and respect immutability for past days.

---

## Data Model

### Onboarding Profile

`journeyos_user_profile` — user baseline data from onboarding.

### Day Record

`journeyos_daily_records` — keyed by local date:

```ts
DayRecord {
  dateKey: string          // YYYY-MM-DD (local)
  timezone: string         // IANA timezone
  dayType: DayType
  dayTypeSource: 'auto' | 'user'
  consistencyEvents: ConsistencyEvent[]
  weighIn: WeighInState
  flowStep: FlowStepId
  flowCompleted: boolean
  detectedSignals: string[]
  createdAt: string
  updatedAt: string
}
```

### Consistency Event

```ts
ConsistencyEvent {
  id: string
  type: ConsistencyEventType
  timestamp: string
  points: number
}
```

### Principles

- Past day records are **read-only**
- New local day = **new empty record**
- Timezone change on existing day updates context, does not rewrite history

---

## Design System

Apple-inspired design throughout:

- **Primary:** `#0F172A`
- **Blue:** `#2563EB`
- **Accent:** `#60A5FA`
- **Background:** `#F8FAFC` (app shell); Today uses deep navy gradients
- Glassmorphism, 32px rounded corners, soft shadows
- SF Pro system font stack
- Mobile-first, premium spacing
- No clutter — every interaction should feel premium

---

## Animations

- Framer Motion for page and card transitions
- One card at a time on Today — slide/fade between flow steps
- Progress and buttons use subtle scale/hover feedback
- Onboarding: directional slide between questions
- Calm, fluid easing — never jarring

---

## Notifications

Future: gentle, contextual nudges aligned with coach personality.

- Never guilt-based
- Respect skip preferences (e.g. weigh-in deferred until home)
- User-controlled timing

*v0.3: Not implemented.*

---

## Roadmap

| Version | Scope |
|---------|-------|
| **0.1** | App shell, onboarding, PWA |
| **0.2** | Premium onboarding UX |
| **0.3** | Daily engine, adaptive days, Today conversation flow, consistency score foundation, milestones registry |
| **0.4** | Progress dashboard wired to daily data |
| **0.5** | Weigh-in trends, milestone celebrations UI |
| **1.0** | Workouts, nutrition modules |
| **2.0** | AI calm coach |
