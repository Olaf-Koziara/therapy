## 2024-05-22 - [Form Accessibility Pattern]
**Learning:** `shadcn/ui` Label components do not automatically associate with sibling Input components. Explicit `htmlFor` on Label and matching `id` on Input are required for screen reader accessibility and click-to-focus behavior.
**Action:** Always add `htmlFor` and `id` props when using Label and Input pairs.
