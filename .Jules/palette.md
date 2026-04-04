## 2025-04-04 - Accessible Interactive View Elements
**Learning:** Interactive custom view elements (e.g., calendar slots, custom toggles) built with `<div>` and `onClick` handlers are completely inaccessible to keyboard users, violating basic a11y principles.
**Action:** Always use semantic `<button type="button">` tags for these elements and include explicit focus styles (e.g., `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`) to ensure they are keyboard navigable and present clear focus indicators.
