# CASE Algorithms — Learning Architecture & Pedagogical Framework

Este documento describe el modelo pedagógico de 10 pasos que estructura cada experiencia formativa en **CASE Algorithms**.

---

## 1. El Framework Pedagógico de 10 Pasos

Para garantizar que el aprendizaje sea activo, intuitivo y riguroso, todo tema, estructura de datos o algoritmo debe implementarse siguiendo esta secuencia:

```text
01. Discover
     │
     ▼
02. Interact
     │
     ▼
03. Observe
     │
     ▼
04. Explain
     │
     ▼
05. Visualize Algorithm
     │
     ▼
06. Read Pseudocode
     │
     ▼
07. See Implementation
     │
     ▼
08. Modify
     │
     ▼
09. Practice
     │
     ▼
10. Challenge
```

---

## 2. Detalle de Cada Fase

### 01. Discover (Descubrimiento Inicial)
- **Objetivo**: Despertar la curiosidad mediante un escenario visual en estado vivo, sin abrumar con definiciones formales o fórmulas matemáticas.
- **Formato**: Un lienzo interactivo con una pregunta detonante o invitación a la acción.
- *Ejemplo*: *"Aquí tienes una pila vacía. Prueba agregando tres elementos con el botón `Push`."*

### 02. Interact (Interacción Libre)
- **Objetivo**: Permitir que el usuario manipule directamente los datos, modifique entradas o ejecute acciones básicas.
- **Formato**: Botones de acción directa (`Push`, `Pop`, `Insert`, `Delete`, `Search`), controles deslizantes y campos numéricos.
- *Ejemplo*: El usuario hace clic en `Push(10)`, `Push(20)` y `Push(30)`.

### 03. Observe (Observación de Patrones)
- **Objetivo**: Guiar la atención del usuario hacia la invariante estructural o comportamiento clave.
- **Formato**: Animaciones con resaltado contextual y mensajes breves de estado.
- *Ejemplo*: Al pulsar `Pop()`, el elemento `30` es el primero en salir. El sistema pregunta: *"¿Por qué salió el 30 si fue el último que agregaste?"*

### 04. Explain (Formalización del Concepto)
- **Objetivo**: Consolidar la intuición empírica en una definición teórica sólida.
- **Formato**: Explicación concisa, diagramas conceptuales, términos técnicos (LIFO, FIFO, árbol balanceado, pivote, puntero) y analogías del mundo real.
- *Ejemplo*: *"Una Pila (Stack) es una estructura de datos basada en el principio **LIFO** (Last In, First Out)..."*

### 05. Visualize Algorithm (Visualización Paso a Paso)
- **Objetivo**: Mostrar el algoritmo en cámara lenta, permitiendo avanzar y retroceder en cada instrucción atómica.
- **Formato**: Barra de control temporal (`Play`, `Pause`, `Step Forward`, `Step Backward`, `Speed`), punteros visuales (`left`, `right`, `mid`, `current`) y variables locales expuestas.

### 06. Read Pseudocode (Lectura de Pseudocódigo)
- **Objetivo**: Comprender la lógica independiente del lenguaje de programación.
- **Formato**: Pseudocódigo limpio con resaltado de la línea exacta que se está ejecutando en el paso actual.

### 07. See Implementation (Implementación en Código Real)
- **Objetivo**: Conectar la abstracción con código de producción en TypeScript y JavaScript.
- **Formato**: Editor de código estilizado, clases/funciones bien documentadas con tipos e interfaces TypeScript.

### 08. Modify (Experimentación y Modificación)
- **Objetivo**: Modificar variables, arrays de entrada o condiciones de borde para ver cómo reacciona el algoritmo.
- **Formato**: Inputs personalizables (*Custom Array*, *Target Value*, *Tree Node Insertions*).

### 09. Practice (Validación Rápida)
- **Objetivo**: Evaluar la retención y comprensión inmediata con retroalimentación instantánea.
- **Formato**: Retos predictivos tipo *"¿Cuál será el valor de `mid` en la siguiente iteración?"* o *"¿En qué orden se visitarán los nodos en este recorrido in-order?"*.

### 10. Challenge (Reto Algorítmico)
- **Objetivo**: Aplicar la estructura o algoritmo para resolver un problema computacional real.
- **Formato**: Mini-ejercicio con suite de tests visibles para verificar la solución (e.g. *Validar paréntesis balanceados usando una Stack*).

---

## 3. Casos de Estudio y Ejemplos

### Caso A: Estructura de Datos — Stack (Pila)

| Fase | Acción en la Plataforma |
| :--- | :--- |
| **01. Discover** | Muestra un contenedor vertical vacío con el puntero `TOP` en la base. |
| **02. Interact** | Usuario agrega `10`, luego `20`, luego `30`. |
| **03. Observe** | El usuario pulsa `Pop()` y sale el `30`. Descubre que solo el elemento superior es accesible. |
| **04. Explain** | Define formalmente la Pila, operaciones $O(1)$ (`push`, `pop`, `peek`) y principio LIFO. |
| **05. Visualize** | Animación de apilado y desapilado con cambio dinámico de tamaño y puntero `top`. |
| **06. Pseudocode** | Bloque con métodos `push(item)`, `pop()`, `isEmpty()`. |
| **07. Code** | Implementación tipada `class Stack<T> { ... }` en TypeScript. |
| **08. Modify** | Permite cambiar la capacidad máxima de la pila para experimentar el *Stack Overflow*. |
| **09. Practice** | *"Dada la secuencia push(A), push(B), pop(), push(C), ¿cuál es el estado de la pila?"* |
| **10. Challenge** | Implementar la función `isBalanced(s: string): boolean` para validar `({[]})`. |

---

### Caso B: Algoritmo — Binary Search (Búsqueda Binaria)

| Fase | Acción en la Plataforma |
| :--- | :--- |
| **01. Discover** | Un arreglo ordenado de 16 elementos ocultos tras tarjetas numeradas. Objetivo: adivinar el número en menos de 4 intentos. |
| **02. Interact** | El usuario hace clic en el elemento central. El sistema indica si el objetivo es mayor o menor. |
| **03. Observe** | El usuario nota que descartar la mitad en cada paso reduce exponencialmente las opciones. |
| **04. Explain** | Explicación del paradigma *Divide y Vencerás* y complejidad $O(\log n)$ vs $O(n)$. |
| **05. Visualize** | Visualización de punteros `low`, `mid`, `high` con sombreado de rangos descartados. |
| **06. Pseudocode** | `while low <= high: mid = floor((low + high)/2) ...` con línea activa. |
| **07. Code** | Función TypeScript `function binarySearch(arr: number[], target: number): number`. |
| **08. Modify** | El usuario ingresa un array desordenado para experimentar por qué Binary Search falla si no hay orden previo. |
| **09. Practice** | Predecir los valores de `low`, `high` y `mid` tras 2 pasos en un array dado. |
| **10. Challenge** | Encontrar el primer y último índice de un número repetido en $O(\log n)$. |
