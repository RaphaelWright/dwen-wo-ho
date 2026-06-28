---
goal: Patient Lock-In Onboarding UI (Hybrid Mockup)
version: 1.0
date_created: 2026-06-28
last_updated: 2026-06-28
owner: Dwen Wo Ho
status: "Completed"
tags: [feature, patient, onboarding, ui]
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-brightgreen)

Ship a unified patient onboarding experience at `/patient/join`: Main Patients-inspired social proof left panel plus a Qwen-inspired four-step wizard on the right. Legacy fragmented auth UI is archived under `_unused/`; API wiring is deferred to a follow-up.

## 1. Requirements & Constraints

- **REQ-001**: Single entry at `ROUTES.patient.join` with 4-step local wizard (contact → OTP → profile → education)
- **REQ-002**: Left panel shows rotating student testimonials with brand tokens (Care Purple, warm sand)
- **REQ-003**: Referral pill reads `?ref=` search param; defaults to `Setornam`
- **REQ-004**: Password reset at `/patient/reset-password` and `/patient/reset-password/new` (no legacy URL stubs)
- **REQ-005**: Route groups isolate onboarding split layout from care routes (lock-in, waiting-room, profile)
- **CON-001**: UI-only v1 — no service/API calls; final submit logs draft to console
- **CON-002**: Follow AGENTS.md layered architecture (Component → Hook; no inline types in `.tsx`)
- **GUD-001**: Impeccable/DESIGN.md — solid primary buttons, Geist body, Poppins headings, no emoji headings
- **PAT-001**: Archive legacy modules to `_unused/` per repo convention

## 2. Implementation Steps

### Implementation Phase 0 — Archive legacy auth

- GOAL-001: Move legacy patient auth routes, components, and hooks to `_unused/`

| Task     | Description                                               | Completed | Date       |
| -------- | --------------------------------------------------------- | --------- | ---------- |
| TASK-001 | Archive `check-email`, `signin`, `signup` app routes      | ✅        | 2026-06-28 |
| TASK-002 | Archive matching components and hooks                     | ✅        | 2026-06-28 |
| TASK-003 | Keep post-onboarding routes (lock-in, waiting-room, etc.) | ✅        | 2026-06-28 |

### Implementation Phase 1 — Route groups

- GOAL-002: Split onboarding and care layouts

| Task     | Description                                               | Completed | Date       |
| -------- | --------------------------------------------------------- | --------- | ---------- |
| TASK-004 | Passthrough `src/app/patient/layout.tsx`                  | ✅        | 2026-06-28 |
| TASK-005 | `(onboarding)/layout.tsx` with split shell                | ✅        | 2026-06-28 |
| TASK-006 | `(care)/layout.tsx` full-width shell                      | ✅        | 2026-06-28 |
| TASK-007 | Remove legacy auth routes; canonical `/patient/join` only | ✅        | 2026-06-28 |

### Implementation Phase 2 — UI build

- GOAL-003: Left social proof + right wizard

| Task     | Description                                           | Completed | Date       |
| -------- | ----------------------------------------------------- | --------- | ---------- |
| TASK-008 | `social-proof-panel/*` with motion crossfade          | ✅        | 2026-06-28 |
| TASK-009 | `use-onboarding-wizard` UI state machine              | ✅        | 2026-06-28 |
| TASK-010 | Step components (contact, verify, profile, education) | ✅        | 2026-06-28 |
| TASK-011 | Referral pill + progress bar + workspace orchestrator | ✅        | 2026-06-28 |

### Implementation Phase 3 — QA

- GOAL-004: Quality gates

| Task     | Description                            | Completed | Date       |
| -------- | -------------------------------------- | --------- | ---------- |
| TASK-012 | `npm run lint`, `npx tsc --noEmit`     | ✅        | 2026-06-28 |
| TASK-013 | `pnpm components:audit`, `hooks:audit` | ✅        | 2026-06-28 |
| TASK-014 | `react-doctor --scope changed`         | ✅        | 2026-06-28 |

## 3. Alternatives

- **ALT-001**: Keep legacy multi-route auth flow — rejected; plan targets unified wizard entry
- **ALT-002**: Wire OTP/signup APIs in v1 — deferred; reduces scope for UI validation

## 4. Dependencies

- **DEP-001**: shadcn `Field`, `Input`, `InputGroup`, `InputOTP`, `Select`, `Button`
- **DEP-002**: `motion/react` for testimonial crossfade (`useReducedMotion`)
- **DEP-003**: Existing `Logo`, `/auth/worried-lady.png` asset

## 5. Files

- **FILE-001**: `src/app/patient/(onboarding)/*` — onboarding routes and layout
- **FILE-002**: `src/app/patient/(care)/*` — care routes moved from patient root
- **FILE-003**: `src/components/patient/onboarding/**` — shell, social proof, steps, workspace
- **FILE-004**: `src/hooks/patient/onboarding/use-onboarding-wizard.ts`
- **FILE-005**: `src/lib/constants/components/patient/onboarding.ts`
- **FILE-006**: `src/lib/types/components/patient/onboarding-wizard.ts`
- **FILE-007**: `_unused/app|components|hooks/patient/*` — archived legacy auth

## 6. Testing

- **TEST-001**: Desktop — 40/60 split, referral pill, 4-step navigation
- **TEST-002**: Mobile — left panel hidden; logo in header
- **TEST-003**: `?ref=CustomHandle` updates pill text
- **TEST-004**: Keyboard — OTP slots focus advance; visible focus rings
- **TEST-005**: `prefers-reduced-motion` — testimonial cycle disabled
- **TEST-006**: `/patient/join` is the only onboarding entry; care routes under `(care)/`

## 7. Risks & Assumptions

- **RISK-001**: Password-reset pages no longer inherit old 50/50 patient layout — acceptable per plan
- **RISK-002**: Phone flow is interactive but not submitted — API follow-up required
- **ASSUMPTION-001**: Default referral handle `Setornam` is sufficient for demo until landing CTA passes `?ref=`

## 8. Related Specifications / Further Reading

- Cursor plan: `patient_onboarding_ui_4a56d724.plan.md`
- `DESIGN.md`, `PRODUCT.md`
- Deferred: wire `useAuthQuery`, `PatientSignUpSchema`, school/programme queries
