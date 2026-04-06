## 2024-04-06 - [Semantic Buttons for Custom Interactions]
**Learning:** Interactive custom view elements (e.g., calendar slots, custom cards) implemented as `<div>` tags with `onClick` handlers lack native keyboard accessibility (tabbing and Enter/Space activation) and semantic meaning for screen readers.
**Action:** Always refactor interactive custom elements to use semantic `<button type="button">` tags. Apply focus styling (e.g., `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`) to ensure clear keyboard focus indicators.
