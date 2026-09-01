## 📌 1. Objetivo

Extraer la infraestructura común de presentación e interacción demostrada entre `ArrayLab` y `StackLab` para eliminar la duplicación de código y preparar una base limpia y modular para la expansión a nuevas estructuras de datos (**Queue**, **Linked List**, etc.) en el milestone `v0.2`.

---

## 🎯 2. Alcance (In-Scope)

1. **`TimeTravelControls.tsx` (`src/components/ui/TimeTravelControls.tsx`)**:
   - Componente presentacional reutilizable con:
     - Fila de botones de navegación temporal: `|<` (first), `< Step` (previous), `Play/Pause` (toggle), `Step >` (next), `>|` (last), `Reset` (reset).
     - Fila de selección de velocidad de reproducción: `0.5x` (1000ms), `1x` (600ms), `2x` (250ms).
     - Guía visual accesible de atajos de teclado (`.time-travel-shortcuts-hint`).
     - Deshabilitación reactiva en límites (`currentIndex <= 0`, `currentIndex >= totalSteps - 1`).

2. **`usePlaybackTimer.ts` (`src/components/ui/usePlaybackTimer.ts`)**:
   - Hook reutilizable para controlar el ciclo de vida del intervalo de reproducción automática sobre `TimeTravelController` (o callbacks equivalentes), gestionando `isPlaying`, `playbackSpeed`, `togglePlay` con rebobinado automático al paso inicial si la secuencia ya ha finalizado (`isFinal`), y detención automática al alcanzar el último paso.

3. **`PedagogicalKnowledgePanel.tsx` (`src/components/ui/PedagogicalKnowledgePanel.tsx`)**:
   - Componente presentacional reutilizable para renderizar el contenedor de pestañas de fases pedagógicas (`01. Discover` ... `10. Challenge`), la tarjeta `Card` contenedora, y el renderizado condicional de `CodeViewer` (para pseudocódigo y código con `activeLine`) o texto enriquecido (`<p className="phase-content-text">`).

4. **Refactorización Limpia de `ArrayLab` y `StackLab`**:
   - Reemplazar el boilerplate duplicado en `ArrayLab.tsx` y `StackLab.tsx` utilizando estos componentes/hooks sin alterar su comportamiento visual ni funcional.

---

## 🚫 3. Fronteras Arquitectónicas Estrictas (Out-of-Scope)

- ❌ **NO crear un framework o clase abstracta `BaseLab`**.
- ❌ **NO abstraer inputs específicos**: los inputs de array y los controles de stack permanecen dentro de `ArrayLab` y `StackLab`.
- ❌ **NO abstraer adaptadores visuales SVG**: `ArrayVisualizerAdapter` y `StackVisualizerAdapter` permanecen independientes.
- ❌ **NO abstraer inspectores de estado específicos**: los campos y badges específicos de métricas permanecen en cada laboratorio.
- ❌ **NO modificar `src/core/`**.

---

## ✅ 4. Criterios de Aceptación (Definition of Done)

- [ ] `TimeTravelControls`, `usePlaybackTimer` y `PedagogicalKnowledgePanel` exportados desde `src/components/ui/`.
- [ ] `ArrayLab` y `StackLab` reducen su tamaño y complejidad manteniendo 100% de paridad funcional y visual.
- [ ] 100% de pruebas unitarias e integración pasando en Vitest (incluyendo tests dedicados para los nuevos componentes).
- [ ] `npm run typecheck`, `npm run lint`, `npm run test:run` y `npm run build` ejecutados exitosamente con 0 errores.
- [ ] Cero comentarios en el código y cero estilos inline.
- [ ] Validación con Playwright en local y en la URL pública de GitHub Pages tras el despliegue.
