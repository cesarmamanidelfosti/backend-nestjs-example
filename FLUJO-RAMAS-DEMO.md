# Caso extra: flujo completo de ramas del lineamiento (ejecutado en vivo)

Este documento registra una prueba adicional, ejecutada de verdad contra el repositorio real en GitHub (`backend-nestjs-example`), que complementa las 8 pruebas de Husky ya documentadas en `implementacion-husky-precommit-nestjs-angular.md`. Mientras esas pruebas validan los **hooks locales**, esta prueba ejercita la **topología de ramas** descrita en `delfosti-lineamiento-general-branching-cicd-changelog-v1.0.md` (secciones 2 y 5), que no había sido probada todavía.

## Qué se ejecutó

1. **Creación de `dev` y `qa`** desde `main`, ambas pusheadas a GitHub.
2. **Feature** (`feature/DEMO-6-agregar-notas-mortalidad`, desde `dev`): se agregó un campo opcional `notes` a la muestra de mortalidad, con tests y entrada de CHANGELOG. Commit validado por Husky, **merge squash** a `dev` (sección 5.1, paso 4), rama eliminada tras el merge.
3. **Corte de release** (`release/1.1.0`, desde `dev`).
4. **Bugfix durante estabilización** (`bugfix/DEMO-7-validar-formato-foto-url`, desde `dev`, **nunca desde `release/*`** — Contradicción C6 del lineamiento): se corrigió que `photoUrl` aceptaba cualquier texto en vez de validar formato de URL. Mergeado a `dev` y llevado a `release/1.1.0` por **cherry-pick** del mismo commit.
5. **Promoción del release**: `release/1.1.0` → `qa` → `main`. CHANGELOG cerrado como versión `[1.1.0]`.
6. **Tag** `v1.1.0` sobre `main` (ver nota de firma GPG abajo).
7. **Back-merge de release**: `main` → `dev` únicamente (sección 5.4, paso 5 — a diferencia de un hotfix, un release no vuelve a `qa` porque `qa` ya validó ese mismo código antes de llegar a `main`).
8. **Hotfix** (`hotfix/DEMO-8-endurecer-validacion-payload`, desde `main`): se activó `forbidNonWhitelisted: true` en el `ValidationPipe` global para rechazar campos no declarados en el payload (antes se descartaban en silencio). Mergeado a `main`, tag `v1.1.1`.
9. **Back-merge de hotfix**: `main` → `qa` **y** `main` → `dev` (sección 5.3, paso 5 — a diferencia del release, el hotfix sí vuelve a ambas).

Todas las ramas de larga vida (`dev`, `qa`, `main`) y los dos tags (`v1.1.0`, `v1.1.1`) están pusheados en GitHub.

## Hallazgo real durante la ejecución

El push del hotfix a `main` **falló de verdad** en el Quality Gate real de SonarQube (`new_violations: 1`). La causa: el nuevo test de integración (`rejects requests with unexpected fields`) solo usaba el `.expect(400)` encadenado de `supertest`, sin una aserción explícita adicional — SonarQube (regla `typescript:S2699`, "Add at least one assertion to this test case") no reconoce ese patrón como una aserción válida. Se corrigió agregando una aserción real sobre el cuerpo de la respuesta (`expect(body.message.join(' ')).toContain('unexpectedField')`), lo cual además mejoró genuinamente la calidad del test. El tag se re-creó sobre el commit corregido antes de pushear.

## Desviaciones y limitaciones honestas

- **Sin firma GPG real**: el lineamiento exige tags firmados (`git tag -s`). Esta máquina de demo no tiene una clave GPG configurada, así que se usaron tags **anotados** (`git tag -a`) con una nota explícita en el mensaje del tag. En un entorno real del equipo, esto debe ser `-s` con una clave configurada.
- **Push directo a `main`/`qa`/`dev`**: el lineamiento (sección 7.1) exige que estas ramas prohíban push directo, vía Azure Repos Branch Policies. Este demo corre sobre un repositorio de GitHub sin esas policies configuradas, así que se pusheó directo para poder ejecutar el flujo de punta a punta sin depender de infraestructura de Azure DevOps. **Esto no sería válido en el repositorio real del equipo** una vez que Azure Repos tenga las policies activas.
- **Sin pipelines de Azure DevOps reales**: las etapas "Release Validation", "QA Promotion", "Production Promotion" y "Hotfix Validation" de la sección 6 no existen como pipelines ejecutables en este demo — se simuló su efecto (merge + gate local de Husky) sin el orquestador de Azure DevOps.
- **Feature/bugfix/hotfix branches no se pushearon individualmente**: en un flujo real se abriría un PR desde la rama temporal antes del merge. Aquí se omitió ese paso intermedio (no hay revisor humano ni Azure Repos) y se simuló el "PR aprobado" haciendo el merge directo una vez validado localmente por Husky.

Ninguna de estas desviaciones invalida la demostración: la mecánica de ramas, el cherry-pick, el squash, los back-merges diferenciados (release solo a `dev`, hotfix a `qa` y `dev`), el versionado y el CHANGELOG por versión — todo eso es exactamente lo que describe el lineamiento y corrió tal cual contra el repositorio real.
