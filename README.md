# backend-nestjs-example

Proyecto de ejemplo genérico para probar `implementacion-husky-precommit-nestjs-angular.md`. Implementa un esqueleto funcional mínimo de un módulo `app-item`, con arquitectura hexagonal (`domain` / `application` / `infrastructure` / `shared`).

> Este proyecto no está atado a ningún dominio de negocio en particular: `AppItem` es un recurso genérico que pertenece a un `parent` (padre/contenedor lógico). La idea es que sirva como plantilla reutilizable para cualquier caso de uso real, sin exponer contexto de negocio específico.

## Alcance y desviaciones

- **Sin Prisma ni base de datos real.** `ParentLookupPort` y `AppItemRepositoryPort` se implementan con adaptadores en memoria (`infrastructure/adapters/sql/*-in-memory.adapter.ts`). Para llevarlo a un caso real, basta con crear `*-prisma.adapter.ts` implementando los mismos puertos y registrarlos en `app-item.module.ts`.
- **JWT simplificado.** El guard (`infrastructure/auth/jwt-auth.guard.ts`) valida un bearer token firmado con `@nestjs/jwt` y exige el claim `sub`, pero no integra un proveedor de identidad externo.
- **Lambda sin despliegue real.** `infrastructure/adapters/lambda/app-item.handler.ts` reutiliza el mismo caso de uso que el controller HTTP; `scripts/invoke-lambda-local.js` simula la invocación sin infraestructura AWS.
- **Padres conocidos para pruebas:** `parent-001` y `parent-002` (ver `parent-lookup-in-memory.adapter.ts`). Cualquier otro `parentId` responde 404 (`ParentNotFoundError`).

## Comandos principales

```bash
npm install
npm run build
npm run test:cov
npm run lint
npm run start:dev

# invocación local del lambda (sin infraestructura)
npm run lambda:invoke:local:sample
npm run lambda:invoke:local:sample:with-db
```

## Endpoint de negocio

```http
POST /v1/app-items
Authorization: Bearer <jwt firmado con el secreto JWT_SECRET (o "demo-secret" por defecto)>

{
  "parentId": "parent-001",
  "quantity": 5,
  "description": "texto libre",
  "attachmentUrl": "https://..."
}
```

## Endpoint técnico

```http
GET /health
```

## Husky / gobernanza local

Ver `governance.config.json`, `scripts/validate-branch-name.js`, `scripts/validate-commit-msg.js`, `scripts/check-coverage-summary.js`, `scripts/run-sonar-scan.js` y `.husky/*`, implementados según `implementacion-husky-precommit-nestjs-angular.md`. El `docker-compose.yml` de SonarQube vive en `../` (compartido con `frontend-angular-example`) y no se levanta automáticamente.

## Flujo de ramas de ejemplo

Ver `FLUJO-RAMAS-DEMO.md` para una demostración ejecutada de punta a punta del flujo de ramas del lineamiento (`dev`/`qa`/`main`, feature, bugfix con cherry-pick, release y hotfix) contra este mismo repositorio.
