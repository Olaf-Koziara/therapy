# Palette's Journal

## 2025-02-18 - [Manual Forms Accessibility Gap]
**Learning:** Manually managed forms (using local state instead of form libraries) often miss basic accessibility attributes like `id` on inputs and `htmlFor` on labels. This prevents label clicking from focusing inputs and hurts screen reader usability.
**Action:** Always audit `Input` and `Label` pairs in custom components to ensure they are properly linked.
