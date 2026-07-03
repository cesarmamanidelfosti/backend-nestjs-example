#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const config = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'governance.config.json'), 'utf8')
);

// git rev-parse --abbrev-ref HEAD falla con "fatal: ambiguous argument 'HEAD'"
// cuando el repo todavia no tiene ningun commit (HEAD "unborn"). symbolic-ref
// resuelve el nombre de rama leyendo .git/HEAD directamente, sin requerir un
// commit previo; se conserva rev-parse como fallback para HEAD desacoplado.
let branch;
try {
  branch = execSync('git symbolic-ref --short HEAD').toString().trim();
} catch {
  branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
}

// Ramas de larga vida: no se valida naming, ya estan protegidas por policy remota (seccion 7.1 del lineamiento)
if (config.branching.protectedBranches.includes(branch)) {
  process.exit(0);
}

const patterns = Object.entries(config.branching.types);
const match = patterns.find(([, def]) => new RegExp(def.pattern).test(branch));

if (!match) {
  console.error(`\n❌ Nombre de rama inválido: "${branch}"`);
  console.error('   Patrones permitidos (governance.config.json):');
  patterns.forEach(([type, def]) => console.error(`   - ${type}: ${def.pattern}`));
  console.error(`\n   Ejemplo válido: feature/${config.project.code}-145-google-sso\n`);
  process.exit(1);
}

console.log(`✅ Rama válida (${match[0]}): ${branch}`);
process.exit(0);
