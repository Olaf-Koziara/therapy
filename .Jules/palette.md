## 2024-04-03 - [Initialization]

## 2024-04-03 - [Label Accessibility and Error Roles]
**Learning:** `shadcn/ui` `Label` components (which wrap Radix UI `Label`) used as siblings to `Input` components must have explicit `htmlFor` attributes matching the Input's `id`. This is required for screen reader accessibility and to enable click-to-focus behavior. Additionally, dynamic form error messages should use `role="alert"` so they are immediately announced by screen readers when they appear.
**Action:** Always include `id` and `htmlFor` pairings when building forms with decoupled Label and Input components, and ensure error messages utilize `role="alert"`.