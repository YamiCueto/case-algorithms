## 📌 Descripción del Cambio

<!-- Explica de forma concisa qué problema resuelve o qué módulo añade este Pull Request. -->

---

## 🔗 Vinculación con Issue

<!-- GitHub cerrará automáticamente la issue al fusionar este PR si usas las palabras clave: Closes #123, Fixes #123 -->
Closes #

---

## 🏷️ Tipo de Cambio

- [ ] `feat`: Nueva funcionalidad o módulo interactivo
- [ ] `fix`: Corrección de error o bug visual/algorítmico
- [ ] `docs`: Documentación o especificación
- [ ] `refactor`: Refactorización sin cambio funcional
- [ ] `test`: Nuevas pruebas automatizadas
- [ ] `a11y`: Mejora de accesibilidad (ARIA, navegación por teclado)
- [ ] `chore`: Mantenimiento o configuración de build

---

## 🧪 Evidencia Visual y de Interacción

<!-- Si este PR añade o modifica la interfaz o visualización, adjunta capturas o una grabación (WebP/GIF) de la interacción. -->

| Vista Previa del Laboratorio | Interacción / Time-Travel |
| :--- | :--- |
| *(Adjunta captura aquí)* | *(Adjunta captura/video aquí)* |

---

## ✅ Lista de Verificación (Definition of Done)

Marca las casillas que aplican a este Pull Request conforme a `docs/PRODUCT.md`:

### Ingeniería y Calidad
- [ ] Código escrito en TypeScript con tipado estricto (sin `any`).
- [ ] Lógica algorítmica desacoplada emitiendo `ExecutionStep[]` inmutables.
- [ ] Pruebas unitarias en Vitest creadas/actualizadas (`npm test` pasa sin errores).
- [ ] `npm run typecheck` y `npm run lint` ejecutan sin advertencias ni fallos.

### Pedagogía y Experiencia de Usuario
- [ ] Alineado con el Framework de 10 Pasos (`docs/LEARNING.md`).
- [ ] Visualización conforme al sistema de diseño (`docs/DESIGN_SYSTEM.md`).
- [ ] Soporte de viaje en el tiempo (avanzar, retroceder, pausar, reproducir).
- [ ] Resaltado sincronizado de código/pseudocódigo.

### Accesibilidad (A11y)
- [ ] Operable completamente mediante teclado.
- [ ] Transiciones de estado narradas en región ARIA (`aria-live="polite"`).
- [ ] Ratios de contraste WCAG 2.1 AA verificados.

---

## 🔍 Comandos de Verificación Ejecutados Localmente

```bash
npm run typecheck
npm run lint
npm test
```
