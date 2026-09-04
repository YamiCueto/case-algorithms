## Summary

Closes #33

This PR expands the useful vertical height of the Dual Stage in CASE Algorithms without introducing rigid pixel lock-ins or layout breakage:
- **Playground Height Expansion**: The interactive visual canvas expands comfortably on desktop viewports (`min-height: clamp(380px, 44vh, 520px)`), giving ample room for multi-element pointer chains, circular buffers, stack frames, and array comparison badges.
- **Maximized CodeViewer Visibility**: Expanded `.code-viewer-scroll-box` to `max-height: 420px`, allowing complete algorithmic routines (15–18 lines like Bubble Sort, push/pop, enqueue/dequeue, prepend/append) to be **100% visible at once with ZERO initial scroll**, while bounded safely for longer class definitions.
- **Synchronized Active Line Auto-Scroll & Highlighting**: Preserved full Step-to-Code synchronization with smooth auto-scroll when active execution steps navigate through long algorithms.
- **Pure CSS Architecture**: Zero inline styles (`style={{}}`), zero comments, and zero core changes (`src/core/` remains 100% untouched).

## Responsive Design Behavior
- **Desktop ($1440\times 900$)**: Dual Stage side-by-side split (~55% visual / 45% code) taking full advantage of vertical space with Time Travel controls immediately accessible below without requiring vertical page scroll.
- **Laptop ($1280\times 720$)**: Balanced dual split fitting full algorithm implementations and spacious visual canvas.
- **Tablet ($768\times 1024$)**: Seamless vertical stack maintaining high legibility and touch ergonomics.
- **Mobile ($390\times 844$)**: Single-column vertical flow with zero horizontal overflow and comfortable viewing.

## Verification Checklist
- [x] `npm run typecheck` (0 errors)
- [x] `npm run lint` (0 warnings)
- [x] `npm run test:run` (196/196 tests passing across 22 suites)
- [x] `npm run build` (Clean production bundle)
- [x] Zero comments verified
- [x] Zero inline styles verified
- [x] Playwright visual audit across 4 viewports in Chromium real with 0 errors
