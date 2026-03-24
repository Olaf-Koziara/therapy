## 2024-05-15 - [Add Patient Form Accessibility]
**Learning:** When using shadcn/ui `Label` and `Input` components as siblings, they do not automatically associate for screen readers or click-to-focus behavior. Explicit `htmlFor` on the Label and `id` on the Input are required to ensure accessibility.
**Action:** Always explicitly link sibling Label and Input components with `htmlFor` and `id` attributes in forms.
