
## 2024-05-20 - Use semantic buttons for calendar slots
**Learning:** Interactive custom view elements like calendar slots, which perform actions when clicked, were implemented as `div` elements with `onClick` handlers. This caused them to be inaccessible via keyboard navigation.
**Action:** Replaced `<div>` with `<button type="button">`, adding `w-full text-left` to preserve layout, and included `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring` classes for clear keyboard focus indicators.
