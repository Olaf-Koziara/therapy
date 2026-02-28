## 2024-03-05 - Missing Label and Input Association in Forms
**Learning:** When using `shadcn/ui` `Label` and `Input` as sibling components, explicit `htmlFor` and `id` attributes are strictly required for accessibility. Sibling layouts do not implicitly associate elements like nested labels do, leaving inputs without accessible names for screen readers and disabling click-to-focus behavior.
**Action:** Always verify that every `Label` uses `htmlFor` matching the corresponding `Input`'s `id` when dealing with shadcn/ui form elements that are not nested.
