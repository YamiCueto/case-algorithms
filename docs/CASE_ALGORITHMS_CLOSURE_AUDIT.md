# CASE Algorithms — auditoría de cierre

Fecha: 2026-10-23, America/Bogota. Rama `main`; HEAD `9062d2a6ff857c9db876b5cfb358d56f2e34a53e`.

## 1. Dictamen y alcance

El proyecto funciona y supera sus comprobaciones locales, pero **todavía no cumple los criterios de cierre**: hay contenido fuera del lienzo, internacionalización incompleta y divergencias pedagógicas. No se modificó código de aplicación, motor, dependencias npm, historial Git ni remoto.

| Área | Resultado actual |
|---|---|
| Graphify MCP local | Operativo mediante cliente MCP stdio; registrado en Codex. La exposición directa en esta conversación sigue pendiente de recargar la sesión. |
| Grafo | Generado y consultado; cobertura AST útil pero parcial, con exclusiones y límites documentados. |
| TypeScript / ESLint | Ambos pasan, código de salida 0. |
| Vitest | 31 archivos, 286 pruebas pasan. |
| Playwright | 37 pruebas pasan en Chromium, 55,6 s. |
| Producción local | Build pasa; JS de 760,33 kB, gzip 193,92 kB; advertencia de chunk >500 kB. |
| GitHub Pages | Workflow y despliegue del HEAD con éxito, consultados hoy; ejecución remota del 24 de septiembre, no una validación funcional nueva en producción. |

Reconocimiento: raíz confirmada por `git rev-parse --show-toplevel`; árbol limpio al comenzar. No había AGENTS.md aplicable en raíz, ancestros comprobados ni subdirectorios de fuentes/pruebas/docs. Existen skills en `.agents/skills`; no se invocaron rediseños ni agentes paralelos. La configuración MCP local tenía `node_repl` y `filesystem`; se añadió `case_graphify` preservándolos.

## 2. Instalación y conexión MCP

Instalación aislada en `scratch/graphify-venv`, ya excluido por Git. Python de shell: 3.14.6; Python seleccionado por uv para el entorno: 3.11.16; uv 0.12.7; Node 24.19.0. Instalados `graphifyy==0.9.94` y `mcp==2.3.0`, sin dependencias nuevas de aplicación.

Se verificaron la documentación oficial, el help del ejecutable y el código instalado antes de usar argumentos. La distribución se llama `graphifyy`; sus ejecutables son `graphify` y `graphify-mcp`. El registro stdio usa el ejecutable absoluto del entorno y `--graph` con la ruta absoluta del JSON. Esas rutas personales están únicamente en la configuración local de Codex. `GRAPHIFY_QUERY_LOG_DISABLE=1` evita logs globales de consultas.

