# Changelog

Todos los cambios relevantes de este proyecto se documentan en este archivo, siguiendo el formato de [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el esquema de versionado descrito en `delfosti-lineamiento-general-branching-cicd-changelog-v1.0.md` (sección 4).

## [Unreleased]

### Added

- [DEMO-1] Scaffolding inicial del backend NestJS con arquitectura hexagonal (`domain`/`application`/`infrastructure`/`shared`) y módulo `save-mortality` (DTO, caso de uso, controller HTTP, handler lambda, adaptadores en memoria, guard JWT).
- [DEMO-2] Configuración de Husky (`pre-commit`, `commit-msg`, `pre-push`) según `implementacion-husky-precommit-nestjs-angular.md`: validación de rama, mensaje de commit, CHANGELOG, cobertura de tests y Quality Gate de SonarQube.
- [DEMO-6] Campo opcional `notes` en la muestra de mortalidad (DTO, entidad y caso de uso), máximo 280 caracteres.

### Security

- [DEMO-3] Se fuerza `multer@^2.2.0` vía `overrides` de npm: `@nestjs/platform-express@11.1.27` (última versión publicada al momento) todavía fija `multer@2.1.1`, dentro del rango vulnerable a DoS (GHSA-72gw-mp4g-v24j, GHSA-3p4h-7m6x-2hcm). Corrige el bloqueo real de `npm audit` en `pre-push`.
