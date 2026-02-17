## 2025-02-17 - Manual Forms & Accessibility
**Learning:** Manual form state management (using local `useState` instead of `react-hook-form` + `zod`) often leads to missing accessibility attributes like `id` and `htmlFor` on inputs/labels, as developers focus on value binding. This was observed in `AddPatientDialog`.
**Action:** Always verify `id` and `htmlFor` pairings when encountering manual form implementations, and consider adding `autoComplete` attributes for better UX on standard fields.
