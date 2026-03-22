## 2024-03-22 - [Keyboard Navigation in Custom Components]
**Learning:** Custom interactive elements (like custom calendar slots or toggle switches) built using `<div>` severely impact keyboard accessibility and screen reader flow because they don't natively receive focus or have implicit roles.
**Action:** Always use semantic `<button type="button">` for custom interactive view elements to ensure they are focusable, fire click events on Enter/Space, and support `focus-visible` styling for clear keyboard navigation indicators.
