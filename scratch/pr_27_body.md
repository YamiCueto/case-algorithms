## Resumen de Cambios

Closes #27

Este PR implementa la resolución del technical debt identificado durante la auditoría arquitectónica post-v0.2:

1. **Extracción de `useTimeTravelEngine<TState>`**:
   - Encapsula el ciclo de vida del controlador, suscripción reactiva (`subscribe`), estado de paso (`currentStep`, `currentIndex`, `totalSteps`), flags de límites (`isFirst`, `isLast`, `isFinal`), métodos de navegación (`handleNext`, `handlePrevious`, `handleFirst`, `handleLast`, `handleReset`, `goToStep`) y carga dinámica (`loadSteps`).
   - Mantiene una separación estricta de responsabilidades componiéndose de forma limpia con `usePlaybackTimer` y `useTimeTravelKeyboard`.
   - **No crea `BaseLab` ni `AbstractLab`**: Array, Stack, Queue y Linked List conservan total autonomía sobre sus inputs, presets, inspectores y adaptadores visuales.

2. **Migración de los 4 Laboratorios**:
   - `ArrayLab.tsx`
   - `StackLab.tsx`
   - `QueueLab.tsx`
   - `LinkedListLab.tsx`
   - Eliminadas más de 130 líneas de boilerplate duplicado de controladores y suscripciones.

3. **Alineación de `codeHighlight` en Bubble Sort**:
   - Corregido el mapeo en `src/core/algorithms/bubble-sort.ts` para que `COMPARE` (`pseudocodeLine: 6`, `typescriptLine: 7`) y `SWAP` (`pseudocodeLine: 7`, `typescriptLine: 8`) apunten con exactitud milimétrica a las líneas correspondientes del pseudocódigo y código TypeScript en `CodeViewer`.

4. **Integridad y Calidad**:
   - `190/190` pruebas unitarias e integración pasando en Vitest (incluyendo suite dedicada para `useTimeTravelEngine` y tests de exactitud de líneas para Bubble Sort).
   - TypeScript `tsc --noEmit` sin errores.
   - ESLint con 0 warnings.
   - Build de producción limpio y optimizado (~245.85 kB JS, 20.24 kB CSS).
   - Auditoría visual con Playwright CLI en Chromium real validando Desktop ($1440\times 900$) y Mobile ($390\times 844$).
   - Cero comentarios en el código y cero estilos inline.

---

## Archivos Creados y Modificados

- `src/components/ui/useTimeTravelEngine.ts` (Nuevo hook genérico reutilizable)
- `src/components/ui/useTimeTravelEngine.test.tsx` (Tests unitarios de lifecycle, navegación y reactividad)
- `src/components/ui/index.ts` (Exportación en Design System)
- `src/core/algorithms/bubble-sort.ts` (Alineación de líneas `codeHighlight`)
- `src/core/algorithms/bubble-sort.test.ts` (Aserciones de líneas en `codeHighlight`)
- `src/modules/array-lab/ArrayLab.tsx` (Migración a `useTimeTravelEngine`)
- `src/modules/array-lab/array-lab.test.tsx` (Actualización de tests de `CodeViewer` sync)
- `src/modules/stack-lab/StackLab.tsx` (Migración a `useTimeTravelEngine`)
- `src/modules/queue-lab/QueueLab.tsx` (Migración a `useTimeTravelEngine`)
- `src/modules/linked-list-lab/LinkedListLab.tsx` (Migración a `useTimeTravelEngine`)
