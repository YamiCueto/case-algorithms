# CASE Algorithms — Sprint 1 Backlog

Este documento contiene la definición completa de las Issues iniciales preparadas para cargarse en **GitHub Issues** y el tablero de **GitHub Projects** para el milestone **`v0.1 — First Learning Experience`**.

---

## Resumen del Milestone: `v0.1 — First Learning Experience`

- **Objetivo**: Establecer los cimientos del sistema de ingeniería y entregar la **primera experiencia de aprendizaje vertical completa** (laboratorio interactivo de Array y Stack con el framework de 10 pasos).
- **Criterio de Éxito**: Poder abrir CASE Algorithms en el navegador y experimentar una estructura de datos viva desde el descubrimiento intuitivo hasta el código y retos prácticos.

---

## Issues Definidas para Sprint 1

---

### Issue #1: `feat(core): project scaffolding with Vite, React, TypeScript, Vitest & CSS Design Tokens`

- **Labels**: `type:feature`, `area:ui`, `priority:critical`
- **Milestone**: `v0.1 — First Learning Experience`
- **Descripción**:
  Inicializar la base de código de frontend en React 18+ utilizando Vite y TypeScript con modo estricto habilitado (`strict: true`). Configurar el entorno de testing con Vitest y la estructura de directorios modular definida en `ARCHITECTURE.md`.
- **Criterios de Aceptación**:
  - [ ] Proyecto inicializado con `npm create vite@latest` (template `react-ts`).
  - [ ] `tsconfig.json` con comprobación de tipos estricta (`noImplicitAny`, `strictNullChecks`).
  - [ ] Vitest configurado con script `npm test` funcionando en un test de prueba.
  - [ ] ESLint y Prettier configurados para formateo automático.
  - [ ] Estructura de carpetas (`src/app`, `src/core`, `src/components`, `src/modules`, `src/styles`) creada.
  - [ ] CSS base con reset moderno y variables CSS raíz definidas en `src/styles/tokens.css`.

---

### Issue #2: `ci(actions): configure GitHub Actions workflow for lint, typecheck and automated tests`

- **Labels**: `type:chore`, `area:performance`, `priority:high`
- **Milestone**: `v0.1 — First Learning Experience`
- **Descripción**:
  Configurar el pipeline de integración continua (CI) en GitHub Actions (`.github/workflows/ci.yml`) para verificar automáticamente cada Pull Request y push a la rama `main`.
- **Criterios de Aceptación**:
  - [ ] Workflow de GitHub Actions ejecutándose en Node.js 20.x.
  - [ ] Paso de instalación con caché de dependencias (`npm ci`).
  - [ ] Paso de verificación de tipos (`npm run typecheck`).
  - [ ] Paso de linter (`npm run lint`).
  - [ ] Paso de ejecución de pruebas unitarias (`npm run test:run`).
  - [ ] Paso de verificación de build (`npm run build`).

---

### Issue #3: `feat(design-system): implement CSS design tokens, lab theme, typography & responsive layout shell`

- **Labels**: `type:feature`, `area:ui`, `priority:high`
- **Milestone**: `v0.1 — First Learning Experience`
- **Descripción**:
  Implementar el sistema visual de laboratorio definido en `DESIGN_SYSTEM.md`: paleta de colores oscura/clara, tipografía (`Inter` + `JetBrains Mono`), elevaciones, bordes y el shell de layout principal (barra de navegación superior, sidebar colapsable y contenedor de viewport interactivo).
- **Criterios de Aceptación**:
  - [ ] Tokens CSS integrados para superficies, bordes, acentos (`cyan`, `emerald`, `amber`, `rose`) y estados de visualización.
  - [ ] Tipografía monoespaciada y sans-serif cargada correctamente.
  - [ ] Componente `AppHeader` con selector de temas y breadcrumb de navegación.
  - [ ] Componente `LabShell` responsivo para albergar el canvas de visualización y el panel de control.
  - [ ] Contraste de color validado según estándar WCAG 2.1 AA.

