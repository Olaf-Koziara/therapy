## 2026-03-20 - [Missing Label Associations in Forms]
**Learning:** Shadcn UI `Label` components are sometimes used alongside `Input` components without the explicit `htmlFor` and `id` bindings. While visually appearing as labels, screen readers fail to associate them, and click-to-focus behavior is broken, creating an accessibility barrier.
**Action:** Always verify that `Label` and `Input` pairs in forms use matching `htmlFor` and `id` attributes, especially when implementing new dialogs or forms using the Shadcn UI library.
