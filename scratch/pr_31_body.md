## Summary

Closes #31

This PR delivers **Phase 3 of Sprint 2**: integrating **Shiki** syntax highlighting engine and theme tokens into the CASE Algorithms `CodeViewer` component while preserving architectural boundaries:
- **Zero Monaco / Zero Editable Editor**: The visualizer remains an accessible, deterministic code inspector.
- **Zero Inline Styles (`style={{}}`)**: CSS token classes (`shiki-token-keyword`, `shiki-token-constant`, etc.) bind seamlessly to theme tokens (`[data-theme="dark"]` and `[data-theme="light"]`) via CSS variables in `tokens.css` and `components.css`.
- **Zero Comments**: Maintained strict 0 comment policy (`//`, `/* */`) across all `src/` files.
- **Two Distinct Visual Layers**: Syntax Highlighting Layer (color tokens) + Execution Highlight Layer (`activeLine`, cyan background tint, indicator `▶`, line active badge) remain decoupled and mutually reinforcing.
- **Pseudocode Algorithmic Grammar**: Integrated custom TextMate grammar supporting procedure definitions, control keywords (`if`, `then`, `for`, `while`, `return`), types, and algorithmic operators (`:=`, `->`).
- **Auto-Scroll Behavior**: Integrated smooth viewport centering when `activeLine` steps beyond the scroll container view bounds.
- **Zero Modifications to Core**: `src/core/` remains 100% untouched and pure.

## Architectural Changes
1. **`src/components/code-viewer/shiki-highlighter.ts`**:
   - Lean Shiki Core architecture using `createHighlighterCore`, `createJavaScriptRegexEngine()`, and explicit `typescript` + `pseudocode` registrations.
   - Zero `.wasm` network fetch dependency on production GitHub Pages.
   - Caching singleton with instant synchronous highlighting and safe fallback.
2. **`src/components/code-viewer/CodeViewer.tsx`**:
   - Token rendering mapped to semantic CSS token classes.
   - Context-aware auto-scroll on `validActiveLine` changes.
   - Retained public interface compatibility: `code`, `language: 'typescript' | 'pseudocode'`, `activeLine`, `className`.
3. **`src/styles/tokens.css` & `src/styles/components.css`**:
   - Added Shiki token variables for Dark (Monokai/Dark+ inspired) and Light (GitHub Light inspired) themes.
   - Refined `.code-line-active` to preserve token color definitions inside active lines.
4. **Testing & Playwright Quality Suite**:
   - Expanded `src/components/code-viewer/code-viewer.test.tsx` (14 comprehensive unit tests).
   - All 22 test files (196 tests) pass with 100% success.
   - Executed Playwright visual audit across 4 viewports (Desktop 1440x900, Laptop 1280x720, Tablet 768x1024, Mobile 390x844) in both Dark and Light themes with 0 console errors.

## Verification Checklist
- [x] `npm run typecheck` (0 errors)
- [x] `npm run lint` (0 warnings)
- [x] `npm run test:run` (196/196 tests passing)
- [x] `npm run build` (Clean production bundle)
- [x] Zero comments verified
- [x] Zero inline styles verified
- [x] Visual audit with real Chromium completed across viewports and themes
