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

## Architecture Contract _(Mandatory)_

This repository enforces a **strict layered architecture**. Every contribution — human or agent —
must comply with the rules below. No exceptions.

### Layer Ownership

| Layer          | Path             | Responsibility                                        |
| -------------- | ---------------- | ----------------------------------------------------- |
| Routes         | `app/`           | Route composition only                                |
| Presentation   | `components/`    | UI rendering only (except `components/ui` primitives) |
| Orchestration  | `hooks/`         | React state/effects; calls services                   |
| Business Logic | `lib/services/`  | Business logic and API/data access                    |
| Utilities      | `lib/utils/`     | Pure, reusable helpers                                |
| Types          | `lib/types/`     | Interfaces, type aliases, enums                       |
| Constants      | `lib/constants/` | Static values                                         |
| Scripts        | `lib/scripts/`   | Automation/ops only — not runtime logic               |
| Shared         | `lib/`           | Root namespace for setup and shared modules           |

### Required Data Flow

```
Component → Hook → Service → External / API
```

No layer may bypass this chain.

### File Placement

| What                    | Where                                                 |
| ----------------------- | ----------------------------------------------------- |
| Subcomponent prop types | `lib/types/components/<feature>/`                     |
| UI-specific hooks       | `hooks/components/<area>/`                            |
| Presentational splits   | `components/<feature>/<part>.tsx`                     |
| shadcn `cva` variants   | `components/ui/*-variants.ts` (non-component exports) |
| Shared a11y helpers     | `lib/utils/a11y.ts`                                   |

---

## Auth & Navigation _(Client)_

Auth tokens live in **`localStorage`**, not httpOnly cookies. This is an intentional constraint until a future cookie-based auth migration.

- **Mount-time guards** in hooks that read `localStorage` or URL search params and call `router.replace()` / `router.push()` are expected (e.g. signup guards, curator layout, password-reset prerequisites). Do not relocate these to middleware or server redirects without migrating auth storage first — server code cannot read `localStorage`.
- **Post-action navigation** (login success, form submit) belongs in **handlers** (`onSuccess`, `onSubmit`), not `useEffect`.
- **Do not module-cache** token reads (`getUserType`, `hasValidToken`, etc.). Tokens mutate at runtime; caching causes stale-auth bugs.

When a guard must stay client-side, add a one-line comment explaining why.

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
- **Route pages (`app/`):** compose hooks + feature components only. Splitting route files is behavior-sensitive — requires manual QA of the live flow.
- **Modals / wizards:** one folder per feature (`components/modals/add-icon/`), step subcomponents, prop types in `lib/types/components/modals/`.
- **Heavy UI logic:** extract to `hooks/components/...`; keep `.tsx` presentational.
- **No `renderX()` helpers** called in JSX — use `let content: ReactNode` + `switch`, or a keyed child component.
- **shadcn primitives:** colocated subcomponents are acceptable (`input-otp`, `input-group`). Move `cva` variants to sibling `*-variants.ts` so component files export components only.
- **Justified exception:** files with strong internal cohesion where splitting would harm readability.
- **Excluded from this rule:** generated files, config files, framework boilerplate, lockfiles,
  build artifacts, `node_modules`, `.next`, generated SDKs, migration snapshots, and package manifests.

---

## React & Hooks Conventions

Effects are for **subscriptions and browser APIs**. State transitions belong in **handlers** unless the value is genuinely external.

| Situation                | Prefer                                                                                    | Avoid                                     |
| ------------------------ | ----------------------------------------------------------------------------------------- | ----------------------------------------- |
| Prop → state sync        | `<Component key={id} />`, `useMemo`, or prev-prop tracking via **`useRef`** during render | Mirroring props into state in `useEffect` |
| Values that never render | `useRef`                                                                                  | `useState` read only inside effects       |
| Editable list keys       | Stable ids in hook data model (`{ id, value }[]`)                                         | Array index as React `key`                |
| Default props / options  | Module-level constants                                                                    | Inline `{}` / `[]` in parameter defaults  |
| Chained effect updates   | Single handler or ref-based transition tracking                                           | `setA` in effect → re-run → `setB`        |

Functional updates: use `setState((prev) => ...)` when the next value depends on the previous one.

---

## Performance Defaults