Fuentes: [Graphify oficial](https://github.com/Graphify-Labs/graphify), [README de la rama v8](https://raw.githubusercontent.com/Graphify-Labs/graphify/v8/README.md), [dependencias y entrypoints oficiales](https://raw.githubusercontent.com/Graphify-Labs/graphify/v8/pyproject.toml), [MCP en Codex](https://learn.chatgpt.com/docs/extend/mcp?surface=cli). La versión efectivamente probada es la instalada, no una suposición sobre la rama remota.

Comandos reproducibles desde la raíz:

```powershell
uv venv scratch/graphify-venv
uv pip install --python scratch/graphify-venv/Scripts/python.exe 'graphifyy[mcp]==0.9.94'
.\scratch\graphify-venv\Scripts\graphify.exe extract . --code-only --force --no-cluster --max-workers 2 --out scratch/closure-audit
.\scratch\graphify-venv\Scripts\graphify.exe cluster-only . --graph scratch/closure-audit/graphify-out/graph.json --no-label
.\scratch\graphify-venv\Scripts\python.exe scratch/closure-audit/mcp_probe.py
```

No se habilitó Cloud, extracción semántica ni etiquetado LLM. `--code-only` omite la pasada semántica; `--no-label` impide nombrar comunidades mediante modelos. Se descargaron paquetes públicos, sin subir el repositorio. No se ejecutaron herramientas Graphify de PR.

**Verificación real:** handshake MCP, `tools/list` y cinco llamadas satisfactorias con el SDK MCP oficial desde este agente. `graph_stats`, `query_graph` y `get_neighbors` devolvieron información del grafo. El resultado de `codex mcp add` fue `Added global MCP server 'case_graphify'`; la entrada se confirmó leyendo solo esa sección de configuración.

**Límite pendiente:** el catálogo de herramientas de esta conversación no incluye `case_graphify`. No se afirma una invocación nativa desde él. La CLI dentro del sandbox tampoco resuelve el home de Codex; fuera del sandbox el registro funcionó. Para cerrar la integración nativa: recargar/reabrir Codex, verificar el servidor y llamar `graph_stats` desde sus herramientas. No hace falta reconstruir el grafo para esa comprobación.

Inventario anunciado por `tools/list`:

- Consulta local: `query_graph`, `get_node`, `get_neighbors`, `get_community`, `god_nodes`, `graph_stats`, `shortest_path`.
- Integración remota anunciada, **no ejecutada**: `list_prs`, `get_pr_impact`, `triage_prs`.

Solo `graph_stats`, `query_graph` y `get_neighbors` se probaron funcionalmente; inventario no equivale a prueba de todas las herramientas. Esquemas exactos: `scratch/closure-audit/mcp-tools.json`; respuestas: `mcp-results.json` y `mcp-probe.log` en la misma carpeta.

## 3. Grafo, cobertura y límites

Artefactos persistentes locales, no versionados:

- `scratch/closure-audit/graphify-out/graph.json`: 490.082 bytes.
- `scratch/closure-audit/graphify-out/graph.html`: 494.264 bytes.
- `scratch/closure-audit/graphify-out/GRAPH_REPORT.md`: 7.217 bytes.
- Se conservan también manifest, análisis, logs y un snapshot SHA-256 de 141 archivos de fuentes/pruebas/configuración.

Resultado final: **448 nodos, 1.209 relaciones, 19 comunidades**, 112 rutas fuente representadas. Schema 1; Graphify 0.9.94; `built_at_commit` coincide con HEAD. Hay **1.186 relaciones EXTRACTED y 23 INFERRED**. Las inferidas proceden de resolución local; no de un LLM remoto. El clustering usa una vista agregada de aristas; JSON y MCP mantienen el total anterior.

Cobertura comprobada por presencia de nodos y consultas dirigidas:

| Dominio | Evidencia |
|---|---|
| Motor | `useTimeTravelEngine` llama a `TimeTravelController`; los cuatro labs llaman al hook. |
| Algoritmos | `bubbleSort`, `simulateStackOperations`, `simulateQueueOperations`, `simulateLinkedListOperations` presentes. |
| Componentes | Cuatro labs, `LabShell`, `CodeViewer` y `PedagogicalKnowledgePanel` presentes. |
| Visualizadores | Los cuatro adapters y sus hooks de animación están representados. |
| Dependencias | Imports, reexports, llamadas, referencias, contención y métodos. |

Ejemplo MCP contrastado en fuente: `LinkedListLab → simulateLinkedListOperations` (`LinkedListLab.tsx:322`), `LinkedListLab → useTimeTravelEngine` (`:247`), `ArrayLab → bubbleSort` (`ArrayLab.tsx:256`). La relación `useTimeTravelEngine → subscribe` está marcada INFERRED; la llamada al constructor del controlador está marcada EXTRACTED.

La primera extracción incluía scripts históricos versionados de `scratch/`, pese a su presencia en `.gitignore`. Se añadió `.graphifyignore` explícito y se reconstruyó. **Cero nodos** finales en `scratch`, `node_modules`, `dist`, `.agents`, `.git` y resultados de pruebas. Se excluye además el lockfile de dependencias del índice.

Límites observados:

- 128 archivos de código detectados en la reconstrucción; 50 no produjeron símbolos. Las pruebas con callbacks y los datos no equivalen a funciones exportadas.
- El parser informó un error en `src/components/ui/ui.test.tsx:159`. TypeScript y Vitest sí pasan: se trata de una limitación de extracción, no de un error demostrado de la aplicación.
- 18 entradas no-code omitidas en esa extracción; documentos y contenido semántico no fueron indexados mediante LLM.
- CSS no clasificado; `tokens.css` omitido por heurística de archivo potencialmente sensible. La identidad visual se auditó leyendo CSS directamente.
- No se certifica que todas las llamadas o dependencias de tipos se resuelvan. `ExecutionStep` y el comportamiento temporal se contrastaron en fuente y pruebas.
- HTML generado, no auditado visualmente ni certificado como visor totalmente offline. No se abrió ni se publicó el grafo.

## 4. Política de contexto

Persistida en `AGENTS.md`: consultar primero el grafo, delimitar nodos y vecinos, leer fuentes pertinentes y volver a indexar ante cambios. Usar CLI explícitamente como alternativa si MCP no está expuesto. No cargar el grafo completo en el contexto ni tratar una arista inferida como prueba de comportamiento.

Vigencia: comparar HEAD, cambios pendientes y `source-snapshot.json`. Tras reconstruir y validar, ejecutar `python scratch/closure-audit/snapshot.py`. No refrescar hashes sobre un grafo obsoleto. Los documentos añadidos por esta auditoría no alteran el grafo AST.

Medición disponible: una consulta sobre `useTimeTravelEngine` recuperó 13 nodos y 19 aristas; Graphify estimó aproximadamente 1.196 tokens aunque se solicitaron 1.000. El presupuesto es orientativo: el servidor decidió conservar las aristas completas. No hubo experimento antes/después comparable ni medición exacta de tokens del modelo; **no se atribuye ahorro porcentual**. La utilidad comprobada fue localizar cuatro labs y el controlador con una consulta.

## 5. Estado de los hitos

| Hito | Estado auditado | Completado / límites |
|---|---|---|
| 1 — Glass Foundation | Base implementada; cierre parcial | Tokens dark/cyan y glass en `src/styles/tokens.css:3`; React/TS, motor y pruebas funcionan. ES predeterminado y fallback en `src/i18n/config.ts:34,82`. Responsive exterior pasa, pero hay recorte interno e i18n pendiente. |
| 2 — Interactive Workbench | Funcionalidad principal verificada | Dock dentro del escenario (`LabShell.tsx:50`), controles, scrubber, pausa al SEEK y navegación. E2E verifica operaciones sobre estados intermedios y cambio de idioma. Ergonomía de inputs aún mejorable. |
| 3 — Visualizers & Motion | Implementado con pendientes de fidelidad | Cuatro adapters y hooks Anime.js; transiciones elegibles en presentación. Retroceso/SEEK no reproducen animación forward; hay cancelación y limpieza. Recorte de Linked List y limitaciones de pruebas impiden cerrar. |
| 4 — Consolidación | Parcial | Typecheck, lint, unitarias, E2E y build pasan; workflow de Pages existe y desplegó el HEAD. Faltan cierre pedagógico, accesibilidad integral, baseline visual real, performance medida y smoke actual de producción. |

No se convierte un hito histórico “completado” en garantía actual: estos estados corresponden al checkout auditado.

## 6. Hallazgos priorizados

### F1 — P1: el terminal NULL de Linked List queda fuera del lienzo

Reproducción real: abrir Linked List con su preset inicial y saltar al último paso. Hay ocho nodos y el viewBox sigue siendo de 800 unidades. El último nodo llega a x=796; el terminal empieza en x=844 y termina en x=896. La captura confirma que NULL no se ve. En móvil de 390 px el documento conserva `scrollWidth=390`, por lo que el chequeo de overflow exterior no detecta el problema.

Evidencia: `LinkedListVisualizerAdapter.tsx:26,73,81,227`; `components.css:522` establece contenedor con overflow oculto. Capturas `linked-list-final-desktop.png` y `linked-list-final-mobile.png`; medidas en `browser-results.json`. En la captura desktop también se observa texto superior recortado: incluirlo en los criterios de layout.

Cierre: mantener nodos, terminal, punteros y textos dentro de su zona visible o proporcionar navegación explícita. Probar presets y crecimiento manual; comprobar bounds internos, no solo el ancho del documento.

### F2 — P1: internacionalización incompleta del estado y CodeViewer

`src/core/algorithms/linked-list-operations.ts:91` y siguientes generan `description`, `statusMessage` y `a11yMessage` en inglés. `LinkedListVisualizerAdapter.tsx:102` presenta la descripción sin traducir y `LinkedListLab.tsx:517` envía el anuncio crudo. Patrón equivalente en los otros labs. CodeViewer contiene `Line … Active`, `Pseudocode viewer` y `Code content` literales (`CodeViewer.tsx:108,116,126`).

La prueba de navegador capturó `TypeScriptLine 1 Active` y descripción final inglesa con idioma español. La infraestructura de idiomas sí existe y ES→EN conservó el paso 6 de 6. No reiniciar pasos para traducir: resolver mensajes en presentación conservando identidad y estado. Cualquier ajuste de contratos del core exige revisión y autorización específica.

### F3 — P1: el código pedagógico de Linked List no conserva invariantes

`LinkedListLab.tsx:30` y `:69` contienen snippets independientes. `insertAt` no actualiza tail al insertar al final; `removeAt` no limpia tail al quitar el único elemento ni lo actualiza al quitar el último. Faltan validaciones y definición de `Node<T>`; no debe presentarse como ejemplo autónomo ejecutable completo. Tampoco se muestran FIND/CLEAR, aunque son operaciones ofrecidas por el lab.

La implementación real sí maneja los límites: `src/core/data-structures/linked-list.ts:69–80,94–120`. El contenido de fase 08 explica invariantes que el snippet no cumple (`src/locales/es/linkedList.json`, `phases.p08`).

Cierre: acordar si se muestra implementación completa o extracto pedagógico explícito; asegurar equivalencia para cabeza/cola/lista vacía/índice inválido. Validar los highlights contra las líneas realmente mostradas y cubrir las operaciones disponibles. No modificar el core para adaptarlo a un snippet incorrecto.

### F4 — P2: la suite llamada visual-regression no compara imágenes

`e2e/visual-regression.spec.ts:9–104` verifica visibilidad, tamaños y textos; no hay baseline ni `toHaveScreenshot`. El E2E de limpieza de Linked List consulta `.ll-ghost-anchor` (`e2e/linked-list-lab.spec.ts:104`), mientras el adapter renderiza `.ll-ghost-group` / `.ll-ghost-motion` (`LinkedListVisualizerAdapter.tsx:251`). Puede pasar sin observar el ghost real.

Cierre: corregir el objetivo de la aserción, observar la aparición cuando corresponda y después la limpieza; añadir comparaciones visuales deterministas con movimiento reducido y comprobaciones específicas del movimiento normal.

### F5 — P2: panel pedagógico presente, explicaciones todavía estáticas

`PedagogicalKnowledgePanel.tsx:30–59` muestra fases y CodeViewer para fases 06/07. No está ausente ni vacío. Las fases textuales reciben contenido i18n fijo; no reciben estado/acción para explicar el paso actual (`LinkedListLab.tsx:154–218`, equivalente en los demás labs). Los highlights sí cambian con `currentStep`.

Cierre: definir cuáles fases deben explicar estado actual, valores comparados, nodo visitado y reconexión. Mantener la selección de fase independiente del historial y ambos idiomas sincronizados.

### F6 — P2: formularios y accesibilidad necesitan consolidación

Array tiene label visible asociado (`ArrayLab.tsx:370`). Stack/Queue/Linked List usan nombres ARIA y placeholders, pero faltan etiquetas individuales persistentes; en Linked List se ven dos campos prellenados “42” y “0” sin distinguir visiblemente valor e índice (`LinkedListLab.tsx:585–610`).

`VisualNode.tsx:38–45` admite onClick en un grupo SVG sin semántica ni teclado. Los adapters de Queue/Linked List siempre pasan un callback aunque el lab no suministre acción (`LinkedListVisualizerAdapter.tsx:195`): la clase clickable aparece incluso sin una interacción efectiva. El probe confirma nodos sin role/tabindex; no se afirma que exista una operación funcional inaccesible en este flujo.

Cierre: labels visibles; eliminar affordances sin acción y dar teclado/semántica a las acciones reales si se ofrecen. Auditar contraste, foco, lector de pantalla, anuncios y movimiento reducido. La suite existente no constituye certificación WCAG.

### F7 — P2: tamaño y performance sin presupuesto verificado

Build: JS 760,33 kB / gzip 193,92 kB; advertencia >500 kB. Shiki se importa e inicializa desde `shiki-highlighter.ts:1–7,92`; no se ha perfilado cuánto aporta cada dependencia ni se han medido Web Vitals. La advertencia es real, pero no demuestra por sí sola mala experiencia.

Cierre: medir carga y reproducción con datos y dispositivo definidos; decidir presupuesto y carga diferida con evidencia. No silenciar la advertencia como sustituto de optimización.

### R1 — riesgo estático: inicialización asíncrona del resaltado

`CodeViewer.tsx:22–43` descarta el valor de ready y memoriza tokens solo por code/language. Si el primer render ocurre antes de que Shiki esté listo, cambiar ready no invalida ese memo. No se reprodujo en el flujo normal auditado; registrar prueba controlada de inicialización lenta antes de clasificarlo como fallo de usuario confirmado.

## 7. Recorrido intermedio y correspondencia temporal

No se confirmó que el recorrido intermedio esté ausente: el generador produce TRAVERSE y SEARCH con `activeNodeId` (`linked-list-operations.ts:226` y `:320`); el adapter usa ese estado para resaltado y CURR. `getExecutedCommands` excluye la operación todavía no aplicada durante TRAVERSE (`LinkedListLab.tsx:363–370`), preservando el estado visible al bifurcar. Los E2E de operaciones intermedias pasan.

Límite: las operaciones manuales seleccionan inmediatamente el resultado anterior a COMPLETE (`LinkedListLab.tsx:319–330`). El recorrido queda disponible en el historial, pero no se recorre automáticamente al pulsar insertar/eliminar. Definir explícitamente si ese comportamiento satisface la enseñanza deseada; no convertir una decisión pendiente en defecto del motor.

Anime.js está en hooks de presentación; `linkedListTransitionTypes.ts:36–84` limita elegibilidad y devuelve false para retroceso/SEEK. Se verificó código y suite existente; falta una matriz completa de idioma durante animación, bifurcación, ghost y cleanup en los cuatro labs. El snapshot del paso al cambiar idioma sí quedó conservado en la comprobación adicional.

## 8. Validación técnica y evidencias

| Comando del proyecto | Resultado | Log en `scratch/closure-audit/` |
|---|---|---|
| `npm.cmd run typecheck` | 0, pasa | `typecheck.log` |
| `npm.cmd run lint` | 0, sin warnings | `lint.log` |
| `npm.cmd run test:run` | 0, 286/286, 31 archivos, 19,05 s | `vitest-elevated.log` |
| `npm.cmd run build` | 0, advertencia de chunk | `build-elevated.log` |
| `npm.cmd run test:e2e` | 0, 37/37 Chromium, 55,6 s | `playwright.log` |

Vitest/build fallaron inicialmente porque esbuild no podía leer directorios bajo el sandbox (`Acceso denegado`, carga de configuración). Se repitieron con aprobación fuera del sandbox y pasaron. Los logs iniciales `vitest.log` y `build.log` se conservan; no se cuentan como defectos del código. Playwright ejecutó el build/preview definido por el proyecto. No se actualizaron snapshots ni se cambiaron pruebas para conseguir verde.

La suite responsive recorre 1440×900, 1280×720, 768×1024 y 390×844; el scrubber tiene pruebas móviles en los cuatro labs. El probe adicional de esta auditoría utilizó Chromium a 1440×900 y 390×844, sin pageerrors; produjo las medidas y capturas del hallazgo F1. No se ejecutaron Firefox/WebKit, auditoría automatizada integral de accesibilidad ni pruebas de performance.

GitHub: [run 36046662377](https://github.com/YamiCueto/case-algorithms/actions/runs/36046662377) asociado al mismo HEAD; jobs de validación y Pages con `success`, completados el 2026-09-24 a las 19:15:32Z y 19:16:20Z respectivamente. Consulta actual de resultados históricos, únicamente lectura. No se comprobó funcionalmente el sitio publicado en esta ejecución ni se redeplegó.

## 9. Plan de cierre y aceptación

| Orden | Trabajo autorizado solo tras aprobar implementación | Criterio verificable |
|---|---|---|
| 0 | Completar exposición nativa de MCP | Reabrir Codex y obtener `graph_stats` del grafo local; confirmar 448 nodos y HEAD esperado. |
| 1 | Corregir recortes del escenario de Linked List (F1) | Preset de ocho nodos y crecimiento manual: nodos/NULL/punteros/textos accesibles en desktop y móvil; asserts de bounds internos; motor sin cambios. |
| 2 | Cerrar contenido pedagógico e i18n (F2, F3, F5) | Mensajes ES/EN, snippets coherentes y highlights correctos; estados extremos y FIND/CLEAR cubiertos; mismo índice/historial al cambiar idioma. |
| 3 | Consolidar accesibilidad y regresión visual (F4, F6, R1) | Labels persistentes; teclado/foco/lector auditados; ghost probado realmente; baselines revisadas; inicialización lenta de Shiki cubierta. |
| 4 | Medir y mejorar performance (F7) | Presupuesto documentado de carga y frame time con escenario reproducible; sin warning no justificado; sin degradación del motor. |
| 5 | Validación final y publicación separada | Todos los scripts verdes sobre un SHA concreto, matriz de aceptación completa y smoke ES/EN del SHA desplegado. Publicación requiere autorización posterior. |

Primer hito ejecutable recomendado: **F1, corrección acotada de layout de Linked List y prueba de bounds internos**, sin cambiar generadores ni `ExecutionStep[]`. Después, lote pedagógico ES/EN con decisiones explícitas sobre snippets y recorrido manual.

Para declarar CASE Algorithms terminado deben cumplirse conjuntamente:

1. Cuatro labs: vacío, un elemento, casos normales, límites, errores, navegación completa, SEEK, reproducción y operación desde estado visible.
2. Estado, descripción, anuncio accesible, código resaltado y visualización explican el mismo paso; invariantes de estructura correctos.
3. ES predeterminado/fallback y EN completos; cambio de idioma preserva índice, datos, reproducción y animaciones en curso.
4. Bounds internos y controles usables en 360/390/768/1280/1440 px y zoom 200%; los tamaños adicionales son criterios pendientes, no pruebas ejecutadas hoy.
5. Teclado, foco visible, labels, anuncios, contraste y reduced-motion validados; sin affordances engañosas.
6. Typecheck, lint, unitarias, E2E y regresión visual con evidencia del mismo árbol; sin fallos ni advertencias no aceptadas explícitamente.
7. Performance medida y presupuesto aprobado; sitio Pages probado tras un despliegue autorizado.
8. Graphify actualizado, exclusiones sin contaminación y consulta MCP nativa confirmada; límites del índice visibles para futuros agentes.

## 10. Cambios y punto de parada

Archivos nuevos revisables: `.graphifyignore`, `AGENTS.md` y este informe. Instalación, grafo, scripts de diagnóstico, capturas, logs y hashes viven bajo `scratch/` ignorado. Registro de MCP en configuración local de Codex. No se añadieron rutas personales a los archivos revisables.

**FLAG STOP:** configuración y auditoría entregadas; no se implementaron los pendientes. La exposición MCP nativa requiere recargar sesión. Esperar autorización para ejecutar el plan de cierre.
