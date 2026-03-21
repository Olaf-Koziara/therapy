
## 2024-03-21 - [Explicit Label-Input Associations for shadcn/ui]
**Learning:** When using shadcn/ui or Radix UI components, custom `<Label>` and `<Input>` elements are often rendered as siblings rather than nested. Omitting explicit `htmlFor` (on the Label) and `id` (on the Input) breaks screen reader announcements and click-to-focus behavior. Additionally, form validation and submission error messages should use `role="alert"` for immediate screen reader announcement.
**Action:** Always map the `id` of an `<Input>` to the `htmlFor` attribute of its corresponding `<Label>` in forms, and apply `role="alert"` to dynamically rendered error states.
