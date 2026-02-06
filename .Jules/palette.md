# Palette's Journal

## 2024-05-22 - [Interactive Custom Views]
**Learning:** Interactive elements in custom views (like calendar slots) often default to `div`s with onClick, which excludes keyboard users.
**Action:** Always use `<button>` for clickable elements, even in complex custom layouts, and ensure they have `type="button"` and visual focus states.
