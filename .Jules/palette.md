## 2023-10-25 - Form Accessibility in shadcn/ui

**Learning:** When using `shadcn/ui` `Label` and `Input` components as siblings, they require explicit `htmlFor` on the `Label` and `id` on the `Input` to properly associate for screen readers and enable click-to-focus behavior. Form error messages must have `role="alert"` so they are read out immediately to screen reader users.

**Action:** Always add explicit `htmlFor`/`id` mappings when building forms with sibling `Label`/`Input` components, and use `role="alert"` for form error rendering.
