# CASE Algorithms — navegación y validación

## Consultar primero el grafo local

- Antes de explorar ampliamente el repositorio, consultar el servidor MCP local `case_graphify`: `graph_stats`, `query_graph`, `get_node` o `get_neighbors`. Elegir únicamente símbolos y dependencias pertinentes.
- El grafo local está en `scratch/closure-audit/graphify-out/graph.json`. No cargar el JSON completo en el contexto. Las rutas absolutas del servidor pertenecen a la configuración local de Codex, nunca a archivos versionados.
- Si MCP no está disponible, declarar esa limitación y usar el CLI local con `--graph scratch/closure-audit/graphify-out/graph.json`; no confundir la alternativa CLI con una conexión MCP verificada.
- Confirmar comportamiento, defectos y referencias en el código fuente. `EXTRACTED` e `INFERRED` son procedencias del grafo, no garantías de corrección. CSS, contenido pedagógico y algunas pruebas requieren lectura directa.
- Comprobar `built_at_commit`, `git status --short` y los hashes de `scratch/closure-audit/source-snapshot.json`. Un HEAD idéntico no garantiza vigencia cuando hay cambios sin commit. Consultar el diff y reconstruir si cambian fuentes, imports, firmas o exclusiones.
- Reconstruir con `scratch/graphify-venv/Scripts/graphify.exe extract . --code-only --force --no-cluster --max-workers 2 --out scratch/closure-audit`; después ejecutar `cluster-only . --graph scratch/closure-audit/graphify-out/graph.json --no-label` con el mismo ejecutable. Refrescar el snapshot solo después de validar el grafo nuevo.
- Mantener `.graphifyignore`; comprobar que no aparezcan dependencias, builds ni `scratch/` en los nodos. No habilitar Cloud, extracción semántica remota, etiquetado LLM ni herramientas de PR de Graphify para navegar este grafo.
- No repetir búsquedas globales si las consultas previas siguen vigentes. Medir lecturas y tamaños de respuestas cuando sea útil; no afirmar ahorros porcentuales sin una comparación reproducible.

## Contratos del proyecto

- Preservar `ExecutionStep[]`, generadores y `useTimeTravelEngine`. Anime.js pertenece a presentación.
- Español predeterminado y fallback; inglés soportado. Cambiar idioma no debe reiniciar el historial ni las animaciones.
- Distinguir evidencia estática, pruebas locales, navegador y producción. Los scripts de comprobación están en `package.json`.
- La auditoría de cierre no autoriza implementar pendientes, modificar el motor, hacer commit/push/merge ni desplegar. El plan y los criterios de aceptación están en `docs/CASE_ALGORITHMS_CLOSURE_AUDIT.md`.
