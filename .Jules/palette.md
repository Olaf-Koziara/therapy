## 2025-05-22 - [Manual Form Accessibility]
**Learning:** Manual forms using separate `Label` and `Input` components from shadcn/ui do not automatically associate for accessibility purposes, unlike `react-hook-form` wrappers. This leaves screen reader users without context for inputs.
**Action:** Always explicitly add `htmlFor` to `Label` and matching `id` to `Input` when building manual forms, and include `autoComplete` attributes for better UX.