- **Motion:** import `m` from `motion/react`, not `motion`. The app is wrapped in `MotionProvider` (`LazyMotion` + `domMax`).
- **Styles:** hoist static `style` objects to module scope. Avoid `transition: all`, long durations, permanent `will-change`, and animating large blurs.
- **Listeners:** use `{ passive: true }` on `touchstart` when not calling `preventDefault`.
- **TanStack Query:** mutations that change server state must call **`invalidateQueries`** in `onSuccess`. Destructure only fields used from query results.
- **Parallel async:** use `Promise.all` for independent awaits. Keep sequential `await` in loops when batching semantics require it — add a brief comment explaining why.

---

## UI Design Workflow _(Impeccable)_

This project uses [Impeccable](https://impeccable.style/docs/) as its design system layer.
Two files define the design context and must be read before any UI work:

| File         | Purpose                                                                  |
| ------------ | ------------------------------------------------------------------------ |
| `PRODUCT.md` | Product context — users, goals, tone, anti-patterns                      |
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

| Phase        | What to do                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------ |
| **shape**    | Define UX first — screens, user flow, layout structure, hierarchy. No code yet.                  |
| **craft**    | Implement the UI. Follow `DESIGN.md` strictly. Produce clean, modular component structure.       |
| **critique** | Review the result — hierarchy, spacing, alignment, accessibility, consistency with `PRODUCT.md`. |
| **polish**   | Finalize to production quality — reduce visual noise, tighten typography, enforce design system. |

### Rules

- Always read `PRODUCT.md` before any design decision.
- Always enforce `DESIGN.md` constraints during implementation.
- Never skip **shape** when creating a new screen or feature.
- Never mark UI work complete without running **critique** and **polish**.
- When something looks off but is hard to describe, generate 2–3 visual variants and select the strongest.

### Specialized Passes _(use when relevant)_

| Pass         | When to apply                                                       |
| ------------ | ------------------------------------------------------------------- |
| **typeset**  | Typography feels inconsistent — font scale, hierarchy, line heights |
| **layout**   | Spacing or alignment feels off — rhythm, grouping, structure        |
| **colorize** | Color usage is inconsistent or lacks contrast strategy              |
| **audit**    | Before shipping — accessibility, performance, quality check         |

### Accessibility

- Prefer native `<button>` / `<a>`. All `<button>` elements need explicit **`type="button"`** unless submitting a form.
- When a wrapper must be clickable and contains other controls (cards, modal backdrops), use **`role="button"`**, `tabIndex={0}`, and **`activateOnKeyboard()`** from `lib/utils/a11y.ts`.
- Status messages: prefer `<output>` over `role="status"`.
- React Doctor may still flag `prefer-tag-over-role` on composite clickable regions — that is an accepted trade-off when a native `<button>` would produce invalid HTML.
- Apply a11y fixes through **critique → polish**, not drive-by `role` additions.

---

## Documented Exceptions

Some React Doctor rules conflict with deliberate architecture. Do **not** "fix" these to chase score — add a **one-line rationale comment** at the site instead.

| Category              | Examples                                                                        | Why kept                                          |
| --------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------- |
| Client auth guards    | `nextjs-no-client-side-redirect` in guard hooks                                 | `localStorage` unreadable server-side             |
| Token reads           | `js-cache-storage` in auth utils                                                | Runtime-mutating tokens; cache = stale auth       |
| shadcn inventory      | `unused-file` on `ui/combobox`, `drawer`, `progress`, `sheet`, `draggable-card` | Kept by design for the design system              |
| Colocated primitives  | `no-multi-comp` in `input-otp`, `input-group`                                   | Upstream shadcn convention                        |
| Concurrent UI flags   | `no-many-boolean-props` on notification sheets, confirmation modals             | Independent async states, not a status union      |
| Dynamic / crop images | `nextjs-no-img-element` with eslint-disable                                     | Interactive editor or dynamic URLs                |
| SSR-unsafe init       | `no-initialize-state` in canvas/DOM-measurement components                      | Cannot lazy-init without `useSyncExternalStore`   |
| Runtime deps          | `unused-dependency` on `sharp`                                                  | Required by Next.js image optimization at runtime |

Revisit exceptions only when the underlying constraint changes (e.g. cookie auth migration).

---

## Quality Gates

**All checks must pass before marking a task complete.**

```bash
npm run lint
npx tsc --noEmit
npx react-doctor@latest
```

[React Doctor](https://www.react.doctor/) performs deterministic static analysis across state & effects,
performance, architecture, security, and accessibility — and produces a health score for the codebase.
The score must **not regress** on changes you touch. Fix new issues and regressions; document deliberate
keeps per **Documented Exceptions** above rather than suppressing or working around rules.

Any violation of lint or type-check is treated as a **failing change request** and must be resolved before merge.
Do not skip hooks (`--no-verify`) unless explicitly requested.
