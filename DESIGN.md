---
name: Dwen Wo Ho
description: Confidential student mental health care — warm, clinical, calm
colors:
  primary: "#955aa4"
  primary-foreground: "#fafafa"
  info: "#2b3990"
  success: "#2bb673"
  warning: "#f59e0b"
  destructive: "#dc2626"
  background: "#ffffff"
  foreground: "#1c1917"
  muted: "#f5f5f4"
  muted-foreground: "#78716c"
  border: "#f3e8ff"
  card: "#ffffff"
  footer-bg: "#202126"
  secondary-accent: "#0d9488"
typography:
  display:
    fontFamily: "Poppins, var(--font-poppins), sans-serif"
    fontSize: "3.75rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Poppins, var(--font-poppins), sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Poppins, var(--font-poppins), sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Geist, var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Geist, var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.625rem"
  xl: "0.875rem"
  full: "9999px"
spacing:
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.full}"
    padding: "0.5rem 1.25rem"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.full}"
    padding: "0.5rem 1.25rem"
  input-default:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "0.25rem 0.625rem"
    height: "2rem"
---

# Design System: Dwen Wo Ho

## Overview

**Creative North Star: "The Trusted Care Room"**

Dwen Wo Ho's visual system should feel like stepping into a private, well-run care space — not a startup landing page, not a hospital ward. Warmth comes from generous whitespace, soft lavender-tinted borders, and rounded pill buttons; clinical credibility comes from restrained color use, clear hierarchy, and semantic state colors that mean something.

The system serves a **product register**: design disappears into task flow for students booking care and providers managing patients. Marketing hero moments exist but borrow the same tokens — no separate "brand mode" palette.

**Key Characteristics:**

- Purple primary used for actions and brand recognition, not atmospheric decoration
- Poppins for headings only; Geist Sans for UI and body
- Pill-shaped primary buttons (`rounded-full`); inputs and cards use modest `rounded-lg`
- Light elevation via `shadow-xs` on interactive elements; tonal layering over heavy shadows
- Semantic green/blue/amber/red for success, info, warning, error — never decorative

## Colors

A restrained healthcare palette anchored by **Care Purple** with institutional blue and growth green as supporting semantics.

### Primary

- **Care Purple** (#955aa4): Primary actions, brand headings, scrollbar accents, focus-adjacent UI. Used at full saturation for CTAs; at `/60` or `/50` opacity for subtle chrome. Avoid gradient washes or full-page purple backgrounds.
- **Primary Foreground** (#fafafa): Text and icons on primary surfaces.

### Secondary & Semantic

- **Institutional Blue** (#2b3990): Info states, sidebar primary accents, links requiring authority without alarm.
- **Growth Green** (#2bb673): Success states, positive confirmation, OTP slot emphasis.
- **Warm Amber** (#f59e0b): Warnings and attention without panic.
- **Alert Red** (#dc2626): Destructive actions and validation errors only.

### Neutral

- **Canvas** (#ffffff / dark #1a171c): Page background.
- **Ink** (#1c1917 / dark #fafafa): Primary text.
- **Stone Muted** (#78716c): Secondary text, placeholders.
- **Lavender Border** (#f3e8ff): Soft dividers — distinctive but calm; avoid harsh gray borders on care flows.
- **Stone Surface** (#f5f5f4): Inputs, secondary buttons, muted panels.

### Tertiary

- **Teal Accent** (#0d9488): Secondary accent for variety without competing with primary purple.
- **Footer Charcoal** (#202126): Marketing footer only; not for in-app chrome.

## Typography

**Display / Headlines / Titles:** Poppins (700 for h1, 600 for section titles). Applied via base layer to `h1`–`h6`. Large marketing headings run `text-6xl` to `text-8xl` with tight tracking.

**Body / Labels / UI:** Geist Sans via `geistSans.className` on body. Base size `text-base` (16px), compact UI at `text-sm` (14px). Line height relaxed for body copy (`leading-relaxed`).

**Mono:** Geist Mono for code or data-dense displays when needed.

Scale ratio ~1.2 between steps. No fluid clamp on product screens — fixed rem sizes for predictable density in dashboards and forms.

## Elevation

Predominantly **flat with tonal layering**. Cards sit on white/stone surfaces differentiated by border (`border-border`) rather than deep shadows. Interactive elements use `shadow-xs` and `shadow-lg shadow-primary/50` sparingly on primary CTAs in marketing contexts.

Dark mode cards use semi-transparent oklch surfaces for depth without heavy drop shadows. No glassmorphism, no layered blur stacks.

Focus rings: `ring-ring/50` with `ring-[3px]` on buttons; inputs use `ring-primary/50` on focus — visible for WCAG AA keyboard users.

## Components

### Buttons

- **Primary:** `rounded-full`, `bg-primary`, `text-primary-foreground`, `shadow-xs`, hover `bg-primary/90`
- **Secondary:** Stone fill, muted foreground text
- **Outline / Ghost:** For tertiary actions; ghost has no default hover fill
- **Destructive:** Red fill, white text, dedicated focus ring
- Sizes: default (`px-5 py-2`), `sm`, `lg`, `icon`

### Inputs

- Height `h-8`, `rounded-lg`, `border-input`, transparent background
- Focus: `border-ring` + `ring-primary/50`
- Invalid: `border-destructive` + destructive ring
- Disabled: `bg-input/50`, reduced opacity

### Cards & Surfaces

- White card on canvas, `rounded-2xl` for marketing imagery containers
- Provider/patient app shells use sidebar tokens (`--sidebar-*`) with blue primary accent

### Navigation

- Standard top nav + mobile sheet patterns
- Footer dark charcoal separate from app chrome

### Motion

- UI transitions: `transition-all` / `transition-colors`, 150–250ms implied
- Marketing: framer-motion entrance animations, blob/gradient utilities — gate behind `prefers-reduced-motion`
- Page transitions via View Transition API (column wipe) — decorative; disable for reduced motion

## Do's and Don'ts

**Do**

- Use Care Purple only for primary actions, active selection, and brand headings
- Keep forms clean: one column on mobile, clear labels, visible error states
- Maintain consistent button shapes across student and provider flows
- Use semantic colors for state (success green, info blue, warning amber, error red)
- Test contrast on purple buttons and lavender borders at AA

**Don't**

- Add purple gradients, glassmorphism, or glow effects "for polish"
- Use display typography in data tables, form labels, or dense dashboards
- Ship decorative blob/gradient animations on clinical task screens
- Mix pill buttons with sharp-corner buttons on the same workflow step
- Default to modal dialogs when inline or progressive disclosure would work
- Use startup hype copy styling (all-caps eyebrows on every section, tracked kickers)
