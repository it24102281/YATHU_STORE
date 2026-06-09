const net = require('net');
const { spawn } = require('child_process');
const path = require('path');

const CLIENT_PORT = 3000;
const HOST = '127.0.0.1';

const isPortOpen = (port, host) =>
  new Promise((resolve) => {
    const socket = new net.Socket();

    socket.setTimeout(1000);

    const finish = (result) => {
      socket.destroy();
      resolve(result);
    };

    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
    socket.connect(port, host);
  });

const startClient = () => {
  const clientDir = path.join(__dirname, '..', 'client');
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

  const child = spawn(npmCommand, ['start'], {
    cwd: clientDir,
    stdio: 'inherit',
    shell: false,
  });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
};

const main = async () => {
  const portInUse = await isPortOpen(CLIENT_PORT, HOST);

  if (portInUse) {
    console.log(
      `[client] Port ${CLIENT_PORT} is already in use. Keeping the existing frontend and skipping a duplicate React start.`
    );
    console.log(`[client] Open http://localhost:${CLIENT_PORT} in your browser and keep this terminal running.`);
    return;
  }

  startClient();
};

main().catch((error) => {
  console.error('[client] Failed to start the frontend helper:', error);
  process.exit(1);
});
