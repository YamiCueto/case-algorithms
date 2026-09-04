## Summary

This pull request implements the visual and code split redesign for all laboratories across CASE Algorithms, directly addressing and fulfilling **Issue #29**.

### Key Changes
1. **LabShell Dual Stage Layout**:
   - Introduced `.lab-stage-grid` with desktop proportions (~56% visualization, ~44% code stage).
   - Added declarative slots: `visualizationSlot`, `codeSlot`, `timeTravelSlot`, `controlsSlot`, `inspectorSlot`, `knowledgeSlot` (with backward compatibility fallback for `viewportSlot`).
2. **Prominent Full-Width Time-Travel Bar**:
   - Relocated `<TimeTravelControls />` to a dedicated horizontal `.time-travel-panel` situated immediately below the dual stage.
3. **Harmonized 4 Laboratories**:
   - Migrated `ArrayLab`, `StackLab`, `QueueLab`, and `LinkedListLab` to provide simultaneous side-by-side visualization and real-time highlighted `CodeViewer` (with dynamic Pseudocode and TypeScript toggles).
   - Separated operation controls and state inspection into a balanced secondary row (`.lab-controls-grid`).
   - Placed the 10-phase pedagogical knowledge panel cleanly underneath.
4. **Responsive Layout Support**:
   - Maintained fluid grid wrapping for Desktop (1440x900), Laptop (1280x720), Tablet (768x1024), and Mobile (390x844).
5. **Architectural Integrity**:
   - `src/core/` remains 100% untouched.
   - Zero comments (`//`, `/* */`) in `src/`.
   - Zero inline styles (`style={{`).
   - Vitest suite (191 tests) passing at 100%.

Closes #29
