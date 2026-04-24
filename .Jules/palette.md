
## 2025-05-18 - Accessible Toggle Switches
**Learning:** When creating custom toggle switches (like payment status), replacing `div` with `button` and adding `role="switch"` + `aria-checked={boolean}` perfectly conveys the binary state to screen readers. Adding an overall `aria-label` and `aria-hidden="true"` to child nodes cleans up the spoken output.
**Action:** Always use `<button role="switch" aria-checked={state}>` instead of `<div onClick={toggle}>` for custom toggle controls, ensuring focus styles and disabled states are included.
