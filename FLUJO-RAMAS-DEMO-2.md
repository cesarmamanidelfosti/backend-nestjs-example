# Caso extra 2: genericización completa del dominio de ejemplo

Este documento registra un segundo caso ejecutado de punta a punta contra los dos repositorios reales en GitHub (`backend-nestjs-example` y `frontend-angular-example`), siguiendo el mismo estilo de `FLUJO-RAMAS-DEMO.md`: un feature completo por el flujo de ramas del lineamiento, no un commit suelto.

## Objetivo del caso

Las versiones anteriores modelaban un caso de uso real y específico (seguimiento de mortalidad avícola: `save-mortality`, `MortalitySample`, KPIs de "aves vivas/muertas"). Este caso retira por completo ese concepto de negocio — nombres de archivos, clases, variables y campos — para que ambos proyectos queden abstractos como plantillas ("`app`") reutilizables y se puedan compartir sin exponer el contexto de negocio original.

## Backend (`backend-nestjs-example`) — `v1.1.0` → `v1.2.0`

Rama `feature/DEMO-10-genericizar-app` desde `dev`:

| Antes                                            | Después                                   |
| ------------------------------------------------ | ----------------------------------------- |
| `save-mortality.*` (controller, module, handler) | `app-item.*`                              |
| `MortalitySample` (entidad)                      | `AppItem`                                 |
| `create-mortality-sample.dto.ts`                 | `create-app-item.dto.ts`                  |
| `CampaignLookupPort` / `CAMPAIGN_LOOKUP_PORT`    | `ParentLookupPort` / `PARENT_LOOKUP_PORT` |
| `MortalitySampleRepositoryPort`                  | `AppItemRepositoryPort`                   |
| `CampaignNotFoundError`                          | `ParentNotFoundError`                     |
| `campaignId`                                     | `parentId`                                |
| `cause`                                          | `description`                             |
| `photoUrl`                                       | `attachmentUrl`                           |
| `registeredBy` / `registeredAt`                  | `createdBy` / `createdAt`                 |
| `campaign-001` / `campaign-002` (datos mock)     | `parent-001` / `parent-002`               |
| `POST /v1/save-mortality`                        | `POST /v1/app-items`                      |

Flujo ejecutado: commit validado por Husky en la feature → merge squash a `dev` → corte de `release/1.2.0` → promoción a `qa` → `main` → CHANGELOG cerrado como `[1.2.0]` → tag `v1.2.0` → back-merge a `dev`.

### Hallazgo real durante la ejecución

El primer push de `dev` con los archivos renombrados **falló el Quality Gate real**. Causa: `import { randomUUID } from 'crypto'` ya era un _code smell_ preexistente y tolerado (regla `typescript:S7772`, "usar `node:crypto`"), pero al renombrarse el archivo (`save-mortality.use-case.ts` → `save-app-item.use-case.ts`) SonarQube perdió el rastro de "issue antiguo" y lo contó como **violación nueva**, bloqueando el gate (`new_violations: 1`). Se corrigió el import a `node:crypto` — un fix real, no un bypass — y el push pasó limpio.

**Lección para el equipo:** renombrar archivos con `git mv` no garantiza que SonarQube preserve el historial de _code smells_ tolerados; conviene revisar y limpiar deuda técnica menor _antes_ de un renombrado masivo, no depender de que quede "gratis" oculta detrás del cambio de nombre.

## Frontend (`frontend-angular-example`) — primera release `v1.1.0`, luego `v1.2.0`

Este repositorio nunca había tenido una release real (todo vivía en `[Unreleased]`). Se crearon `dev`/`qa` por primera vez y se cerró formalmente `v1.1.0` (scaffolding + Husky, `DEMO-1`/`DEMO-2`) **antes** de aplicar la genericización, para no mezclar ambos cambios bajo la misma versión.

Rama `feature/DEMO-4-genericizar-dashboard` desde `dev`, sobre el feature `dashboard`:

| Antes                                                                                     | Después                                                               |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `DashboardDto.avesVivas` / `avesMuertas` / `porcentajeMortalidad` / `ultimaActualizacion` | `activeCount` / `inactiveCount` / `alertPercentage` / `lastUpdatedAt` |
| `EstadoMortalidad`                                                                        | `AlertStatus`                                                         |
| `kpiAves` / `kpiMortalidad`                                                               | `kpiPrimary` / `kpiAlert`                                             |

Flujo ejecutado: `v1.1.0` promovida primero (`release/1.1.0` → `qa` → `main`, tag `v1.1.0`, back-merge a `dev`), luego `v1.2.0` con la genericización (`release/1.2.0` → `qa` → `main`, tag `v1.2.0`, back-merge a `dev`). Sin hallazgos de Sonar en este caso (los archivos se editaron in-place, no se renombraron, así que no hubo pérdida de historial de _code smells_).

## Estado final

Ambos repositorios quedan con topología `dev`/`qa`/`main` poblada y tags reales:

- `backend-nestjs-example`: `v1.1.0`, `v1.1.1`, `v1.2.0`
- `frontend-angular-example`: `v1.1.0`, `v1.2.0`

Ambos proyectos compilan, lintean y pasan sus tests (23 y 19 respectivamente) con la nomenclatura genérica, y el endpoint `POST /v1/app-items` del backend se probó de punta a punta vía `npm run lambda:invoke:local:sample`.

## Desviaciones (idénticas a `FLUJO-RAMAS-DEMO.md`)

- Tags anotados (`git tag -a`), no firmados (`-s`): sin clave GPG configurada en esta máquina de demo.
- Push directo a `main`/`qa`/`dev`: sin Azure Repos Branch Policies configuradas sobre estos repositorios de GitHub.
- El CHANGELOG histórico de versiones anteriores (`v1.1.0`, `v1.1.1` del backend) **no se reescribió** — sigue mencionando `save-mortality`/`campaignId` porque así era el código en ese momento. Reescribir el historial para ocultar el dominio original habría sido revisionismo, no genericización. La versión `[1.2.0]` de cada CHANGELOG documenta explícitamente el cambio de nomenclatura y por qué se hizo.
