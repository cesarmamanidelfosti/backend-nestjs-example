# backend-nestjs-example

Proyecto de ejemplo generado para probar `implementacion-husky-precommit-nestjs-angular.md`. Implementa un esqueleto funcional mínimo del módulo `save-mortality` descrito en `PLAN_REFACTORIZACION_MIGRACION_SAVE_MORTALITY.md`, con arquitectura hexagonal (`domain` / `application` / `infrastructure` / `shared`).

## Alcance y desviaciones respecto al plan original

- **Sin Prisma ni base de datos real.** `CampaignLookupPort` y `MortalitySampleRepositoryPort` se implementan con adaptadores en memoria (`infrastructure/adapters/sql/*-in-memory.adapter.ts`) en lugar de los adaptadores Prisma del plan. Para llevarlo a un caso real, basta con crear `*-prisma.adapter.ts` implementando los mismos puertos y registrarlos en `save-mortality.module.ts`.
- **JWT simplificado.** El guard (`infrastructure/auth/jwt-auth.guard.ts`) valida un bearer token firmado con `@nestjs/jwt` y exige el claim `sub`, pero no integra un proveedor de identidad externo.
- **Lambda sin despliegue real.** `infrastructure/adapters/lambda/save-mortality.handler.ts` reutiliza el mismo caso de uso que el controller HTTP; `scripts/invoke-lambda-local.js` simula la invocación sin infraestructura AWS.
- **Campañas conocidas para pruebas:** `campaign-001` y `campaign-002` (ver `campaign-lookup-in-memory.adapter.ts`). Cualquier otro `campaignId` responde 404 (`CampaignNotFoundError`).

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
POST /v1/save-mortality
Authorization: Bearer <jwt firmado con el secreto JWT_SECRET (o "demo-secret" por defecto)>

{
  "campaignId": "campaign-001",
  "quantity": 5,
  "cause": "calor",
  "photoUrl": "https://..."
}
```

## Endpoint técnico

```http
GET /health
```

## Husky / gobernanza local

Ver `governance.config.json`, `scripts/validate-branch-name.js`, `scripts/validate-commit-msg.js`, `scripts/check-coverage-summary.js`, `scripts/run-sonar-scan.js` y `.husky/*`, implementados según `implementacion-husky-precommit-nestjs-angular.md`. El `docker-compose.yml` de SonarQube vive en `../` (compartido con `frontend-angular-example`) y no se levanta automáticamente — ver la sección de validación manual en el resumen de la sesión que generó este proyecto.

# Notas de prueba de Husky
