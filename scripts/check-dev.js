const { spawn } = require('child_process');
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

function runAndCheck(cmd, env, pattern, timeoutMs) {
  return new Promise((resolve) => {
    const child = spawn(cmd, {
      shell: true,
      env: { ...process.env, ...env },
      detached: true,
    });

    let output = '';

    const kill = () => {
      try {
        process.kill(-child.pid, 'SIGKILL');
      } catch {
        /* ignore */
      }
    };

    const timer = setTimeout(() => {
      kill();
      resolve(false);
    }, timeoutMs);

    child.stdout.on('data', (d) => {
      output += d.toString();
      if (pattern.test(output)) {
        clearTimeout(timer);
        kill();
        resolve(true);
      }
    });

    child.stderr.on('data', (d) => {
      output += d.toString();
    });

    child.on('exit', () => {
      clearTimeout(timer);
      const ok = pattern.test(output);
      if (!ok) {
        console.error(output);
      }
      resolve(ok);
    });
  });
}

async function checkBackend() {
  const env = parseEnv(path.join(__dirname, '../backend/.env.example'));
  const ok = await runAndCheck(
    'pnpm --filter ./backend run start:dev',
    env,
    /Nest application successfully started/,
    30000,
  );
  if (!ok) throw new Error('backend dev failed');
}

async function checkFrontend() {
  const ok = await runAndCheck(
    'pnpm --filter ./frontend/app run dev',
    {},
    /Local:/,
    20000,
  );
  if (!ok) throw new Error('frontend dev failed');
}

async function main() {
  try {
    await checkBackend();
    await checkFrontend();
    console.log('dev servers started successfully');
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
}

main();
