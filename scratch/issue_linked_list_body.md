## 🎯 Objetivo

Implementar la Vertical Slice completa de la estructura de datos **Singly Linked List (Lista Simplemente Enlazada)** como parte de la expansión de laboratorios de `v0.2 — Data Structures Expansion & Laboratory Harmonization`.

El laboratorio debe proporcionar una experiencia interactiva y visual donde los nodos no se presenten como un bloque de memoria contiguo (array), sino como nodos dispersos vinculados mediante punteros dirigidos (`next`) que terminan en un nodo de terminación `NULL`.

---

## 🏛️ Arquitectura & Alcance

### 1. Dominio Puro (`src/core/`)
- `src/core/data-structures/linked-list.ts`:
  - Definición inmutable de `LinkedListNodeState` (`id`, `value`, `nextId`, `index`).
  - Contrato inmutable `LinkedListState` (`nodes: readonly LinkedListNodeState[]`, `headId: string | null`, `tailId: string | null`, `size: number`, `activeNodeId?: string`, `highlightedEdgeId?: string`, `phaseDescription: string`).
  - Clase genérica pura `SinglyLinkedList<T>` con punteros `head` y `tail`.
- `src/core/algorithms/linked-list-operations.ts`:
  - Simulador determinista `simulateLinkedListOperations` con comandos (`PREPEND`, `APPEND`, `INSERT_AT`, `REMOVE_AT`, `FIND`, `CLEAR`).
  - Generación de trazas `ExecutionStep<LinkedListState>[]` con sincronización de líneas en `CodeViewer` (`codeHighlight.pseudocodeLine`, `codeHighlight.typescriptLine`) y narrativa accesible `a11yMessage`.

### 2. Rigor Pedagógico de Complejidad Temporal y Espacial
- **Acceso por Posición**: $\mathcal{O}(n)$ debido a la necesidad de recorrer secuencialmente desde `head`.
- **Búsqueda por Valor**: $\mathcal{O}(n)$ en el peor y caso promedio.
- **Prepend (Inserción en Cabeza)**: $\mathcal{O}(1)$ actualización de puntero `newNode.next = head; head = newNode`.
- **Append (Inserción en Cola)**: $\mathcal{O}(1)$ con referencia `tail` activa (`tail.next = newNode; tail = newNode`).
- **Inserción / Eliminación en posición intermedia**: $\mathcal{O}(n)$ para localizar el nodo previo + $\mathcal{O}(1)$ para reconectar enlaces (`prev.next = curr.next`).
- **Memoria Auxiliar**: $\mathcal{O}(n)$ para almacenar los $n$ nodos y sus referencias de puntero.

### 3. Adaptador Visual SVG (`src/components/visualizer/adapters/LinkedListVisualizerAdapter.tsx`)
- Nodos renderizados mediante `VisualNode` (mostrando valor y sublabel `[index]`).
- Enlaces dirigidos mediante `VisualEdge` (`isDirected: true` con punta de flecha).
- Puntero `HEAD` (cian superior) y puntero `TAIL` (ámbar superior).
- Puntero dinámico `CURR` / `SEARCH` durante recorridos paso a paso.
- Nodo terminal canónico `NULL` (gris/muted) al final de la lista.
- Highlights semánticos para nodo visitado (`comparing`), nodo reconectado (`swapping`) y nodo encontrado (`sorted`).

### 4. Módulo de Laboratorio (`src/modules/linked-list-lab/LinkedListLab.tsx`)
- Panel de operaciones interactivas con entradas para `Value` e `Index`.
- Botones: `Prepend`, `Append`, `Insert At`, `Remove At`, `Find`, `Clear`.
- Presets demostrativos (`Standard Sequence`, `Prepend & Append Mix`, `Middle Insertion & Deletion`, `Search Demo`).
- Inspector de estado y enlaces (`HEAD Node`, `TAIL Node`, `Size`, `Action Badge`, `Status`).
- Experiencia pedagógica de 10 dimensiones armonizada con `PedagogicalKnowledgePanel` y `CodeViewer`.
- Accesibilidad con `A11yAnnouncer` (`aria-live="polite"`) y navegación global por teclado con `useTimeTravelKeyboard`.

---

## ✅ Criterios de Aceptación (Definition of Done)

- [ ] `src/core/` 100% puro TypeScript sin dependencias de React, DOM o CSS.
- [ ] Cero comentarios (`//`, `/* */`) y cero estilos inline (`style={{`) en código.
- [ ] `npm run typecheck` pasando con 0 errores.
- [ ] `npm run lint` pasando con 0 warnings.
- [ ] `npm run test:run` pasando al 100% en todas las suites (unitarios + integración).
- [ ] `npm run build` compilando exitosamente.
- [ ] Auditoría visual Playwright en Chromium real en 4 viewports ($1440\times 900$, $1280\times 720$, $768\times 1024$, $390\times 844$).
- [ ] Verificación de no regresión en `ArrayLab`, `StackLab` y `QueueLab`.
