## Problem Statement

Following the successful integration of Shiki syntax highlighting and dual-stage layout, the main interactive laboratory stage (`.lab-stage-grid`) currently has a height ceiling that limits pedagogical immersion:
1. **Playground Height Constraint**: The canvas area (`.svg-viewport-container`, `.svg-viewport`) is constrained in vertical space, making multi-iteration state changes and spacious pointer chains feel vertically compressed.
2. **CodeViewer Internal Scrolling**: `.code-viewer-scroll-box` is constrained by a fixed `max-height: 380px`, requiring internal scrolling after just ~10–12 lines of code even when ample viewport height is available on desktop monitors ($1440\times 900$).
3. **Canvas ↔ Code Co-Visibility**: The user frequently has to scroll vertically inside the code panel while simultaneously trying to observe state transitions on the canvas.

## Architectural & UX Objectives

Expand the useful vertical height of the Dual Stage so that:
1. **Enhanced Stage Height**: The Dual Stage (`.lab-stage-grid`, `.visualization-stage-panel`, `.code-stage-panel`) takes fuller advantage of available vertical viewport height without arbitrary rigid fixed pixel values (e.g. avoiding rigid `height: 900px`).
2. **Fluid Responsive Height Strategy**: Utilize modern CSS techniques (`minmax()`, `clamp()`, `min-height`, `max-height`, viewport height fractions, and CSS grid) to expand naturally on large viewports while gracefully adapting on laptops ($1280\times 720$), tablets ($768\times 1024$), and mobiles ($390\times 844$).
3. **Maximized Code Visibility**: Increase `.code-viewer-scroll-box` height so that substantial portions of algorithm implementations (18–25+ lines) remain visible without immediate internal scrolling.
4. **Preserved Active Line Auto-Scroll & Highlighting**: Ensure `activeLine` auto-scroll and Shiki syntax highlighting remain perfectly synchronized across all 4 laboratories.
5. **No Regressions**: Preserve pure `src/core/` separation, 0 comments, 0 inline styles, and all existing unit/integration tests across Array, Stack, Queue, and Linked List.

## Responsive Design Targets
- **Desktop ($1440\times 900$)**: Substantially taller Dual Stage displaying full algorithm code and expansive visual canvas with Time Travel controls immediately accessible below.
- **Laptop ($1280\times 720$)**: Balanced proportions maintaining Dual Stage side-by-side split without squishing controls.
- **Tablet ($768\times 1024$)**: Clean stacked hierarchy maintaining full readability of canvas and code.
- **Mobile ($390\times 844$)**: Vertical flow with zero horizontal overflow and comfortable touch targets.

## Scope & Constraints
- **NO core modifications** (`src/core/` remains untouched).
- **NO algorithm changes**.
- **NO i18n yet**.
- **NO BaseLab abstractions**.
- **ZERO comments** (`//`, `/* */`) in `src/`.
- **ZERO inline styles** (`style={{}}`).
