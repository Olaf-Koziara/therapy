## 2024-05-23 - Manual Form Accessibility
**Learning:** The `components/ui/form` (react-hook-form) handles accessibility automatically, but manual forms using `Input` and `Label` directly (like in `AddPatientDialog`) lack the `id` and `htmlFor` association, leading to inaccessible forms.
**Action:** When creating or modifying manual forms, explicitly add `id` to `Input` and `htmlFor` to `Label` to ensure screen reader support and proper focus behavior.
