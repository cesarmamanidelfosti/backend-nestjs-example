# Changelog

Todos los cambios relevantes de este proyecto se documentan en este archivo, siguiendo el formato de [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el esquema de versionado descrito en `delfosti-lineamiento-general-branching-cicd-changelog-v1.0.md` (sección 4).

## [Unreleased]

## [1.2.0] - 2026-07-04

### Changed

- [DEMO-10] **Genericización completa del dominio de ejemplo.** Las versiones `1.1.0` y anteriores modelaban un caso de uso real de seguimiento de mortalidad avícola (`save-mortality`, `MortalitySample`, `CampaignLookupPort`, campos como `campaignId`/`cause`/`photoUrl`). A partir de esta versión, el proyecto queda completamente abstracto para poder compartirse como plantilla sin exponer el contexto de negocio original: `save-mortality` → `app-item`, `MortalitySample` → `AppItem`, `CampaignLookupPort`/`CampaignNotFoundError` → `ParentLookupPort`/`ParentNotFoundError`, `campaignId` → `parentId`, `cause` → `description`, `photoUrl` → `attachmentUrl`, `registeredBy`/`registeredAt` → `createdBy`/`createdAt`. El endpoint pasa de `POST /v1/save-mortality` a `POST /v1/app-items`. No hay cambios de comportamiento, solo de nomenclatura.

## [1.1.1] - 2026-07-04

### Security

- [DEMO-8] `ValidationPipe` global ahora rechaza campos no declarados en el DTO (`forbidNonWhitelisted: true`) en vez de solo descartarlos silenciosamente (`whitelist: true`). Hotfix aplicado directo sobre `main`.

## [1.1.0] - 2026-07-04

### Added

- [DEMO-1] Scaffolding inicial del backend NestJS con arquitectura hexagonal (`domain`/`application`/`infrastructure`/`shared`) y módulo `save-mortality` (DTO, caso de uso, controller HTTP, handler lambda, adaptadores en memoria, guard JWT).
- [DEMO-2] Configuración de Husky (`pre-commit`, `commit-msg`, `pre-push`) según `implementacion-husky-precommit-nestjs-angular.md`: validación de rama, mensaje de commit, CHANGELOG, cobertura de tests y Quality Gate de SonarQube.
- [DEMO-6] Campo opcional `notes` en la muestra de mortalidad (DTO, entidad y caso de uso), máximo 280 caracteres.

### Fixed

- [DEMO-7] `photoUrl` ahora valida formato de URL (`@IsUrl`); antes aceptaba cualquier texto. Detectado durante la estabilización de `release/1.1.0`; corregido en `dev` y llevado al release por cherry-pick.

### Security

- [DEMO-3] Se fuerza `multer@^2.2.0` vía `overrides` de npm: `@nestjs/platform-express@11.1.27` (última versión publicada al momento) todavía fija `multer@2.1.1`, dentro del rango vulnerable a DoS (GHSA-72gw-mp4g-v24j, GHSA-3p4h-7m6x-2hcm). Corrige el bloqueo real de `npm audit` en `pre-push`.

[1.2.0]: https://github.com/cesarmamanidelfosti/backend-nestjs-example/releases/tag/v1.2.0
[1.1.1]: https://github.com/cesarmamanidelfosti/backend-nestjs-example/releases/tag/v1.1.1
[1.1.0]: https://github.com/cesarmamanidelfosti/backend-nestjs-example/releases/tag/v1.1.0
