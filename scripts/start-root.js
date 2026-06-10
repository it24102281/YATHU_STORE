const { spawn } = require('child_process');
const path = require('path');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const rootDir = path.join(__dirname, '..');

const run = (args) => {
  const child = spawn(npmCommand, args, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: false,
  });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
};

const isProduction = process.env.NODE_ENV === 'production';
const serverOnly = process.env.START_SERVER_ONLY === 'true';

if (isProduction || serverOnly) {
  run(['run', 'start:server']);
} else {
  console.log('[start] Local development detected. Starting both frontend and backend.');
  console.log('[start] Use `npm run start:server` if you only want the API on port 5001.');
  run(['run', 'dev']);
}
