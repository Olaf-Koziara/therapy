## 2025-02-14 - Shadcn/Radix Label Accessibility
**Learning:** The `Label` component from `shadcn/ui` (wrapping Radix `Label`) does not automatically associate with adjacent `Input` components unless `htmlFor` and `id` are explicitly provided. This breaks screen reader support and click-to-focus behavior if omitted.
**Action:** Always ensure `htmlFor` on `Label` matches `id` on `Input` when using them as siblings.
