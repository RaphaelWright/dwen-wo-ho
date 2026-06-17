# Creative Studios API Wiring (Follow-up)

**Status:** Planned  
**Depends on:** `feature-creative-studios-routes` (UI-only v1)

## Goal

Wire Creative Studios create flows to real curator APIs while preserving the ported reference UI.

## Scope

| Flow      | Target service                                                                 |
| --------- | ------------------------------------------------------------------------------ |
| Campus    | `useSchoolsQuery().createSchool` via adapted `useSchoolCreation` field mapping |
| Provider  | TBD curator provider create endpoint                                           |
| Programme | New API when available                                                         |
| Tag       | New API when available                                                         |

## Notes

- Map reference campus fields (`nicks[]`, `loc`) to `ICreateSchool` (`nickname`, `campuses`).
- Replace `useCreativeStudiosMockStore` duplicate checks with server validation where possible.
- Keep mock store only for programme/tag until backend exists.
