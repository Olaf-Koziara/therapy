## 2025-02-18 - [Manual Form Accessibility]
**Learning:** Forms managed manually with local state require explicit `id` and `htmlFor` attributes on `Input` and `Label` components to ensure accessibility, as they are not automatically handled as in `react-hook-form` implementations.
**Action:** When creating or modifying forms without `react-hook-form` context, always manually assign unique IDs to inputs and corresponding `htmlFor` attributes to labels.
