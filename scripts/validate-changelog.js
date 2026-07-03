#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const config = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'governance.config.json'), 'utf8')
);

const changelogConfig = config.changelog ?? {};
const enforcedPaths = changelogConfig.enforceOnPaths ?? [];

if (enforcedPaths.length === 0) {
  process.exit(0);
}

const stagedFiles = execSync('git diff --cached --name-only --diff-filter=ACMR')
  .toString()
  .trim()
  .split('\n')
  .filter(Boolean);

const touchesEnforcedPath = stagedFiles.some((file) =>
  enforcedPaths.some((prefix) => file.startsWith(prefix)),
);

if (!touchesEnforcedPath) {
  process.exit(0);
}

if (stagedFiles.includes('CHANGELOG.md')) {
  console.log('✅ CHANGELOG.md actualizado junto con los cambios de negocio.');
  process.exit(0);
}

// Best-effort local (seccion 9.5 del lineamiento): localmente no siempre se
// conoce el diff completo contra `dev` (ej. commits intermedios de una misma
// tarjeta), asi que por defecto esto es una advertencia, no un bloqueo duro.
// El gate real y bloqueante vive en CI (etapa Governance). Se puede endurecer
// con "changelog.blocking": true en governance.config.json si el equipo lo pide.
const message =
  '\n⚠️  El commit modifica rutas de negocio pero no actualiza CHANGELOG.md.\n' +
  `   Rutas exigidas (governance.config.json): ${enforcedPaths.join(', ')}\n` +
  '   Recuerda actualizarlo antes de abrir el PR (seccion 9.1 del lineamiento: en el mismo PR que introduce el cambio).\n';

if (changelogConfig.blocking) {
  console.error(message.replace('⚠️ ', '❌'));
  process.exit(1);
}

console.warn(message);
process.exit(0);
