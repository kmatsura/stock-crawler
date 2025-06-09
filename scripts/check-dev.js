const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function parseEnv(file) {
  const env = {};
  const content = fs.readFileSync(file, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    const value = rest.join('=');
    env[key] = value.split('#')[0].trim() || 'test';
  }
  return env;
}

function runWithTimeout(cmd, env, timeoutMs) {
  try {
    return execSync(`timeout ${timeoutMs/1000}s bash -c '${cmd}'`, { env: { ...process.env, ...env }, encoding: 'utf8', stdio: 'pipe' });
  } catch (err) {
    // timeout exits with non-zero; still return captured output
    return (err.stdout || '') + (err.stderr || '');
  }
}

function checkBackend() {
  const env = parseEnv(path.join(__dirname, '../backend/.env.example'));
  const out = runWithTimeout('pnpm --filter ./backend run start:dev', env, 15000);
  if (!/Nest application successfully started/.test(out)) throw new Error('backend dev failed');
}

function checkFrontend() {
  const out = runWithTimeout('pnpm --filter ./frontend/app run dev', {}, 15000);
  if (!/Local:/.test(out)) throw new Error('frontend dev failed');
}

try {
  checkBackend();
  checkFrontend();
  console.log('dev servers started successfully');
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}
