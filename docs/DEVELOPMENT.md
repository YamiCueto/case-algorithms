# CASE Algorithms — Development Guide & Engineering Standards

Esta guía establece los estándares de desarrollo, configuración del entorno local y buenas prácticas de ingeniería para **CASE Algorithms**.

---

## 1. Requisitos Previos

- **Node.js**: Versión LTS (v18.0.0 o superior, recomendada v20+).
- **Package Manager**: `npm` (v9+).
- **Git**: v2.30+ con configuración de usuario y firma opcional.

---

## 2. Configuración del Entorno Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/YamiCueto/case-algorithms.git
cd case-algorithms

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo local
npm run dev

# 4. Ejecutar la suite de pruebas unitarias
npm test

# 5. Validar tipos y linter
npm run typecheck
npm run lint
```

---

## 3. Estándares de Código y TypeScript

1. **Tipado Estricto**:
   - Prohibido el uso de `any`. Emplear tipos genéricos (`T`), uniones discriminadas o `unknown` con type guards.
   - Habilitar `strict: true`, `noImplicitReturns`, `noUnusedLocals` y `noUnusedParameters` en `tsconfig.json`.
2. **Inmutabilidad en el Motor de Pasos**:
   - Todo `ExecutionStep` debe encapsular una copia profunda o inmutable de los datos (`structuredClone` o *shallow copy* inmutable) para permitir que el viaje en el tiempo (Time-Travel) funcione sin efectos secundarios.
3. **Funciones Puras para Algoritmos**:
   - Las funciones que generan pasos de ejecución deben ser deterministas: para una misma entrada, siempre deben emitir la misma secuencia exacta de `ExecutionStep[]`.

---

## 4. Estrategia de Testing

| Nivel | Herramienta | Objetivo |
| :--- | :--- | :--- |
| **Algoritmos & Estructuras** | **Vitest** | Validar la lógica matemática, emisión correcta de pasos, métricas de comparaciones y casos límite. |
| **Componentes e Interacción** | **React Testing Library** | Probar renderizado de nodos, botones de paso a paso, atajos de teclado y anuncios ARIA. |
| **End-to-End & Performance** | **Playwright** | Verificar flujos pedagógicos completos en navegadores reales (Chromium, Firefox, WebKit). |

### Ejemplo de Test Unitario de Algoritmo

```typescript
import { describe, it, expect } from 'vitest';
import { binarySearch } from './binarySearch';

describe('binarySearch algorithm', () => {
  it('emits correct execution steps when element is found', () => {
    const array = [10, 20, 30, 40, 50, 60, 70];
    const target = 50;
    const result = binarySearch(array, target);

    expect(result.output).toBe(4);
    expect(result.steps.length).toBeGreaterThan(0);
    expect(result.steps[result.steps.length - 1].action).toBe('FOUND');
  });

  it('handles target not found correctly', () => {
    const array = [10, 20, 30];
    const result = binarySearch(array, 99);

    expect(result.output).toBe(-1);
    expect(result.steps[result.steps.length - 1].action).toBe('NOT_FOUND');
  });
});
```

---

## 5. Convención de Commits (Conventional Commits)

Todos los mensajes de commit deben seguir el estándar [Conventional Commits](https://www.conventionalcommits.org/):

```text
<tipo>(<ámbito opcional>): <descripción corta en imperativo>

[cuerpo explicativo opcional]

[referencias a issues: Closes #123]
```

### Tipos Permitidos
- `feat`: Nueva característica o módulo interactivo.
- `fix`: Corrección de un error o bug en la visualización/algoritmo.
- `docs`: Cambios en la documentación del repositorio.
- `refactor`: Refactorización de código sin cambio funcional.
- `test`: Adición o modificación de pruebas automatizadas.
- `chore`: Tareas de mantenimiento, dependencias o configuración de build.
- `a11y`: Mejoras específicas en accesibilidad.

*Ejemplo*:
```text
feat(stack): add LIFO step visualizer and interactive sandbox

Closes #12
```
