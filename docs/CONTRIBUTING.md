# CASE Algorithms — Contributing & Git Workflow Guide

¡Gracias por tu interés en contribuir a **CASE Algorithms**! Este documento detalla el flujo de trabajo en Git, la estrategia de ramificación y el ciclo de vida completo de cada contribución.

---

## 1. El Ciclo de Vida de una Contribución

Todo cambio en el proyecto debe tener trazabilidad completa desde la idea inicial hasta su integración en producción:

```text
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ GitHub Issue │ ──▶  │ Feature      │ ──▶  │ Commits      │
│ (Aprobada)   │      │ Branch       │      │ Semánticos   │
└──────────────┘      └──────────────┘      └──────────────┘
                                                    │
                                                    ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ Issue        │ ◀──  │ Merge en     │ ◀──  │ Pull Request │
│ Cerrada      │      │ main         │      │ (CI Verde)   │
└──────────────┘      └──────────────┘      └──────────────┘
```

---

## 2. Estrategia de Ramas (Branching Strategy)

La rama `main` representa el código estable y listo para producción. **Nunca se realizan commits directamente en `main`**.

### Prefijos de Rama Autorizados
- `feature/<nombre-descriptivo>`: Nuevos módulos, algoritmos o componentes visuales.  
  *Ejemplo*: `feature/stack-interactive-lab`, `feature/binary-search-engine`.
- `fix/<nombre-descriptivo>`: Corrección de errores en algoritmos o interfaz.  
  *Ejemplo*: `fix/tree-node-overlap`, `fix/pointer-off-by-one`.
- `docs/<nombre-descriptivo>`: Actualizaciones o adiciones a la documentación.  
  *Ejemplo*: `docs/a11y-guidelines`.
- `refactor/<nombre-descriptivo>`: Reestructuración de código sin alterar comportamiento.  
  *Ejemplo*: `refactor/step-history-controller`.
- `test/<nombre-descriptivo>`: Nuevas pruebas o mejoras en la cobertura.  
  *Ejemplo*: `test/sorting-edge-cases`.
- `chore/<nombre-descriptivo>`: Mantenimiento de dependencias o configuración de build.  
  *Ejemplo*: `chore/update-vite-config`.

---

## 3. Flujo Paso a Paso para Colaborar

### Paso 1: Seleccionar o Crear una Issue
1. Revisa las [Issues abiertas](https://github.com/YamiCueto/case-algorithms/issues) o el [Project Board](https://github.com/YamiCueto/case-algorithms/projects).
2. Si vas a proponer un nuevo módulo, utiliza la plantilla `Topic Proposal` o `Feature Request`.
3. Espera la asignación o aprobación antes de comenzar a codificar.

### Paso 2: Crear una Rama de Trabajo
Asegúrate de estar en `main` actualizado:
```bash
git checkout main
git pull origin main
git checkout -b feature/array-visualization-engine
```

### Paso 3: Desarrollar y Realizar Commits Semánticos
Realiza commits atómicos siguiendo la convención [Conventional Commits](https://www.conventionalcommits.org/):
```bash
git commit -m "feat(array): implement insertion step generator"
git commit -m "test(array): add tests for array bounds and empty states"
```

### Paso 4: Ejecutar Verificaciones Locales
Antes de abrir el Pull Request, verifica que todo pase localmente:
```bash
npm run typecheck
npm run lint
npm test
```

### Paso 5: Abrir el Pull Request (PR)
1. Haz push de tu rama a GitHub:
   ```bash
   git push origin feature/array-visualization-engine
   ```
2. Abre un Pull Request contra la rama `main`.
3. Completa la plantilla de PR obligatoria:
   - Vincula la Issue relacionada usando palabras clave de GitHub (ej: `Closes #12`).
   - Adjunta capturas o una grabación WebP/GIF demostrando la interacción visual en el navegador.
   - Marca todos los ítems de la **Definition of Done** aplicables.

### Paso 6: Revisión de Código y Merge
- El flujo de CI ejecutará automáticamente las pruebas, linter y comprobación de tipos.
- Tras recibir la aprobación de revisión de código y con CI en verde, el PR se integrará mediante *Squash and Merge* o *Rebase and Merge*.
- La Issue vinculada se cerrará automáticamente.
