### Context & Objective

As part of **Sprint 2 (Learning Experience & Globalization)**, after the visual layout redesign ([#29](https://github.com/YamiCueto/case-algorithms/issues/29)), the `CodeViewer` component now stands side-by-side with the visual canvas as a first-class learning surface.

To transform this surface from raw monospace text into an engaging, pedagogically clear code representation, we need to integrate **Shiki** for syntax highlighting without breaking our strict engineering principles (NO Monaco, NO editable editor, zero inline styles `style={{}}`, zero comments, full keyboard and ARIA accessibility, responsive layout, and synchronized Step-to-Code line execution highlighting).

---

### Scope & Architectural Requirements

1. **Syntax Highlighting Engine**:
   - Integrate `shiki` (or lightweight `@shikijs/core` / `shiki/core` with bundled grammars).
   - Support `typescript` and `pseudocode` (using structured lexical highlighting for algorithmic pseudocode: `procedure`, `end procedure`, `if`, `then`, `else`, `return`, `for`, `from`, `to`, `do`, `while`, `mod`, `:=`, etc.).
   - Ensure the CASE `CodeViewer` retains full control over:
     - Line numbering (`<td class="code-line-number">`)
     - `activeLine` highlighting layer (Execution Highlight)
     - Active line indicator (`▶`)
     - Auto-scrolling to keep active line within visible viewport
     - ARIA attributes (`aria-current="step"`, `aria-label`, accessibility roles)
     - Dark & Light theme switching

2. **Theme Integration (Zero `style={{}}`)**:
   - Support Dark (`monokai` or `dark-plus` / `nord` / `tokyo-night`) and Light (`github-light`).
   - Use CSS classes or CSS variables for token coloring rather than hardcoded inline `style={{}}` attributes.
   - Synchronize with CASE Algorithms theme toggle (`data-theme="dark"` and `data-theme="light"`).

3. **Two-Layer Highlighting Distinction**:
   - **Layer 1: Syntax Highlight** (lexical coloring of keywords, types, identifiers, strings, numbers, comments).
   - **Layer 2: Execution Highlight (`activeLine`)** (step-to-code execution tracking with background tint and active indicator).
   - Neither layer replaces the other; syntax highlighting remains crisp and readable when a line is active.

4. **Auto-Scroll Behavior**:
   - Smoothly scroll the `CodeViewer` body when `activeLine` changes if the target line is outside or near the boundary of the visible scroll area.
   - Avoid aggressive jumpy scrolling if the line is already comfortably within view.

5. **Strict Architectural Integrity**:
   - `src/core/` remains 100% independent and untouched.
   - ZERO comments (`//`, `/* */`) in `src/`.
   - ZERO inline styles (`style={{`).
   - 100% passing tests (unit tests + full Chromium Playwright visual validation).

---

### Acceptance Criteria

- [ ] `shiki` integrated cleanly into build pipeline with zero bundler errors and fast execution.
- [ ] TypeScript and Pseudocode highlighted with clear syntactic contrast.
- [ ] `activeLine` (1-indexed) execution highlight synchronized with `ExecutionStep` across all 4 laboratories (`ArrayLab`, `StackLab`, `QueueLab`, `LinkedListLab`).
- [ ] Auto-scroll smoothly reveals active line during manual stepping and automated playback.
- [ ] Dark and Light theme switching dynamically updates code tokens with optimal contrast.
- [ ] 0 TypeScript errors (`npm run typecheck`), 0 ESLint warnings (`npm run lint`), 100% tests passing (`npm run test:run`), production build passes (`npm run build`).
- [ ] Visual verification with Playwright CLI across Desktop (1440x900), Laptop (1280x720), Tablet (768x1024), and Mobile (390x844).
