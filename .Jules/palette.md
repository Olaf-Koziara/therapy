## 2026-03-10 - Accessibility Improvements in Patient Form
**Learning:** shadcn/ui Label/Input pairs require explicit sibling association (`htmlFor` and `id`) for screen readers and click-to-focus behavior, as they are not nested. Additionally, form error messages require `role="alert"` to be announced immediately.
**Action:** Always verify that every `Label` component has a corresponding `htmlFor` attribute matching the `id` of its sibling input, and ensure dynamic error text is wrapped with `role="alert"`.
