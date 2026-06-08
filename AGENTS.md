# Agent Instructions

## ⚠️ This Is Not the Next.js You Know

This codebase runs a version of Next.js with **breaking changes** — APIs, routing conventions,
and file structure may differ significantly from your training data.

**Before writing any code:**

- Read the relevant guide in `node_modules/next/dist/docs/`
- Respect all deprecation notices
- Do not assume compatibility with standard Next.js patterns

---

## Agent Skills

Before starting any task, check `.agents/` for available skills and use them.

---

## Architecture Contract *(Mandatory)*

This repository enforces a **strict layered architecture**. Every contribution — human or agent —
must comply with the rules below. No exceptions.

### Layer Ownership

| Layer         | Path              | Responsibility                                            |
| ------------- | ----------------- | --------------------------------------------------------- |
| Routes        | `app/`            | Route composition only                                    |
| Presentation  | `components/`     | UI rendering only (except `components/ui` primitives)     |
| Orchestration | `hooks/`          | React state/effects; calls services                       |
| Business Logic| `lib/services/`   | Business logic and API/data access                        |
| Utilities     | `lib/utils/`      | Pure, reusable helpers                                    |
| Types         | `lib/types/`      | Interfaces, type aliases, enums                           |
| Constants     | `lib/constants/`  | Static values                                             |
| Scripts       | `lib/scripts/`    | Automation/ops only — not runtime logic                   |
| Shared        | `lib/`            | Root namespace for setup and shared modules               |

### Required Data Flow

```
Component → Hook → Service → External / API
```

No layer may bypass this chain.

---

## Non-Negotiable Rules

- **Single responsibility** — one clear purpose per file, always.
- **No API calls** in `components/` or `app/`.
- **Components and routes** must not import directly from `lib/services/`.
- **Services** must not import React, Next.js routing, components, or hooks.
- **`.tsx` files** must not declare interfaces or type aliases.
- **No inline definitions** — do not define constants, types, or utilities inside feature `.tsx` files.
- **No circular imports** or cross-layer leakage.

---

## DRY Principles

Adhere to DRY (Don't Repeat Yourself) at all times. Before creating a new utility, hook, type,
or constant, verify one does not already exist.

---

## File Size & Modularity

- Application source files should generally stay **under 250 lines**.
- When a file grows beyond this limit, split it by concern: logic, UI, types, hooks, utilities.
- **Justified exception:** files with strong internal cohesion where splitting would harm readability.
- **Excluded from this rule:** generated files, config files, framework boilerplate, lockfiles,
  build artifacts, `node_modules`, `.next`, generated SDKs, migration snapshots, and package manifests.

---

## UI Design Workflow *(Impeccable)*

This project uses [Impeccable](https://impeccable.style/docs/) as its design system layer.
Two files define the design context and must be read before any UI work:

| File | Purpose |
| ------------ | ----------------------------------------------- |
| `PRODUCT.md` | Product context — users, goals, tone, anti-patterns |
| `DESIGN.md`  | Visual system — colors, typography, spacing, components, do's and don'ts |

### Trigger

Apply this workflow automatically whenever a task involves any of the following:

> creating a page or screen · modifying a UI component · building a form or dashboard ·
> redesigning a layout · any task mentioning UI, page, screen, form, flow, or component

### Required Sequence

Every UI task must follow this loop in order. Do not skip phases.

```
shape → craft → critique → polish
```

| Phase       | What to do                                                                                          |
| ----------- | --------------------------------------------------------------------------------------------------- |
| **shape**   | Define UX first — screens, user flow, layout structure, hierarchy. No code yet.                    |
| **craft**   | Implement the UI. Follow `DESIGN.md` strictly. Produce clean, modular component structure.          |
| **critique**| Review the result — hierarchy, spacing, alignment, accessibility, consistency with `PRODUCT.md`.    |
| **polish**  | Finalize to production quality — reduce visual noise, tighten typography, enforce design system.    |

### Rules

- Always read `PRODUCT.md` before any design decision.
- Always enforce `DESIGN.md` constraints during implementation.
- Never skip **shape** when creating a new screen or feature.
- Never mark UI work complete without running **critique** and **polish**.
- When something looks off but is hard to describe, generate 2–3 visual variants and select the strongest.

### Specialized Passes *(use when relevant)*

| Pass             | When to apply                                               |
| ---------------- | ----------------------------------------------------------- |
| **typeset**      | Typography feels inconsistent — font scale, hierarchy, line heights |
| **layout**       | Spacing or alignment feels off — rhythm, grouping, structure |
| **colorize**     | Color usage is inconsistent or lacks contrast strategy      |
| **audit**        | Before shipping — accessibility, performance, quality check |

---

## Quality Gates

**All checks must pass before marking a task complete.**

```bash
npm run lint
npm run type-check
npm run check:architecture
npm run verify
npx react-doctor@latest
```

[React Doctor](https://www.react.doctor/) performs deterministic static analysis across state & effects,
performance, architecture, security, and accessibility — and produces a health score for the codebase.
The score must not regress. Fix all flagged issues before closing a task.

Any violation is treated as a **failing change request** and must be resolved before merge.
Do not skip, suppress, or work around these checks.