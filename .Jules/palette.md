## 2024-05-18 - Semantic Buttons for Interactive Elements
**Learning:** Found a pattern of using `<div>` elements with `onClick` handlers for interactive custom UI components like calendar slots and payment toggles. This prevents keyboard focus and screen reader activation.
**Action:** Always use semantic `<button type="button">` for interactive custom components, combined with `w-full text-left` to match previous block-level styling, and ensure `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring` is applied for clear keyboard focus indicators.
