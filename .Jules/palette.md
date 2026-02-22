
## 2025-02-17 - Add Patient Dialog Accessibility
**Learning:** Shadcn `Label` components require explicit `htmlFor` attributes pointing to the `Input` `id` when they are siblings (not nested) to ensure proper screen reader accessibility and click-to-focus behavior.
**Action:** Always add `id` to `Input` and `htmlFor` to `Label` in forms using Shadcn components.
