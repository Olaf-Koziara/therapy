## 2024-05-22 - Form Accessibility Pattern
**Learning:** Shadcn/ui `Label` components do not automatically associate with sibling `Input` components. They require explicit `htmlFor` and `id` attributes when used outside of a `Form` wrapper (e.g., in manual state forms).
**Action:** Always verify label-input association using screen reader tests or Playwright's `getByLabel` when building custom forms without `react-hook-form` wrappers.
