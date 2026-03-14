## 2024-03-14 - shadcn/ui Label/Input Sibling Pattern
**Learning:** When using shadcn/ui `Label` and `Input` components as siblings rather than nesting the input inside the label, explicit `htmlFor` and `id` attributes are strictly required. Without them, screen readers cannot properly associate the input with its label, and clicking the label text will not focus the input.
**Action:** Always verify that every independent `Label` component has an `htmlFor` matching the `id` of its corresponding `Input`.
