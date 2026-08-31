# CASE Algorithms — Design System & Visual Specification

Este documento define el sistema de diseño, los tokens CSS, la tipografía, los patrones de interacción y las reglas visuales para todas las visualizaciones de **CASE Algorithms**.

---

## 1. Filosofía Visual: El Laboratorio de Precisión

CASE Algorithms adopta una estética de **laboratorio de precisión técnica**:
- **Limpio y legible**: El contenido y la estructura de datos son los protagonistas; la interfaz de soporte no compite visualmente con el algoritmo.
- **Moderno y de alta fidelidad**: Gradientes sutiles, bordes nítidos de 1px, superficies con elevación calculada y micro-animaciones con significado físico.
- **Consistente**: Todas las estructuras (arrays, pilas, colas, árboles, grafos) comparten la misma semántica de estados y paleta cromática.

---

## 2. Tokens de Color (CSS Custom Properties)

La paleta se define mediante variables CSS estándar compatibles con temas claro y oscuro:

```css
:root {
  /* Surface & Backgrounds (Dark Mode First) */
  --bg-canvas: #090d16;
  --bg-surface-primary: #0f172a;
  --bg-surface-secondary: #1e293b;
  --bg-surface-tertiary: #334155;
  --bg-surface-elevated: #1e293b;

  /* Text & Content */
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --text-inverse: #0f172a;

  /* Borders & Dividers */
  --border-subtle: #1e293b;
  --border-default: #334155;
  --border-highlight: #475569;

  /* Brand Accents */
  --accent-cyan: #06b6d4;
  --accent-cyan-glow: rgba(6, 182, 212, 0.25);
  --accent-indigo: #6366f1;
  --accent-emerald: #10b981;
  --accent-amber: #f59e0b;
  --accent-rose: #f43f5e;

  /* Visualization State Tokens */
  --viz-node-default-bg: #1e293b;
  --viz-node-default-border: #475569;
  --viz-node-default-text: #f8fafc;

  --viz-node-active-bg: rgba(6, 182, 212, 0.15);
  --viz-node-active-border: #06b6d4;
  --viz-node-active-glow: 0 0 12px rgba(6, 182, 212, 0.4);

  --viz-node-comparing-bg: rgba(245, 158, 11, 0.15);
  --viz-node-comparing-border: #f59e0b;

  --viz-node-swapping-bg: rgba(244, 63, 94, 0.15);
  --viz-node-swapping-border: #f43f5e;

  --viz-node-sorted-bg: rgba(16, 185, 129, 0.15);
  --viz-node-sorted-border: #10b981;

  --viz-node-discarded-bg: #0f172a;
  --viz-node-discarded-border: #1e293b;
  --viz-node-discarded-opacity: 0.35;

  /* Pointer & Cursor Tokens */
  --pointer-low: #06b6d4;
  --pointer-mid: #f59e0b;
  --pointer-high: #a855f7;
  --pointer-target: #10b981;
  --pointer-current: #ec4899;
}
```

---

## 3. Tipografía

El sistema tipográfico combina una fuente sans-serif geométrica para la interfaz con una fuente monoespaciada de alta legibilidad para datos, código y complejidad:

| Uso | Familia Tipográfica | Fallback |
| :--- | :--- | :--- |
| **Interfaz & Títulos** | `'Inter'`, `system-ui` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` |
| **Código & Nodos** | `'JetBrains Mono'`, `'Fira Code'` | `'SFMono-Regular', Consolas, 'Liberation Mono', monospace` |

### Escala Tipográfica
- `text-xs`: `12px` / `line-height: 16px` (Etiquetas de punteros, metadata de variables)
- `text-sm`: `14px` / `line-height: 20px` (Botones de control, panel de inspección)
- `text-base`: `16px` / `line-height: 24px` (Cuerpo de texto, explicaciones didácticas)
- `text-lg`: `18px` / `line-height: 28px` (Subtítulos, nombres de métodos)
- `text-xl`: `20px` / `line-height: 28px` (Títulos de paneles)
- `text-2xl`: `24px` / `line-height: 32px` (Títulos de temas / estructuras)

---

## 4. Dimensiones y Espaciado

- **Sistema base de 4px / 8px**:
  - `--space-1`: `4px`
  - `--space-2`: `8px`
  - `--space-3`: `12px`
  - `--space-4`: `16px`
  - `--space-6`: `24px`
  - `--space-8`: `32px`
  - `--space-12`: `48px`
- **Radio de Bordes**:
  - `--radius-sm`: `4px` (Botones compactos, badges)
  - `--radius-md`: `8px` (Nodos de array, celdas de tabla, inputs)
  - `--radius-lg`: `12px` (Paneles, viewports de laboratorio, modales)
  - `--radius-full`: `9999px` (Nodos de árbol, grafos, avatares)

---

## 5. Reglas de Visualización de Nodos y Estructuras

Para evitar inconsistencias en el renderizado de diferentes módulos, se establecen dimensiones estándar:

### 5.1 Celdas de Arreglo (Array Cells)
- Tamaño: `52px` $\times$ `52px` (mínimo en mobile: `42px` $\times$ `42px`).
- Radio de borde: `8px`.
- Fuente interna: Monoespaciada, `18px`, `font-weight: 600`.
- Índice numérico: Posicionado abajo o arriba en `text-xs`, color `--text-muted`.

### 5.2 Nodos de Árboles y Grafos
- Diámetro: `48px` (círculo SVG `r="24"`).
- Bordes: Trazo de `2px`.
- Aristas (Edges): Trazo SVG de `2px`, color `--border-default` en reposo y `--accent-cyan` cuando está siendo recorrida.

### 5.3 Punteros e Indicadores
- Marcadores de punteros (`low`, `mid`, `high`, `head`, `tail`, `top`): Flecha orientada de `12px` acompañada de un badge flotante con texto en mayúsculas (`text-xs`).
- Cada puntero activo debe poseer un color contrastante exclusivo (ver tokens `--pointer-*`).

---

## 6. Animación y Curvas de Movimiento

Las animaciones deben comunicar la física y lógica del algoritmo, sin retrasar artificialmente la comprensión:

- **Transición Rápida (`150ms ease`)**: Hover en botones, feedback de clics, cambio de opacidad en paneles.
- **Transición Estándar (`300ms cubic-bezier(0.4, 0, 0.2, 1)`)**: Movimiento de punteros, inserción/eliminación de nodos en pilas y colas.
- **Transición de Intercambio / Swap (`450ms cubic-bezier(0.34, 1.56, 0.64, 1)`)**: Arcos de elevación e intercambio de posiciones en algoritmos de ordenamiento.

---

## 7. Directrices de Accesibilidad (A11y)

1. **No depender solo del color**:
   - Todo cambio de estado (ej: nodo comparado vs nodo ordenado) debe incorporar un icono, borde diferenciado o etiqueta de texto.
2. **Foco de Teclado Visible**:
   - Anillo de enfoque explícito: `outline: 2px solid var(--accent-cyan); outline-offset: 2px;`.
3. **Anuncios ARIA en Vivo**:
   - Cada transición de paso en el motor emite una descripción en lenguaje natural hacia un contenedor con `aria-live="polite"`.
