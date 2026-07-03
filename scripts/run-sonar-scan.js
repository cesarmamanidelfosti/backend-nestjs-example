#!/usr/bin/env node
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const { sonar } = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'governance.config.json'), 'utf8')
);

const token = process.env.SONAR_TOKEN;
if (!token) {
  console.error('\n❌ Falta la variable de entorno SONAR_TOKEN.\n');
  process.exit(1);
}

// host.docker.internal permite que el contenedor del scanner alcance a SonarQube
// corriendo en el mismo Docker Desktop (Windows/Mac). En Linux nativo usar --network=host
// y sonar.host.url=http://localhost:9000, o el nombre del servicio si se usa la misma red de compose.
const hostUrl = sonar.hostUrl.replace('localhost', 'host.docker.internal');

const result = spawnSync(
  'docker',
  [
    'run', '--rm',
    '-e', `SONAR_HOST_URL=${hostUrl}`,
    '-e', `SONAR_TOKEN=${token}`,
    '-v', `${process.cwd()}:/usr/src`,
    'sonarsource/sonar-scanner-cli',
  ],
  { stdio: 'inherit' }
);

process.exit(result.status ?? 1);
