## 2024-05-18 - Interactive Custom View Elements (Calendar Slots)

**Learning:** Interactive custom view elements, such as clickable calendar slots, were built using `<div>` tags with `onClick` handlers. This approach negatively impacts keyboard accessibility as `<div>` elements are not naturally focusable via the `Tab` key and lack built-in focus styling.

**Action:** Consistently replace `<div>` with semantic tags like `<button type="button">` for custom interactive view elements to ensure keyboard accessibility. Also apply proper focus styles such as `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1` so users relying on keyboard navigation receive clear visual feedback.
