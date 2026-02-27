## 2025-02-23 - [Interactive Calendar Slots]
**Learning:** Calendar slots implemented as `div`s with `onClick` are inaccessible to keyboard users and screen readers. Status conveyed only by color excludes colorblind users.
**Action:** Always use `<button type="button">` for interactive elements. Include full status details (time, patient, payment, appointment status) in `aria-label`. Use text labels or icons in addition to color for status.
