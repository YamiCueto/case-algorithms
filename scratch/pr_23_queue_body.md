## 📌 Descripción de la Vertical Slice: Queue (FIFO)

Este Pull Request implementa la Vertical Slice completa de la estructura de datos **Queue (Cola FIFO)** (**Issue #23**), validando la modularidad de la arquitectura de CASE Algorithms y la infraestructura común extraída en `v0.2`:

1. **Core Domain (`src/core/`)**:
   - `src/core/data-structures/queue.ts`: Implementación pura y desacoplada de `BoundedQueue<T>` y del contrato inmutable `QueueState`.
   - `src/core/algorithms/queue-operations.ts`: Simulador determinista `simulateQueueOperations` que genera trazas reproducibles `ExecutionStep<QueueState>[]` con mensajes narrativos accesibles y mapeo de líneas de código.
   - Acciones soportadas: `INITIALIZE`, `ENQUEUE`, `DEQUEUE`, `PEEK_FRONT`, `OVERFLOW`, `UNDERFLOW`, `COMPLETE`.

2. **Adaptador Visual SVG (`src/components/visualizer/adapters/QueueVisualizerAdapter.tsx`)**:
   - Representación gráfica de canal / pipe horizontal abierto con flujo de derecha a izquierda:
     - `FRONT`: Extremo de salida / dequeue a la izquierda con puntero `FRONT` dinámico.
     - `REAR`: Extremo de entrada / enqueue a la derecha con puntero `REAR` dinámico.
   - Ranuras punteadas de capacidad configurada ($4$, $6$, $8$).
   - Highlights animados para inserción, extracción, inspección y desbordamientos.

3. **Módulo de Aprendizaje (`src/modules/queue-lab/QueueLab.tsx`)**:
   - Panel de operaciones interactivas (`Enqueue`, `Dequeue`, `Peek Front`, `Clear`).
   - Selector de capacidad ($4, 6, 8$) y 4 presets de demostración (`Standard`, `Overflow Demo`, `Underflow Demo`, `Peek & Inspect`).
   - Inspector de estado y capacidad con badges de acción y estado.
   - Experiencia pedagógica de 10 fases con sincronización de líneas en `CodeViewer` para pseudocódigo y TypeScript.
   - Integración nativa con `TimeTravelControls`, `usePlaybackTimer`, `PedagogicalKnowledgePanel`, `A11yAnnouncer` y `useTimeTravelKeyboard`.

4. **Integración en Shell & Selector**:
   - Actualización de `src/app/App.tsx` con soporte para alternar entre **Array & Bubble Sort**, **Stack (LIFO)** y **Queue (FIFO)**.

---

## 🔗 Vinculación con Issue

Closes #23

---

## 🏷️ Tipo de Cambio

- [x] `feat`: Nueva funcionalidad o componente de interfaz

---

## ✅ Lista de Verificación (Definition of Done)

### Calidad de Software e Ingeniería
- [x] `src/core/` es 100% puro TypeScript (cero dependencias de React, DOM o CSS).
- [x] Cero estilos inline (`style=`) y cero comentarios en código (`//`, `/* */`).
- [x] `npm run typecheck` pasando con 0 errores.
- [x] `npm run lint` pasando con 0 advertencias.
- [x] `npm run test:run` pasando al 100% (**152 tests en 17 suites**).
- [x] `npm run build` compilando bundle de producción correctamente.

### Accesibilidad (A11y) & Visual
- [x] Navegación global por teclado (`Space`, `←`, `→`, `Home`, `End`, `R`) con aislamiento en inputs.
- [x] Anuncios dinámicos en lector de pantalla mediante `A11yAnnouncer` (`aria-live="polite"`).
- [x] Auditoría visual con Playwright en 4 viewports ($1440\times 900$, $1280\times 720$, $768\times 1024$, $390\times 844$).
- [x] Verificación de no regresión en `ArrayLab` y `StackLab`.