---

### Issue #4: `feat(engine): build decoupled Step Execution Engine & Time-Travel Controller`

- **Labels**: `type:feature`, `area:algorithm`, `priority:critical`
- **Milestone**: `v0.1 — First Learning Experience`
- **Descripción**:
  Construir el núcleo algorítmico agnóstico del DOM: las interfaces `ExecutionStep<TState>`, `StepActionType`, el generador de pasos y el hook/controlador de viaje en el tiempo (`useTimeTravelEngine` / `HistoryController`).
- **Criterios de Aceptación**:
  - [ ] Tipos TypeScript puros para `ExecutionStep`, `PointerInfo`, `AlgorithmResult`.
  - [ ] Controlador con soporte para `next()`, `prev()`, `seek(index)`, `play()`, `pause()`, `setSpeed(multiplier)` y `reset()`.
  - [ ] Garantía de inmutabilidad en el historial de estados de datos.
  - [ ] Tests unitarios en Vitest validando todas las transiciones temporales y límites del historial.

---

### Issue #5: `feat(visualizer): implement base SVG/Canvas Visualizer Viewport with A11y live regions`

- **Labels**: `type:feature`, `area:visualization`, `area:a11y`, `priority:high`
- **Milestone**: `v0.1 — First Learning Experience`
- **Descripción**:
  Desarrollar el componente base de visualización (`VisualizerViewport`) que renderiza primitivas gráficas (celdas de arreglos, nodos, punteros, etiquetas de índice) y contiene el anunciador semántico accesible para lectores de pantalla.
- **Criterios de Aceptación**:
  - [ ] Renderizador SVG declarativo y responsivo con viewBox dinámico.
  - [ ] Componente `ArrayCell` con soporte visual para estados: `default`, `active`, `comparing`, `swapping`, `sorted`, `discarded`.
  - [ ] Componente `PointerMarker` con flechas y etiquetas animadas.
  - [ ] Componente `A11yAnnouncer` con `role="status"` y `aria-live="polite"` que narra los cambios de paso en lenguaje natural.
  - [ ] Soporte completo de teclado (`Space` = Play/Pause, `ArrowLeft` = Prev, `ArrowRight` = Next).

---

### Issue #6: `feat(modules): Array & Stack Interactive Laboratory (Vertical Slice — 10-Step Learning Experience)`

- **Labels**: `type:feature`, `area:education`, `area:data-structure`, `area:visualization`, `priority:critical`
- **Milestone**: `v0.1 — First Learning Experience`
- **Descripción**:
  Construir la primera experiencia vertical completa de CASE Algorithms: el laboratorio interactivo de **Array & Stack (Pila LIFO)** implementando de principio a fin el Framework Pedagógico de 10 Pasos.
- **Criterios de Aceptación**:
  - [ ] **01. Discover**: Lienzo interactivo inicial con contenedor vertical de Pila y botón detonante.
  - [ ] **02. Interact**: Botones de manipulación en vivo (`Push`, `Pop`, `Peek`, `Clear`).
  - [ ] **03. Observe**: Detección visual del elemento superior (`TOP`) y salida del último elemento agregado.
  - [ ] **04. Explain**: Explicación formal de la estructura LIFO y operaciones $O(1)$.
  - [ ] **05. Visualize**: Ejecución paso a paso del apilado y desapilado con time-travel activo.
  - [ ] **06. Pseudocode**: Pseudocódigo sincronizado con la línea de ejecución activa.
  - [ ] **07. Code**: Implementación canónica tipada en TypeScript (`class Stack<T>`).
  - [ ] **08. Modify**: Ajuste de capacidad máxima para experimentar el *Stack Overflow*.
  - [ ] **09. Practice**: Pregunta de predicción de estado tras una secuencia de operaciones.
  - [ ] **10. Challenge**: Mini-reto de validación de paréntesis balanceados `({[]})`.
  - [ ] Cumplimiento total de los 16 puntos de la **Definition of Done** (`docs/PRODUCT.md`).
