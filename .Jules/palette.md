## 2024-03-03 - [Initialization]

## 2024-03-03 - [Fix Non-Semantic Interactive Elements for Keyboard a11y]
**Learning:** Found interactive custom view elements (calendar slots, status toggles) implemented as `<div>` elements with `onClick` handlers. This pattern creates serious accessibility issues because screen readers and keyboard users cannot easily interact with them. Next.js/React standard components like shadcn/ui work well, but custom complex views often revert to `div` clicking.
**Action:** Always verify that elements with `onClick` are semantic `<button>` tags with `type="button"`. Apply appropriate focus styling (e.g., `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1`) to provide clear keyboard focus indicators, and ensure layout classes like `w-full text-left` are added to prevent buttons from collapsing or center-aligning text unintentionally.
