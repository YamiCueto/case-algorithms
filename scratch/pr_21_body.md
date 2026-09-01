## 📌 Descripción del Refactor

Este Pull Request implementa la extracción de infraestructura común demostrada entre `ArrayLab` y `StackLab` (**Issue #21**), eliminando duplicación de boilerplate en la capa de presentación sin introducir frameworks internos excesivos ni clases abstractas:

1. **`TimeTravelControls.tsx` (`src/components/ui/TimeTravelControls.tsx`)**:
   - Fila de 6 botones de navegación temporal (`|<`, `<`, `Play/Pause`, `>`, `>|`, `Reset`) con estados deshabilitados en límites.
   - Selector de velocidad (`0.5x`, `1x`, `2x`).
   - Guía accesible de atajos de teclado (`.time-travel-shortcuts-hint`).

2. **`usePlaybackTimer.ts` (`src/components/ui/usePlaybackTimer.ts`)**:
   - Hook desacoplado para el ciclo de reproducción (`isPlaying`, `playbackSpeed`, `handleTogglePlay`, `stopPlayback`).
   - Rebobinado automático al inicio si la secuencia ya ha finalizado (`isFinal`).

3. **`PedagogicalKnowledgePanel.tsx` (`src/components/ui/PedagogicalKnowledgePanel.tsx`)**:
   - Selector de pestañas de 10 fases (`01. Discover` a `10. Challenge`).
   - Integración nativa con `CodeViewer` para pseudocódigo (fase 06) y TypeScript (fase 07) con resaltado de `activeLine`.

4. **Preservación Estricta de Fronteras Específicas**:
   - Los inputs, presets y adaptadores de cada estructura permanecen 100% locales en `ArrayLab` y `StackLab`.
   - `src/core/` no fue tocado (0 cambios).
   - Reducción de líneas en laboratorios: `ArrayLab` (496 -> 306 líneas, -38%), `StackLab` (659 -> 442 líneas, -33%).

---

## 🔗 Vinculación con Issue

Closes #21

---

## 🏷️ Tipo de Cambio

- [x] `refactor`: Refactorización de código sin cambios en la API pública ni en la lógica de negocio

---

## ✅ Lista de Verificación (Definition of Done)

- [x] `src/core/` no fue modificado (0 cambios).
- [x] Cero estilos inline (`style=`) y cero comentarios en código (`//`, `/* */`).
- [x] `npm run typecheck` pasando con 0 errores.
- [x] `npm run lint` pasando con 0 advertencias.
- [x] `npm run test:run` pasando al 100% (**120 tests en 12 suites**).
- [x] `npm run build` compilando bundle de producción correctamente.
- [x] Playwright validando navegación temporal y accesibilidad.
