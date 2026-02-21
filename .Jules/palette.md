## 2026-02-21 - Playwright Placeholder Ambiguity
**Learning:** Playwright's `get_by_placeholder("Text")` performs a partial match by default, which can cause strict mode violations if one placeholder is a substring of another (e.g., "Jan" vs "jan.kowalski@example.com").
**Action:** Use `get_by_placeholder("Text", exact=True)` when verifying short placeholders that might appear within longer strings.

## 2026-02-21 - Label Association
**Learning:** shadcn/ui `Label` components do not automatically associate with sibling `Input` components. This breaks screen reader support and click-to-focus behavior.
**Action:** Always manually add `htmlFor` to `Label` and `id` to `Input` when using them as siblings.
