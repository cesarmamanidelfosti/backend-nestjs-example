#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const { coverage } = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'governance.config.json'), 'utf8')
);

const summaryPath = path.resolve(process.cwd(), 'coverage', 'coverage-summary.json');

if (!fs.existsSync(summaryPath)) {
  console.error(`\n❌ No se encontró ${summaryPath}.`);
  console.error('   Asegúrate de correr los tests con el reporter "json-summary" antes de este check.\n');
  process.exit(1);
}

const { total } = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const metrics = ['lines', 'statements', 'functions', 'branches'];
const threshold = coverage.thresholdPercent;

const failures = metrics.filter((m) => total[m].pct < threshold);

console.log(`\nCode coverage (umbral configurado: ${threshold}%):`);
metrics.forEach((m) => console.log(`   - ${m}: ${total[m].pct}%`));

if (failures.length > 0) {
  console.error(`\n❌ ${failures.length} métrica(s) por debajo del umbral: ${failures.join(', ')}\n`);
  process.exit(1);
}

console.log('\n✅ Code coverage OK.\n');
process.exit(0);
