## Palette's Journal

## 2026-02-14 - [Manual Form Accessibility Pattern]
**Learning:** The project uses manual state management for forms (using `useState`) instead of `react-hook-form` in several dialogs (e.g., `AddPatientDialog`). This approach requires manual assignment of `id` to inputs and `htmlFor` to labels to ensure screen readers correctly associate labels with inputs. Shadcn/UI components do not automatically handle this linkage without `react-hook-form`.
**Action:** When creating or modifying forms in this codebase, always manually assign unique `id`s to inputs and corresponding `htmlFor` attributes to labels, and verify with a screen reader or accessibility audit tool.
