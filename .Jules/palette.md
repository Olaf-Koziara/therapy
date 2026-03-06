## 2026-03-06 - Semantic buttons for interactive elements
**Learning:** Replaced non-semantic `<div>` tags that used `onClick` handlers with standard `<button type="button">` elements in CalendarWeekView and AppointmentDetailsDialog to improve keyboard navigation and screen reader accessibility, adding missing focus-visible outlines.
**Action:** Always prefer semantic HTML buttons with proper focus styles instead of div with click handlers.
