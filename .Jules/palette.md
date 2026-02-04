## 2026-02-04 - Semantic Calendar Events
**Learning:** Custom calendar views often default to using `div` elements for events with only `onClick` handlers. This completely excludes keyboard users from accessing appointment details or actions.
**Action:** Always wrap interactive calendar slots in `<button>` elements (or `role="button"` with `tabIndex` and key handlers) to ensure they are focusable and actionable via keyboard.
