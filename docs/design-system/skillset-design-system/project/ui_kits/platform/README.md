# Platform Shell — Skillset

A single shell that supports the three logged-in surfaces Skillset ships: **Learn** (student), **Teach** (teacher studio), and **Ops** (trust operations).

## Files
- `index.html` — interactive prototype. Use the Workspace switcher in the sidebar to move between learner, educator, and trust ops views.
- `styles.css` — shell-specific styles (sidebar, topbar, page header, panels, course rows, pipeline rows, queue rows, status chips).
- `Platform.jsx` — components exported globally:
  - `Sidebar`, `Topbar`, `StudentPage`, `TeacherPage`, `OpsPage`

## Highlights modeled from the codebase
- Letter-cipher nav items (`<span class="ck">`) — the navy 28×28 rounded square with white initials lifted from `Header.tsx`.
- Eyebrow + display-serif headline pairing throughout (`Cormorant Garamond` + `Manrope`).
- Status chips reuse the four semantic colors defined in `colors_and_type.css`.
- "Skillset review note" panels echo the SkillsetReviewNote component pattern in `src/app/page.tsx`.

## Coverage caveats
The shell focuses on dashboard-style screens (classroom, studio overview, ops queue). Course builder, lesson player, and community threads are intentionally stubs — those interactions deserve their own kit pass.
