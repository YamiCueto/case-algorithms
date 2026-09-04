## Objetivo

Rediseñar la distribución visual y estructural de los laboratorios interactivos de CASE Algorithms (`ArrayLab`, `StackLab`, `QueueLab`, `LinkedListLab`) para que la **Visualización SVG** y el **Visor de Código Sincronizado (`CodeViewer`)** actúen como superficies de aprendizaje primarias de primer nivel, visibles en paralelo sobre el mismo `ExecutionStep`.

---

## Problema Actual

En la arquitectura actual de `LabShell`:
```text
Viewport (SVG)
   ↓
Controls & State Inspector (Columna lateral)
   ↓
Multi-Dimensional Knowledge (Card inferior)
   ↓
CodeViewer (Oculto dentro de las pestañas 06/07 del conocimiento inferior)
```

Esto obliga al usuario a desplazarse verticalmente y cambiar de pestañas para observar la correspondencia entre la mutación visual en el canvas y la instrucción activa en el código/pseudocódigo.

---

## Nueva Arquitectura de Distribución (Dual Stage Layout)

```text
┌────────────────────────────────────────────────────────────────────────┐
│                              APP HEADER                                │
├────────────────────────────────────────────────────────────────────────┤
│                              LAB HEADER                                │
├───────────────────────────────────┬────────────────────────────────────┤
│                                   │                                    │
│   INTERACTIVE VISUALIZATION       │        SYNCHRONIZED CODE           │
│           (55–60%)                │             (40–45%)               │
│                                   │                                    │
│   • SVG Viewport                  │   • Selector Pseudocode/TypeScript │
│   • Canvas responsivo             │   • Línea activa sincronizada      │
│   • Nodos, punteros & resaltados  │   • Active Line Badge              │
│                                   │                                    │
├───────────────────────────────────┴────────────────────────────────────┤
│               TIME TRAVEL CONTROLS & PLAYBACK CONTROLLER               │
├────────────────────────────────────────────────────────────────────────┤
│               INTERACTIVE CONTROLS & STATE INSPECTOR                   │
├────────────────────────────────────────────────────────────────────────┤
│               PEDAGOGICAL KNOWLEDGE PANEL (10 FASES)                   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Alcance Técnico

1. **Rediseño de `LabShell` (`src/components/ui/LabShell.tsx`)**:
   - `visualizationSlot`: Contenedor principal de la proyección SVG interactiva (55–60% en Desktop).
   - `codeSlot`: Contenedor del visor de código sincronizado (`CodeViewer`) con selector integrado de lenguaje (Pseudocódigo / TypeScript) (40–45% en Desktop).
   - `timeTravelSlot`: Barra horizontal dedicada de transporte temporal (`TimeTravelControls` + `usePlaybackTimer`).
   - `controlsSlot`: Controles de entrada específicos del laboratorio (inputs, botones de mutación, presets).
   - `inspectorSlot`: Inspector de estado, cotas, punteros y métricas.
   - `knowledgeSlot`: Navegador de las 10 dimensiones pedagógicas conceptuales (Discover, Observe, Explain, Modify, Practice, Challenge, etc.).
2. **Actualización de `src/styles/layout.css`**:
   - Grid/Flexbox responsivo con distribución `55% / 45%` o `60% / 40%` en viewports `>= 1024px`.
   - Altura de paneles equilibrada para que Canvas y CodeViewer compartan plano visual sin scroll desproporcionado.
   - Breakpoints pulidos para:
     - **Desktop (1440×900)**: Dual-stage side-by-side.
     - **Laptop (1280×720)**: Dual-stage optimizado sin recorte.
     - **Tablet (768×1024)**: Stacking vertical o split adaptativo.
     - **Mobile (390×844)**: Stacking vertical limpio, inputs accesibles y scroll horizontal en tabs.
3. **Integración en los 4 Laboratorios**:
   - `ArrayLab.tsx`
   - `StackLab.tsx`
   - `QueueLab.tsx`
   - `LinkedListLab.tsx`

---

## Criterios de Aceptación (Definition of Done)

- [ ] `LabShell` proporciona slots semánticos explícitos para Visualización, Código, Time Travel, Controles/Inspector y Conocimiento.
- [ ] En Desktop ($1440\times 900$) y Laptop ($1280\times 720$), Visualización y CodeViewer son visibles simultáneamente en paralelo sin requerir scroll.
- [ ] El cambio de paso mediante Time Travel o teclado actualiza simultáneamente la animación en el canvas y la línea activa en el visor de código.
- [ ] El visor de código permite alternar entre Pseudocódigo y TypeScript manteniendo la línea activa correspondiente al `ExecutionStep`.
- [ ] En Tablet ($768\times 1024$) y Mobile ($390\times 844$), el layout se apila con jerarquía lógica sin desbordamientos horizontales ni colisiones visuales.
- [ ] `ArrayLab`, `StackLab`, `QueueLab` y `LinkedListLab` funcionan con la nueva distribución conservando su autonomía de inputs, inspectores y adaptadores.
- [ ] `npm run typecheck` pasa con 0 errores de TypeScript.
- [ ] `npm run lint` pasa con 0 warnings de ESLint.
- [ ] `npm run test:run` pasa al 100% (190+ tests).
- [ ] `npm run build` genera el bundle de producción sin fallos.
- [ ] Cero comentarios en código y cero estilos inline (`style={{}}`).
- [ ] Suite de Playwright CLI en Chromium real valida visualmente los 4 laboratorios en los 4 viewports ($1440\times 900$, $1280\times 720$, $768\times 1024$, $390\times 844$).

---

## Estrategia de Validación Visual Playwright

Se ejecutará una batería de capturas en Chromium real auditando:
1. **ArrayLab**: Comparación de elementos en Canvas vs Resaltado de línea en Pseudocode/TypeScript lado a lado.
2. **StackLab**: Operación Push/Pop en contenedor vertical vs Código de clase `BoundedStack` lado a lado.
3. **QueueLab**: Operación Enqueue/Dequeue en buffer circular vs Pseudocódigo/TypeScript lado a lado.
4. **LinkedListLab**: Mutación de punteros `HEAD`/`TAIL` en grafo vs Código TypeScript lado a lado.
5. **Viewports Auditados**: $1440\times 900$, $1280\times 720$, $768\times 1024$, $390\times 844$.
6. **Inspección Visual**: Apertura e inspección directa de screenshots para garantizar balance de alturas, legibilidad de tipografía, contraste y ausencia de desbordamientos.

---

## Fuera de Alcance

- No modificar `src/core/` ni tipos de `ExecutionStep`.
- No alterar la lógica algorítmica ni los adaptadores visuales SVG existentes.
- No crear `BaseLab` ni clases base abstractas.
- No incorporar Shiki todavía (reservado para la siguiente Issue de Sprint 2).
- No internacionalizar todavía (reservado para las Issues de i18n de Sprint 2).
