## 2026-02-05 - [Inconsistent Form Accessibility]
**Learning:** Found that while `react-hook-form` components in this app automatically handle accessibility (IDs, labels), manual forms using raw `Input`/`Label` often miss these associations, creating accessibility gaps.
**Action:** When seeing manual forms, check for `id` and `htmlFor` pairings. Prefer `Form` components where possible, or strictly enforce manual association.
