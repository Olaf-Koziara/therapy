## 2024-04-27 - Refactoring custom div toggles to semantic buttons
**Learning:** Using `role="switch"` combined with `aria-checked` on a `<button type="button">` effectively communicates precise binary state to screen readers, unlike custom `<div>` onClick handlers. Additionally, explicit `focus-visible` styles are essential for keyboard navigation visibility.
**Action:** Always replace interactive `<div onClick={...}>` elements with semantic `<button>` tags and proper ARIA states when encountering them in the UI.
