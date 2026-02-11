## 2025-02-18 - [Manual Form Accessibility]
**Learning:** Forms managed manually with local state require explicit `id` and `htmlFor` attributes on `Input` and `Label` components to ensure accessibility, as they are not automatically handled as in `react-hook-form` implementations.
**Action:** When creating forms without `react-hook-form`, always verify that `Label` components are correctly associated with inputs via `htmlFor` and `id` to ensure screen reader support and hit-area usability.
