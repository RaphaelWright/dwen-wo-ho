---
status: Completed
last_updated: 2026-06-30
name: Patient Onboarding Nega Feedback v1
supersedes: plan/feature-patient-onboarding-spec-2.md
---

# Patient Onboarding — Nega Feedback Alignment (v1)

Visual and UX alignment with Nega's HTML mockup feedback for `/patient/join`.

## Summary

- **Choice screen** before contact (phone/email cards only)
- **Huge in-box inputs** with GHANA / PHONE NUMBER labels, validation colors, arrow submit
- **Policy bottom sheets** (~88vh, expand on scroll, dual close) for Canada/US and Terms
- **40/60 split** with dark ink right panel (`#16151a`) and centered step content
- **Footer** from profile photo: Profile → Campus → Class
- **School picker modal** with logos, nicknames, Locked In stats; auto-advance to programme
- **Programme search** with tag chips (mock `durationYears`)
- **Grade identity pills** filtered by programme duration; class-of result pill
- **Instagram-style finish modal** with profile preview

## Key files

- Constants: `src/lib/constants/components/patient/onboarding.ts`
- Choice: `src/components/patient/onboarding/steps/choice-step/`
- Contact + field box: `src/components/patient/onboarding/steps/contact-step/`, `onboarding-field-box/`
- Policy sheets: `src/components/patient/onboarding/overlays/policy-sheet/`
- School picker: `src/components/patient/onboarding/overlays/school-picker/`
- Programme / grade steps: `src/components/patient/onboarding/steps/programme-step/`, `grade-step/`
- Finish modal: `src/components/patient/onboarding/overlays/home-profile-modal/`
- Shell: `src/components/patient/onboarding/shell/index.tsx`

## QA matrix

| Test             | Expected                                                              |
| ---------------- | --------------------------------------------------------------------- |
| Choice → contact | Two cards only; phone selection shows phone screen                    |
| Canada/US link   | Bottom sheet ~88vh; scroll expands; both close buttons work           |
| Terms link       | Separate sheet; no second outside-Ghana CTA line                      |
| School modal     | Search, HS/College filter, Locked In count, auto-advance to programme |
| Programme        | Search by name/tag; selection enables grade                           |
| Grade            | College/HS titles; identity pills; class-of result pill               |
| Footer           | Profile / Campus / Class on correct screens from profile photo onward |
| Referral         | `?ref=` updates pill; 40/60 desktop split                             |
