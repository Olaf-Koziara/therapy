## 2026-02-23 - Accessibility of Shadcn Labels
**Learning:** Shadcn UI `Label` components (wrapping Radix UI `Label`) do not automatically associate with sibling inputs. Explicit `htmlFor` on the label and matching `id` on the input are required for screen reader support and click-to-focus behavior.
**Action:** Always verify `htmlFor` and `id` attributes when using `Label` and `Input` as siblings in forms.
