## 2026-03-26 - Form Error Accessibility
**Learning:** React form errors rendered conditionally often lack ARIA roles, making them invisible to screen readers when they appear dynamically.
**Action:** Always add `role="alert"` to conditionally rendered error message elements (e.g., `<div role="alert" className="text-red-500">`) to ensure they are immediately announced.
