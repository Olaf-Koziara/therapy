## 2025-02-28 - Semantic Toggles
**Learning:** Using generic `<div>` elements with `onClick` handlers for toggles ignores semantic meaning, preventing screen readers from understanding their state or purpose.
**Action:** Always replace interactive generic toggle implementations with semantic `<button type="button" role="switch">` and bind `aria-checked` to the boolean state. Additionally, provide `aria-hidden="true"` on decorative state-indicating elements.
