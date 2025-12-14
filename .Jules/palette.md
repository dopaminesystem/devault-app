## 2024-05-22 - Interactive Cards and Hover Actions
**Learning:** Found a pattern of using `div` elements with `onClick` for interactive cards (like "Create Vault"). This breaks keyboard accessibility.
**Action:** Convert these to `<button>` elements with `w-full` and `text-left` (or appropriate flex alignment) to maintain layout while gaining native accessibility.

**Learning:** Sidebar actions were hidden with `opacity-0` until hover. This makes them inaccessible to keyboard users.
**Action:** Always add `focus-visible:opacity-100` when using opacity transitions for disclosure actions to ensure keyboard users can find them.
