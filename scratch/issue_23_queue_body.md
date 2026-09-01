## 📌 1. Objetivo

Implementar la Vertical Slice completa de la estructura de datos **Queue (Cola FIFO: First-In, First-Out)** en CASE Algorithms, validando la reutilización de la arquitectura consolidada en `v0.1` y la infraestructura común extraída en `v0.2` (`TimeTravelController`, `SVGViewport`, `VisualNode`, `VisualPointer`, `VisualHighlight`, `VisualLabel`, `CodeViewer`, `TimeTravelControls`, `usePlaybackTimer`, `PedagogicalKnowledgePanel`, `A11yAnnouncer`, `useTimeTravelKeyboard`, `LabShell`).

---

## 🏗️ 2. Contrato `QueueState` y Operaciones FIFO (Puro `src/core/`)

### A. Estado Inmutable (`QueueState`)
```typescript
export interface QueueState {
  readonly items: readonly number[];
  readonly frontIndex: number; // 0 cuando contiene elementos, -1 cuando está vacía
  readonly rearIndex: number;  // items.length - 1 cuando contiene elementos, -1 cuando está vacía
  readonly capacity: number;
  readonly lastAction?: QueueAction;
  readonly statusMessage?: string;
}
```

### B. Acciones de Ejecución (`QueueAction`)
```typescript
export type QueueAction =
  | 'INITIALIZE'
  | 'ENQUEUE'
  | 'DEQUEUE'
  | 'PEEK_FRONT'
  | 'OVERFLOW'
  | 'UNDERFLOW'
  | 'COMPLETE';
```

### C. Comandos de Simulación (`QueueCommand`)
```typescript
export type QueueCommand =
  | { readonly type: 'ENQUEUE'; readonly value: number }
  | { readonly type: 'DEQUEUE' }
  | { readonly type: 'PEEK_FRONT' };
```

---

## 🎨 3. Estrategia Visual de Adaptador SVG (`FRONT` / `REAR`)

- **Orientación**: Pipeline o canal horizontal con flujo unidireccional de izquierda a derecha.
  - **Extremo Izquierdo (`FRONT`)**: Salida de elementos (`DEQUEUE` y `PEEK_FRONT`). Puntero `FRONT` señalando al elemento en el índice `0`.
  - **Extremo Derecho (`REAR`)**: Entrada de nuevos elementos (`ENQUEUE`). Puntero `REAR` señalando al elemento en el índice más reciente (`items.length - 1`).
- **Contenedor Delimitador de Capacidad**: Receptáculo horizontal abierto en ambos extremos (`Inflow` por la derecha, `Outflow` por la izquierda) con ranuras punteadas para la capacidad configurada (4, 6 u 8 elementos).
- **Semántica de Resaltados**:
  - `ENQUEUE`: Resaltado cian con animación de entrada en `REAR`.
  - `DEQUEUE`: Resaltado rosa con extracción en `FRONT`.
  - `PEEK_FRONT`: Resaltado ámbar sobre el elemento del frente sin extraerlo.
  - `OVERFLOW` / `UNDERFLOW`: Resaltado rosa de error en bordes del contenedor con mensaje descriptivo.

---

## 📚 4. Experiencia Pedagógica de 10 Fases

1. **`01. Discover`**: El principio FIFO (First-In, First-Out) y su analogía con filas del mundo real y buffers de mensajes.
2. **`02. Interact`**: Enqueue en REAR, Dequeue en FRONT y Peek en FRONT con control temporal.
3. **`03. Observe`**: Acceso confinado por dos extremos: inserción por el extremo posterior y extracción estricta por el frente.
4. **`04. Explain`**: Complejidad temporal $O(1)$ en operaciones con punteros directos vs costo de desplazamiento de arrays ($O(n)$).
5. **`05. Visualize`**: Canal horizontal SVG y sincronización de punteros `FRONT` y `REAR`.
6. **`06. Pseudocode`**: Especificación formal del ADT Bounded Queue sincronizada línea a línea con `CodeViewer`.
7. **`07. Code`**: Implementación en TypeScript genérico `BoundedQueue<T>` con `typescriptLine` sincronizado.
8. **`08. Modify`**: Exploración interactiva de condiciones de borde (Overflow en cola llena y Underflow en cola vacía).
9. **`09. Practice`**: Caso real de aplicación: procesamiento BFS (Breadth-First Search) y colas de tareas de renderizado.
10. **`10. Challenge`**: Pregunta interactiva de desafío sobre el estado de la cola tras una secuencia de operaciones combinadas.

---

## 🧪 5. Escenarios de Pruebas y Auditoría Playwright

### A. Pruebas Unitarias e Integración (Vitest)
- [ ] Pruebas unitarias de `BoundedQueue<T>` en `src/core/data-structures/queue.test.ts` (FIFO, push/shift, overflow, underflow, peek, isEmpty, isFull).
- [ ] Pruebas unitarias de `simulateQueueOperations` en `src/core/algorithms/queue-operations.test.ts` (trazas deterministas de `ExecutionStep<QueueState>[]`, mensajes a11y narrativos, sincronización de líneas).
- [ ] Pruebas unitarias de `QueueVisualizerAdapter` en `src/components/visualizer/adapters/queue-visualizer-adapter.test.tsx` (generación de nodos, punteros `FRONT` y `REAR`, límites y highlights).
- [ ] Pruebas de integración de `QueueLab` en `src/modules/queue-lab/queue-lab.test.tsx` (montaje inicial, controles interactivos Enqueue/Dequeue/Peek/Clear, cambio de capacidad, presets, teclado y `A11yAnnouncer`).

### B. Auditoría Playwright (Chromium Real)
- [ ] **Escenario 1**: Secuencia estándar Enqueue múltiple + Dequeue + Peek, verificando movimiento de punteros `FRONT` y `REAR`.
- [ ] **Escenario 2**: Presets de demostración de Overflow (llenado de capacidad + 1) y Underflow (dequeue en cola vacía).
- [ ] **Escenario 3**: Navegación por teclado global (`Space`, `←`, `→`, `Home`, `End`, `R`) y verificación de región viva `aria-live`.
- [ ] **Escenario 4**: Selector superior de laboratorios alternando fluidamente entre **Array**, **Stack** y **Queue**.
- [ ] **Escenario 5**: Responsividad en 4 viewports (Desktop $1440\times 900$, Laptop $1280\times 720$, Tablet $768\times 1024$, Mobile $390\times 844$).
- [ ] **Escenario 6**: Validación en vivo en la URL de producción desplegada en GitHub Pages con 0 errores 404 y 0 errores de consola.

---

## 🚫 6. Restricciones Arquitectónicas Estrictas

- ❌ **NO modificar `TimeTravelController` ni la infraestructura de `src/core/engine`**.
- ❌ **NO crear `BaseLab` ni clases abstractas comunes**.
- ❌ **NO introducir dependencias externas en `package.json`**.
- ❌ **Cero estilos inline (`style={{`)** y **cero comentarios en código**.
