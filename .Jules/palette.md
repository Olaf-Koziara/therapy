# Palette's Journal - Critical Learnings Only

## 2026-02-25 - [Accessibility] Form Labels and Error Messages
**Learning:** Using `Label` and `Input` components as siblings requires explicit `htmlFor` and `id` attributes to be accessible. Also, form error messages must use `role='alert'` to be announced by screen readers.
**Action:** Always link labels to inputs explicitly when not nesting. Use `role='alert'` for dynamic error messages.
