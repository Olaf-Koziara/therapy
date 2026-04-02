## 2024-04-02 - Semantic Buttons for Interactive View Elements
**Learning:** Using `<div>` with `onClick` for interactive elements like calendar slots makes them inaccessible to keyboard users and screen readers. They cannot be tabbed to or activated with Enter/Space.
**Action:** Always use semantic `<button type="button">` tags for interactive custom view elements and apply proper focus styling (e.g., `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`) to ensure full keyboard accessibility.
