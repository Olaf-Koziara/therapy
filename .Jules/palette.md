## 2024-04-26 - Accessible Payment Toggle
**Learning:** When implementing binary state toggles (like "Paid" / "Unpaid"), a generic `role="button"` or an interactive `div` does not fully communicate the toggle nature. Screen readers prefer `role="switch"` combined with `aria-checked={boolean}` to read out the state clearly.
**Action:** Use semantic `<button type="button" role="switch" aria-checked={state}>` for binary status toggles and hide decorative status indicators (like colored dots) using `aria-hidden="true"`.
