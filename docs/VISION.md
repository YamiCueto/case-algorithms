# CASE Algorithms — Product Vision & Manifesto

> **Learn algorithms by seeing them.**  
> An interactive laboratory for understanding data structures and algorithms through visualization, experimentation, and code.

---

## 1. Declaración de Misión

Aprender algoritmos y estructuras de datos no debería ser un ejercicio de memorización pasiva o lectura de pseudocódigo abstracto. El conocimiento profundo surge cuando una persona puede **tocar el algoritmo**, cambiar sus parámetros, observar qué ocurre paso a paso y formular hipótesis que el propio sistema le ayuda a validar en tiempo real.

**CASE Algorithms** nace para ser un **laboratorio interactivo de algoritmos**: un entorno donde el usuario no empieza leyendo una lección teórica, sino interactuando con un modelo vivo.

---

## 2. Principios Fundamentales

### I. Entender antes de memorizar (*Understand before memorizing*)
Cualquier concepto puede memorizarse para pasar un examen o una entrevista técnica; pero solo se domina cuando se comprende el modelo mental subyacente. Cada experiencia en CASE Algorithms prioriza la construcción del modelo intuitivo antes de formalizar la sintaxis o la complejidad temporal/espacial.

### II. Descubrimiento guiado por interacción
> *Si el usuario puede descubrir el concepto interactuando con él, no deberíamos obligarlo a leer una explicación primero.*

La secuencia natural de aprendizaje es:
1. Experimentar con un estado visual.
2. Descubrir la regla o invariante por causa y efecto.
3. Consolidar el conocimiento con la explicación formal y el código.

### III. El algoritmo como máquina de estados observable
Un algoritmo es una secuencia determinista de transiciones de estado. CASE Algorithms expone esas transiciones de forma granular, bidireccional (avanzar y retroceder en el tiempo) y con inspección semántica de cada variable y puntero.

### IV. Rigor de ingeniería y accesibilidad universal
El diseño visual sofisticado no debe comprometer la accesibilidad ni el rigor técnico. La semántica accesible (teclado, lectores de pantalla, contrastes altos) y el código tipado limpio son ciudadanos de primera clase desde el primer commit.

---

## 3. Personalidad del Producto

CASE Algorithms no es una enciclopedia pasiva de informática ni un blog con GIFs animados. Es un **laboratorio de algoritmos**.

| Característica | Lo que SOMOS | Lo que NO somos |
| :--- | :--- | :--- |
| **Tono** | Técnico, didáctico, preciso y experimental. | Académico aburrido, informal en exceso o superficial. |
| **Experiencia** | "A ver qué pasa si cambio este valor..." | "Lee estos 5 párrafos antes de ver qué hace." |
| **Visuales** | Diagramas limpios, tokens de diseño de precisión, animaciones con significado. | Efectos visuales distractores o adornos sin valor pedagógico. |
| **Código** | Código de producción limpio en TypeScript / JavaScript con playgrounds ejecutables. | Snippets rotos o pseudocódigo incompleto sin posibilidad de prueba. |

---

## 4. Audiencia y Casos de Uso

1. **Estudiantes de Computación e Ingeniería**:
   - Comprensión intuitiva de estructuras de datos (listas, pilas, colas, árboles, grafos) y algoritmos clásicos (búsqueda, ordenamiento, programación dinámica).
2. **Desarrolladores en preparación técnica**:
   - Dominio de patrones algorítmicos (Two Pointers, Sliding Window, BFS/DFS, Memoization) para entrevistas y resolución de problemas complejos.
3. **Docentes y Mentores**:
   - Herramienta visual interactiva para proyectar y manipular algoritmos paso a paso durante clases y talleres.
4. **Curiosos y entusiastas de la ingeniería de software**:
   - Exploración visual de la elegancia matemática detrás del cómputo.

---

## 5. El Ecosistema CASE

CASE Algorithms se concibe como el pilar fundamental del ecosistema **CASE**:

```
                  ┌──────────────────────┐
                  │   CASE Algorithms    │ (Laboratorio interactivo de algoritmos)
                  └──────────┬───────────┘
                             │
            ┌────────────────┼────────────────┐
            ▼                                 ▼
┌──────────────────────┐            ┌──────────────────────┐
│     CASE Academy     │            │     CASE Cortex      │
│ (Rutas de formación) │            │ (Motor de retos & AI)│
└──────────────────────┘            └──────────────────────┘
```

---

## 6. Hoja de Ruta de Milestones

- **`v0.1 — First Learning Experience`**: Scaffolding, Design System, Motor de ejecución desacoplado y la primera experiencia vertical completa (Array & Stack Interactive Laboratory).
- **`v0.2 — Core Data Structures`**: Queue, Linked List, Doubly Linked List, Hash Table.
- **`v0.3 — Searching & Sorting Engine`**: Linear Search, Binary Search, Bubble Sort, Insertion Sort, Merge Sort, Quick Sort con comparación lado a lado.
- **`v0.4 — Trees & Hierarchical Structures`**: Binary Tree, Binary Search Tree (BST), AVL Tree, Trie.
- **`v0.5 — Graph Algorithms & Traversals`**: Graph representations (Adjacency Matrix / List), BFS, DFS, Dijkstra, A*.
- **`v1.0 — CASE Algorithms Platform`**: Playground completo con editor de código en vivo (Monaco), retos interactivos, importación/exportación de estados y soporte multilingüe.
