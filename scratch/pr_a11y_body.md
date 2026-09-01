## 📌 Descripción del Cambio

Este Pull Request implementa la capa transversal de **Accesibilidad Global (A11y)** de CASE Algorithms (**Issue #19**), cerrando los criterios pendientes **DoD #11 (Soporte de Teclado Completo)** y **DoD #12 (Regiones ARIA en Vivo)** del milestone `v0.1 — First Learning Experience`:

1. **Atajos Globales de Teclado para Time-Travel**:
   - `Space`: Alterna entre reproducir y pausar (`Play/Pause`) evitando el scroll por defecto de la página.
   - `ArrowLeft` / `ArrowRight`: Retrocede o avanza un paso (`previous()` / `next()`).
   - `Home` / `End`: Salta al inicio o al final de la secuencia (`first()` / `last()`).
   - `r` / `R`: Reinicia la ejecución al paso inicial (`reset()`).
   - **Aislamiento Seguro**: Los atajos se desactivan automáticamente cuando el foco está en un elemento interactivo editable (`<input>`, `<textarea>`, `<select>`, `contenteditable`).

2. **Componente Reutilizable `A11yAnnouncer`**:
   - Región viva `aria-live="polite"` (`role="status"`, `aria-atomic="true"`) en `src/components/a11y/A11yAnnouncer.tsx` con estilos accesibles `.a11y-live-announcer`.
   - Comunica dinámicamente el mensaje narrativo del algoritmo (`currentStep.a11yMessage`) a lectores de pantalla y tecnologías de asistencia.

3. **Integración Transversal y Cero Duplicación**:
   - Hook reutilizable `useTimeTravelKeyboard` en `src/components/a11y/useTimeTravelKeyboard.ts`.
   - Integrado en `ArrayLab` y `StackLab`.
   - Guía visual accesible de atajos de teclado (`.time-travel-shortcuts-hint`).

---

## 🔗 Vinculación con Issue

Closes #19

---

## 🏷️ Tipo de Cambio

- [x] `feat`: Nueva funcionalidad o componente de interfaz

---

## ✅ Lista de Verificación (Definition of Done)

### Calidad de Software e Ingeniería
- [x] `src/core/` no fue modificado (0 cambios en algoritmos o estructuras de datos).
- [x] Cero estilos inline (`style=`) en los nuevos componentes; estilos definidos en `src/styles/components.css`.
- [x] Cero comentarios en el código fuente.
- [x] `npm run typecheck` ejecutado con 0 errores.
- [x] `npm run lint` ejecutado con 0 advertencias.
- [x] `npm run test:run` pasando al 100% (116 tests en 12 suites).
- [x] `npm run build` compilando exitosamente en 438ms.

### Accesibilidad (A11y)
- [x] `Space`, `←`, `→`, `Home`, `End`, `R` totalmente funcionales para navegación sin mouse.
- [x] `A11yAnnouncer` transmite `a11yMessage` con `role="status"` y `aria-live="polite"`.

---

## 🔍 Comandos de Verificación Ejecutados Localmente

```bash
npm run typecheck  # tsc --noEmit (0 errores)
npm run lint       # eslint . --max-warnings 0 (0 advertencias)
npm run test:run   # vitest run (12 suites, 116 tests pasados al 100%)
npm run build      # tsc && vite build (bundle generado correctamente)
```
