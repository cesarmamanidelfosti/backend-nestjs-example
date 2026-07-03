#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const config = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'governance.config.json'), 'utf8')
).commitMessage;

const projectCode = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'governance.config.json'), 'utf8')
).project.code;

const msgFile = process.argv[2];
const raw = fs.readFileSync(msgFile, 'utf8');

// Ignora líneas de comentario que Git agrega (empiezan con #) y la línea final vacía
const lines = raw.split('\n').filter((l) => !l.startsWith('#'));
while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();

const subject = lines[0] || '';
const body = lines.slice(1);
const errors = [];

const prefixRegex = new RegExp(config.prefixPattern);
if (!prefixRegex.test(subject)) {
  errors.push(`Debe iniciar con el prefijo de tarjeta, ej: [${projectCode}-145] descripción del cambio.`);
}

if (subject.length > config.maxSubjectLength) {
  errors.push(`La primera línea tiene ${subject.length} caracteres (máximo ${config.maxSubjectLength}).`);
}

const subjectWithoutPrefix = subject.replace(/^\[[A-Z][A-Z0-9]*-\d+\]\s?/, '').trim();
if (subjectWithoutPrefix.length < config.minSubjectLength) {
  errors.push(`La descripción es muy corta (mínimo ${config.minSubjectLength} caracteres, sin contar el prefijo).`);
}

if (lines.length > config.maxTotalLines) {
  errors.push(`El mensaje tiene ${lines.length} líneas (máximo ${config.maxTotalLines}).`);
}

const longLines = body.filter((l) => l.length > config.maxBodyLineLength);
if (longLines.length > 0) {
  errors.push(`${longLines.length} línea(s) del cuerpo superan ${config.maxBodyLineLength} caracteres.`);
}

if (errors.length > 0) {
  console.error('\n❌ Commit rechazado — convención de mensaje (sección 9.6 del lineamiento):\n');
  errors.forEach((e) => console.error(`   - ${e}`));
  console.error(
    `\n   Formato esperado: [${projectCode}-<ID>] <tipo>: <descripción>\n` +
    `   Ejemplo: [${projectCode}-145] feat: agregar login con Google SSO\n`
  );
  process.exit(1);
}

console.log('✅ Mensaje de commit válido.');
process.exit(0);
