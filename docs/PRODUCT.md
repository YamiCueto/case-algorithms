# CASE Algorithms — Product Specification & Experience Model

Este documento define la especificación funcional, los patrones de experiencia de usuario (UX) y los criterios de calidad que gobiernan cada módulo en **CASE Algorithms**.

---

## 1. Anatomía de un Módulo Interactivo

Cada tema o algoritmo dentro de la plataforma se compone de una vista interactiva de laboratorio que integra visualización dinámica, controles temporales, inspección de estado, código sincronizado y retos prácticos.

### 1.1 Wireframe Conceptual del Laboratorio

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│  CASE ALGORITHMS  /  Data Structures  /  Stack (LIFO)                        │
├──────────────────────────────────────┬───────────────────────────────────────┤
│                                      │                                       │
│  [ INTERACTIVE LAB VIEWPORT ]        │  [ CONTROL PANEL & INSPECTION ]       │
│                                      │                                       │
│  ┌────────────────────────────────┐  │  Interactive Sandbox:                 │
│  │                                │  │  Value: [ 42 ]   [ Push ]   [ Pop ]   │
│  │   ┌────────────────────────┐   │  │  [ Peek ]  [ Clear ]  [ Randomize ]   │
│  │   │          42            │   │  │                                       │
│  │   ├────────────────────────┤   │  │  Execution Controls:                  │
│  │   │          18            │   │  │  [ |< ] [ < Step ] [ Play ] [ Step > ]│
│  │   ├────────────────────────┤   │  │  Speed: [ ───●────── ] (1.0x)         │
│  │   │          07            │   │  │                                       │
│  │   └────────────────────────┘   │  │  State Inspector:                     │
│  │               ▲                │  │  - size: 3                            │
│  │             (TOP)              │  │  - isEmpty: false                     │
│  │                                │  │  - lastAction: "push(42)"             │
│  └────────────────────────────────┘  │                                       │
│                                      │  Didactic Guidance:                   │
│  Live status / narration text:       │  "¿Qué ocurre si extraemos un dato?   │
│  "Pushed 42 to the top of stack."    │   ¿Cuál saldrá primero?"              │
│                                      │                                       │
├──────────────────────────────────────┴───────────────────────────────────────┤
│  [ MULTI-DIMENSIONAL KNOWLEDGE TABS ]                                        │
│  [ How It Works ]  [ Pseudocode ]  [ TypeScript ]  [ Complexity ]  [ Practice ] │
│                                                                              │
│  class Stack<T> {                                                            │
│    private items: T[] = [];                                                  │
│    push(element: T): void { this.items.push(element); }                      │
│    pop(): T | undefined { return this.items.pop(); }                         │
│  }                                                                           │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Los 5 Pilares de la Experiencia (UX Model)

1. **Laboratorio Inmediato (Sandbox First)**:
   El usuario entra directamente a interactuar con controles visuales. No hay modales bloqueantes ni bloques de texto kilométricos antes del canvas.
2. **Control Temporal Bidireccional (Time-Travel Debugger)**:
   Todo algoritmo o mutación de estructura de datos genera un historial de estados inmutables (`ExecutionStep[]`). El usuario puede avanzar, retroceder, pausar o reproducir a velocidad variable.
3. **Resaltado Sincronizado de Código (Step-to-Code Sync)**:
   Al ejecutar el paso $N$, se resalta exactamente la línea correspondiente en el pseudocódigo y en la implementación TypeScript.
4. **Inspección de Estado Transparente**:
   Las variables internas, punteros (`low`, `mid`, `high`, `head`, `tail`, `top`), índices y memoria virtual se visualizan con etiquetas flotantes e indicadores semánticos.
5. **Accesibilidad y Comunicación Multimodal**:
   Cada paso no solo emite cambios visuales de color o posición, sino también mensajes auditables y aria-live regions para usuarios con lectores de pantalla o navegación exclusiva por teclado.

---

## 3. Definition of Done (DoD)

Para que cualquier estructura de datos, algoritmo o componente se considere terminado y apto para merge a `main`, **debe cumplir obligatoriamente los 16 criterios de la Definition of Done**:

### Calidad de Software e Ingeniería
- [ ] **1. Implementación Canónica**: Código tipado en TypeScript, limpio, modular y con tipado estricto (`noImplicitAny`, etc.).
- [ ] **2. Separación de Responsabilidades**: El algoritmo/estructura genera un flujo de `ExecutionStep[]` puro, completamente desacoplado del renderizador gráfico.
- [ ] **3. Pruebas Unitarias**: Suite de tests en Vitest cubriendo casos base, casos límite (*empty state*, *single element*, *overflow*, *not found*).
- [ ] **4. Responsive & Cross-Browser**: Adaptado a pantallas de escritorio, tablets y móviles sin pérdida de legibilidad.

### Experiencia y Pedagogía
- [ ] **5. Cumplimiento del Framework de 10 Pasos**: Estructura de aprendizaje alineada con `LEARNING.md`.
- [ ] **6. Visualización Interactiva**: Representación gráfica clara mediante SVG/Canvas/React Flow respetando `DESIGN_SYSTEM.md`.
- [ ] **7. Ejecución Paso a Paso**: Capacidad de reproducir, pausar, avanzar y retroceder en el tiempo.
- [ ] **8. Sincronización con Código**: Resaltado sincronizado entre el paso visual y el código (Pseudocódigo + TypeScript).
- [ ] **9. Análisis de Complejidad**: Desglose claro de complejidad temporal ($O$) en el mejor, promedio y peor caso, y complejidad espacial ($O$).
- [ ] **10. Modo Práctica / Reto**: Al menos un reto interactivo o pregunta de validación intuitiva.

### Accesibilidad (A11y)
- [ ] **11. Soporte de Teclado Completo**: Todos los controles del laboratorio y pasos son operables mediante teclado (`Tab`, `Space`, `Enter`, flechas direccionales).
- [ ] **12. Regiones ARIA en Vivo**: Emisión de anuncios semánticos (`aria-live="polite"`, `role="status"`) en cada transición de paso.
- [ ] **13. Contraste de Color**: Cumplimiento del estándar WCAG 2.1 AA (contraste mínimo 4.5:1 para texto normal, 3:1 para controles y gráficos).

### Gobernanza y Trazabilidad en Git
- [ ] **14. Issue Vinculada**: El trabajo cuenta con una Issue previa aprobada con etiquetas y descripción clara.
- [ ] **15. Branch & Commits Semánticos**: Trabajo desarrollado en `feature/*` o `fix/*` con commits bajo la convención *Conventional Commits*.
- [ ] **16. Pull Request & CI Verde**: PR revisado, con evidencia visual (grabación o capturas), CI pasando sin errores y fusionado sin commits directos en `main`.
