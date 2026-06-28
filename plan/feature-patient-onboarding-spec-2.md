---
status: Completed
last_updated: 2026-06-28
name: Patient Onboarding Spec v2
supersedes: plan/feature-patient-onboarding-ui-1.md
---

# Patient Lock-In Onboarding — Spec v2

Implementation complete. See `.cursor/plans/patient_onboarding_spec_v2_f43170ef.plan.md` for the full specification.

## Summary

Replaced the 4-step linear wizard at `/patient/join` with the full two-phase flow:

- **Auth phase:** choice → phone/email → create account OR sign-in → verify (auto-advance at 6 digits) → profile photo
- **Onboarding phase:** school type → school picker modal → programme → grade → finish

## Key files

- Wizard: `src/hooks/components/patient/onboarding/wizard/`
- Workspace: `src/components/patient/onboarding/workspace/`
- Steps: `src/components/patient/onboarding/steps/`
- Overlays: `src/components/patient/onboarding/overlays/`
- Service: `src/services/patient/onboarding/account-registry.ts`

## QA status (2026-06-28)

- `npm run lint` — pass
- `npx tsc --noEmit` — pass
- `pnpm conventions:audit` — pass (workspace folder mixed-directory note pre-existing pattern)
- `npx react-doctor@latest .` — score 70
- `pnpm fallow:audit` — **33 new complexity findings** in changed files (state-machine surface area); follow-up may model wizard orchestration in `.fallowrc.json` or split `create-account-step` further
