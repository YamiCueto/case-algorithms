<div align="center">

# CASE Algorithms

### *Learn algorithms by seeing them.*

An interactive laboratory for understanding data structures and algorithms through visualization, experimentation, and code.

[![CI](https://github.com/YamiCueto/case-algorithms/actions/workflows/ci.yml/badge.svg)](https://github.com/YamiCueto/case-algorithms/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?logo=react&logoColor=black)](https://react.dev/)

---

</div>

## 💡 Filosofía: Entender antes de memorizar

> *Si el usuario puede descubrir el concepto interactuando con él, no deberíamos obligarlo a leer una explicación primero.*

**CASE Algorithms** transforma el estudio de estructuras de datos y algoritmos de una lectura teórica pasiva a una **experiencia de laboratorio experimental**. No memorices pseudocódigo abstracto: manipula los datos en vivo, observa cómo emergen los patrones, descubre las invariantes y valida tu intuición con código real.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  Binary Search Laboratory                                                   │
│                                                                             │
│  Encuentra un elemento dividiendo el espacio de búsqueda a la mitad.        │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │   10    20    30    40    50    60    70    80                      │  │
│  │                     ▲                                                 │  │
│  │                   [MID]                                               │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Target: [ 60 ]          40 < 60  ──▶  Descartar mitad izquierda             │
│  Controles: [ |< ] [ < Step ] [ Play ] [ Step > ]                           │
│                                                                             │
│  ¿Qué crees que ocurrirá con los punteros en la siguiente iteración?        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Qué encontrarás en CASE Algorithms

- 🧪 **Laboratorio Interactivo Inmediato**: Manipulación directa de estructuras y parámetros sin barreras teóricas iniciales.
- ⏪ **Viaje en el Tiempo (Time-Travel Debugger)**: Avanza, retrocede y reproduce el algoritmo paso a paso con inspección de estado en cada instante.
- 🎯 **Sincronización de Código en Vivo**: Resaltado simultáneo entre el paso visual, el pseudocódigo y la implementación en TypeScript.
- ♿ **Accesibilidad de Primer Nivel (A11y)**: Narración semántica en tiempo real (`aria-live`), soporte total para lectores de pantalla y navegación por teclado.
- 📊 **Análisis de Complejidad Dinámica**: Métricas de comparaciones, swaps e intuición matemática para el mejor, promedio y peor caso ($O$).
- 🧩 **Retos y Validación Predictiva**: Ejercicios interactivos para anticipar el siguiente estado y desafíos de programación con suites de prueba.

---

## 🧭 Arquitectura Pedagógica (El Framework de 10 Pasos)

Cada módulo sigue un flujo sistemático diseñado para maximizar la comprensión profunda:

```text
01. Discover  ──▶  02. Interact  ──▶  03. Observe  ──▶  04. Explain  ──▶  05. Visualize
                                                                                 │
10. Challenge ◀──  09. Practice  ◀──  08. Modify   ◀──  07. Code     ◀──  06. Pseudocode
```

1. **Discover**: Estado interactivo inicial para despertar la curiosidad sin spoilers teóricos.
2. **Interact**: Botones y controles para manipular datos directamente.
3. **Observe**: Resaltado visual de patrones y descubrimiento intuitivo de la regla (ej. LIFO en una Pila).
4. **Explain**: Formalización del concepto, definiciones rigurosas y complejidad asintótica.
5. **Visualize**: Animación determinista paso a paso con punteros semánticos.
6. **Read Pseudocode**: Comprensión algorítmica independiente del lenguaje.
7. **See Implementation**: Código fuente canónico en TypeScript tipado.
8. **Modify**: Modificación de datos y condiciones de borde para ver fallos y límites.
9. **Practice**: Preguntas predictivas de selección e inferencia de estados futuros.
10. **Challenge**: Problemas computacionales aplicados con validación de tests automatizados.

---

## 📚 Centro de Documentación de Ingeniería

El proyecto cuenta con especificaciones completas para cada dimensión del sistema:

| Documento | Descripción |
| :--- | :--- |
| 📖 [**VISION.md**](docs/VISION.md) | Manifiesto, misión, principios pedagógicos y ecosistema CASE. |
| 📋 [**PRODUCT.md**](docs/PRODUCT.md) | Especificación de producto, experiencia de usuario y **Definition of Done (16 puntos)**. |
| 🎓 [**LEARNING.md**](docs/LEARNING.md) | Guía detallada del Framework de 10 Pasos con casos de estudio (Stack, Binary Search). |
| 🎨 [**DESIGN_SYSTEM.md**](docs/DESIGN_SYSTEM.md) | Tokens CSS, paleta de colores de laboratorio, tipografía y reglas visuales. |
| 🏛️ [**ARCHITECTURE.md**](docs/ARCHITECTURE.md) | Arquitectura desacoplada (*Engine* $\to$ `ExecutionStep[]` $\to$ *Renderer*), tipos y A11y. |
| 🛠️ [**DEVELOPMENT.md**](docs/DEVELOPMENT.md) | Setup local, comandos de desarrollo, testing con Vitest y estándares de código. |
| 🤝 [**CONTRIBUTING.md**](docs/CONTRIBUTING.md) | Flujo Git, estrategia de ramas (`feature/*`, `fix/*`), PRs y ciclo de vida. |
| 🚀 [**SPRINT_1_BACKLOG.md**](docs/SPRINT_1_BACKLOG.md) | Especificación de las primeras 6 Issues para el hito `v0.1 — First Learning Experience`. |

---

## 🛠️ Stack Tecnológico (100% Client-Side en v0)

CASE Algorithms ejecuta toda su lógica, generación de pasos y renderizado en el navegador sin dependencias de backend:

- **Core & Runtime**: React 18+, TypeScript (Strict Mode), Vite.
- **Visualización**: SVG declarativo / HTML5 Canvas / React Flow.
- **Estilos**: CSS nativo con Tokens de Diseño (`docs/DESIGN_SYSTEM.md`).
- **Editor de Código**: Monaco Editor / PrismJS.
- **Testing**: Vitest, React Testing Library, Playwright.
- **CI/CD**: GitHub Actions con despliegue en GitHub Pages.

---

## 🌿 Flujo de Trabajo en Git y Trazabilidad

Seguimos una política estricta de aislamiento de cambios y trazabilidad de ingeniería:

```text
main (producción)
 │
 └── feature/xxx (o fix/xxx)
      │
      ├── Commits Semánticos (Conventional Commits)
      ├── Pruebas Automatizadas (Vitest)
      └── Pull Request vinculando Issue (Closes #123)
           │
           ▼ Revisión de Código & CI Verde
           │
      Merge en main ──▶ Auto-cierre de Issue
```

### Prefijos de Ramas
- `feature/*`: Nuevas características o módulos de aprendizaje.
- `fix/*`: Corrección de errores algorítmicos o visuales.
- `docs/*`: Mejoras en la documentación.
- `refactor/*`: Mejoras internas de código sin alteración funcional.
- `test/*`: Adición o refactorización de tests.
- `chore/*`: Tareas de build, dependencias o configuración.

---

## 🎯 Hoja de Ruta de Milestones

```text
[v0.1] First Learning Experience ──▶ Scaffolding, Core Engine & Array/Stack Laboratory (Vertical Slice)
  │
[v0.2] Core Data Structures      ──▶ Queue, Singly/Doubly Linked Lists, Hash Tables
  │
[v0.3] Searching & Sorting       ──▶ Linear/Binary Search, Bubble, Insertion, Merge, Quick Sort
  │
[v0.4] Trees & Hierarchies       ──▶ Binary Trees, BST, AVL Trees, Heaps, Tries
  │
[v0.5] Graph Algorithms          ──▶ BFS, DFS, Dijkstra, Topo Sort, A*
  │
[v1.0] CASE Algorithms Platform  ──▶ Playground interactivo con Monaco Editor, Retos & Multi-idioma
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia [MIT](LICENSE).
