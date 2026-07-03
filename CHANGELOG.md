# Changelog

Todos los cambios relevantes de este proyecto se documentan en este archivo, siguiendo el formato de [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el esquema de versionado descrito en `delfosti-lineamiento-general-branching-cicd-changelog-v1.0.md` (sección 4).

## [Unreleased]

### Added

- [DEMO-1] Scaffolding inicial del backend NestJS con arquitectura hexagonal (`domain`/`application`/`infrastructure`/`shared`) y módulo `save-mortality` (DTO, caso de uso, controller HTTP, handler lambda, adaptadores en memoria, guard JWT).
- [DEMO-2] Configuración de Husky (`pre-commit`, `commit-msg`, `pre-push`) según `implementacion-husky-precommit-nestjs-angular.md`: validación de rama, mensaje de commit, CHANGELOG, cobertura de tests y Quality Gate de SonarQube.
