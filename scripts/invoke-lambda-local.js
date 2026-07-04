#!/usr/bin/env node
const path = require('path');

const withDb = process.argv.includes('--with-db');

// El nombre "--with-db" se conserva por paridad con el contrato de
// implementacion-husky-precommit-nestjs-angular.md, aunque en este esqueleto
// ambos modos usan los adaptadores en memoria (ver nota de desviacion en el README).
const parentId = withDb ? 'parent-999' : 'parent-001';

async function main() {
  const { handler } = require(
    path.resolve(__dirname, '..', 'dist', 'infrastructure', 'adapters', 'lambda', 'app-item.handler'),
  );

  const event = {
    body: JSON.stringify({ parentId, quantity: 3, description: 'ejemplo local' }),
    requestContext: {
      authorizer: { claims: { sub: 'local-tester' } },
    },
  };

  const result = await handler(event);
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.statusCode < 400 ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
