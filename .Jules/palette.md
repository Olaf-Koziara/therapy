## 2024-05-23 - Interactive Elements Semantics
**Learning:** Interactive custom view elements (e.g., calendar slots) must use semantic `<button>` tags instead of `<div>` with onClick handlers to ensure keyboard accessibility.
**Action:** Use `<button type="button">` for interactive elements and add `aria-label` for context.
