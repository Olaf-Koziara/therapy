## 2024-04-13 - [Refactoring clickable div to button]
**Learning:** Found several `div` elements with `onClick` events instead of proper `button` or `role='button'` with keyboard interactions. This is a common accessibility anti-pattern.
**Action:** Replace interactive `div` elements with semantic `button` tags (with type='button') for built-in keyboard support and ARIA states.
