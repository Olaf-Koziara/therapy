## 2024-05-24 - Semantic Toggle Buttons
**Learning:** Custom toggle controls implemented as interactive `<div>` elements are completely ignored by screen readers in their interactive context and are inaccessible via keyboard navigation (tabbing).
**Action:** Always use `<button type="button" role="switch" aria-checked={boolean}>` for binary status toggles (like payment status), add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring` for keyboard visibility, and use `aria-hidden="true"` on inner decorative elements (like colored status dots).
