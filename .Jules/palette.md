## 2024-05-24 - Interactive Elements

**Learning:** When creating custom interactive elements like appointment slots in a calendar grid, using `<div>` with `onClick` handlers fails to provide keyboard accessibility and semantic meaning.

**Action:** Always replace interactive `<div>` elements with `<button type="button">`. Ensure they have visual layout parity using classes like `w-full text-left` and add explicit keyboard focus indicators via Tailwind's `focus-visible` ring utilities (e.g., `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1`).