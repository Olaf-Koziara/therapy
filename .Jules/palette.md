## 2024-05-24 - Manual Form Accessibility
**Learning:** Manual form implementations (like in `AddPatientDialog`) often miss `id` and `htmlFor` attributes on inputs and labels, unlike library-managed forms. This breaks screen reader associations and click-to-focus behavior.
**Action:** When auditing or implementing manual forms, explicitly verify `id` and `htmlFor` attributes are present and linked.
