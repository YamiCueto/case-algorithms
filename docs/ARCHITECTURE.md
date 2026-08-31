# CASE Algorithms — Technical Architecture & System Design

Este documento define la arquitectura técnica, las interfaces fundamentales y el modelo de ejecución desacoplado de **CASE Algorithms**.

---

## 1. Principio Fundamental de Desacoplamiento

La regla arquitectónica central de CASE Algorithms es la **separación estricta entre la lógica del algoritmo y su representación visual**.

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. ALGORITHM ENGINE (Pure TypeScript)                       │
│    - Ejecuta la lógica sin dependencias de React o DOM      │
│    - Retorna una secuencia inmutable de ExecutionStep[]     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. STEP & TIME-TRAVEL CONTROLLER                            │
│    - Maneja el índice actual, reproducción, pausa y replay  │
│    - Expone estado actual, progreso (0..1) y controles      │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌─────────────────────────────┐┌──────────────────────────────┐
│ 3. VISUALIZATION RENDERER   ││ 4. ACCESSIBILITY & ANNOUNCER │
│    - SVG / HTML5 Canvas     ││    - aria-live announcements │
│    - Layouts declarativos   ││    - Foco accesible          │
│    - Interpolación visual   ││    - Descripción semántica   │
└─────────────────────────────┘└──────────────────────────────┘
               │                              │
               └──────────────┬───────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. CODE & PSEUDOCODE SYNCHRONIZER                           │
│    - Resalta líneas activas en TypeScript y pseudocódigo    │
│    - Inspección de variables locales activas                │
└─────────────────────────────────────────────────────────────┘
```

Esta separación garantiza:
- **Testabilidad total**: El algoritmo y sus trazas de ejecución se pueden probar con tests unitarios puros en Vitest sin necesidad de simular el DOM.
- **Flexibilidad de renderizado**: La misma secuencia de pasos puede renderizarse en SVG, Canvas, o exportarse a JSON.
- **Determinismo**: La visualización es una función pura del estado actual del paso ($Render(Step_i) \to UI$).

---

## 2. Tipos e Interfaces Core

### 2.1 Modelo de Pasos de Ejecución (`ExecutionStep`)

```typescript
/** Tipo de acción atómica realizada en un paso */
export type StepActionType =
  | 'INITIALIZE'
  | 'COMPARE'
  | 'SWAP'
  | 'INSERT'
  | 'DELETE'
  | 'VISIT'
  | 'SET_POINTER'
  | 'SPLIT'
  | 'MERGE'
  | 'FOUND'
  | 'NOT_FOUND'
  | 'COMPLETE';

/** Indicador semántico de un puntero en la visualización */
export interface PointerInfo {
  id: string;          // Ej: 'low', 'mid', 'high', 'top'
  index: number;       // Posición o índice objetivo
  label: string;       // Etiqueta legible
  colorVar?: string;   // Token de color asociado
}

/** Paso atómico e inmutable emitido por el motor algorítmico */
export interface ExecutionStep<TState> {
  id: string;
  stepIndex: number;
  totalSteps?: number;
  action: StepActionType;
  description: string;                // Descripción didáctica del paso
  a11yMessage: string;                // Mensaje optimizado para lector de pantalla
  state: TState;                      // Snapshot completo del estado de datos
  activeIndices?: number[];           // Elementos destacados en el paso
  comparedIndices?: [number, number]; // Índices bajo comparación
  pointers?: PointerInfo[];           // Punteros activos en la visualización
  codeHighlight?: {
    pseudocodeLine?: number;          // Línea activa en pseudocódigo (1-based)
    typescriptLine?: number;          // Línea activa en código TS (1-based)
  };
  metrics?: {
    comparisonsCount: number;
    swapsCount: number;
    depthLevel?: number;
  };
}
```

### 2.2 Contrato de Ejecución Algorítmica (`AlgorithmRunner`)

```typescript
export interface AlgorithmResult<TState, TOutput = unknown> {
  steps: ExecutionStep<TState>[];
  output: TOutput;
  metrics: {
    totalComparisons: number;
    totalSwaps: number;
    totalSteps: number;
    executionTimeMs: number;
  };
}

export type AlgorithmGenerator<TInput, TState, TOutput = unknown> = (
  input: TInput
) => AlgorithmResult<TState, TOutput>;
```

---

## 3. Arquitectura de Accesibilidad (A11y First)

La accesibilidad en CASE Algorithms opera en cuatro capas sincronizadas:

```text
[ Visual State ]  ──▶  Colores, coordenadas SVG, animaciones de precisión
[ Semantic State ]──▶  Atributos HTML/ARIA (`role="list"`, `aria-current="step"`)
[ Keyboard Nav ]  ──▶  Atajos globales (`Space`=Play/Pause, `ArrowRight`=Next, `ArrowLeft`=Prev)
[ Screen Reader ] ──▶  Live Region (`aria-live="polite"`) con narración estructurada
```

### Protocolo de Anuncios Semánticos
Cada `ExecutionStep` produce un `a11yMessage` autocontenido.  
*Ejemplo (Binary Search paso 2)*:  
`"Comparando valor en índice 4 (valor 45) con objetivo 60. 45 es menor que 60. Descartando mitad izquierda (índices 0 a 4)."`

---

## 4. Stack Tecnológico (100% Client-Side en v0)

No se requiere backend en `v0`. Toda la simulación, generación de pasos y renderizado se ejecuta en el navegador:

- **Framework**: React 18+ con TypeScript en modo estricto.
- **Build Tooling**: Vite para desarrollo ultrarrápido y builds optimizados.
- **Estilos**: CSS nativo con Tokens de Diseño (`docs/DESIGN_SYSTEM.md`).
- **Visualización**: SVG declarativo para arreglos, pilas, árboles y grafos; Canvas optimizado solo si la densidad de nodos lo requiere.
- **Editor y Código**: PrismJS / Monaco Editor con temas personalizados de laboratorio.
- **Testing**:
  - **Vitest**: Pruebas unitarias de algoritmos y generación de `ExecutionStep[]`.
  - **React Testing Library**: Pruebas de integración de componentes y accesibilidad ARIA.
  - **Playwright**: Pruebas End-to-End de flujos interactivos completos.
- **CI/CD**: GitHub Actions para validación continua de tipos, linters y tests, con despliegue automático a GitHub Pages.

---

## 5. Estructura de Directorios Propuesta

```text
src/
├── app/                    # Entrada de la aplicación, router y layouts principales
├── core/                   # Núcleo algorítmico agnóstico del framework
│   ├── types/              # Interfaces ExecutionStep, AlgorithmResult, Pointers
│   ├── engine/             # Controlador de reproducción y Time-Travel
│   ├── algorithms/         # Lógica pura de algoritmos (binary-search, sorting, etc.)
│   └── data-structures/    # Implementaciones puras de ED (array, stack, queue, tree)
├── components/             # Componentes de UI reutilizables
│   ├── ui/                 # Botones, sliders, paneles, tabs, modales
│   ├── visualizer/         # Canvas/SVG base, viewport zoom/pan, nodos, flechas
│   ├── code-viewer/        # Resaltador de código y pseudocódigo sincronizado
│   └── a11y/               # Anunciador de estados ARIA y gestor de foco
├── modules/                # Módulos de aprendizaje temáticos (10-step framework)
│   ├── array/
│   ├── stack/
│   ├── binary-search/
│   └── sorting/
└── styles/                 # Tokens CSS globales, temas y utilidades
```
