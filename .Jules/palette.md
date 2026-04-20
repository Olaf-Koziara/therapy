## 2026-04-20 - Interactive Divs to Semantic Buttons
**Learning:** Interactive `<div>` elements used as toggles (e.g. for payment status) lack keyboard accessibility and semantic meaning for screen readers.
**Action:** Replaced interactive `<div>` with a semantic `<button type="button" role="switch" aria-checked={boolean}>` and added `aria-label` alongside `aria-hidden="true"` on children. Added `focus-visible` classes to ensure clear keyboard focus indicators.
