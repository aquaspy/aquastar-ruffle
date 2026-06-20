const { app, BrowserWindow, Menu } = require('electron');
const WebSocket = require('ws');
const net = require('net');

Menu.setApplicationMenu(null);

/* ---------- WebSocket → TCP proxy (open relay on localhost) ---------- */
const wss = new WebSocket.Server({ port: 8181, host: '127.0.0.1', perMessageDeflate: false });

wss.on('connection', (ws, req) => {
  const u = new URL(req.url, 'http://localhost');
  const host = u.searchParams.get('host');
  const port = Number(u.searchParams.get('port'));

  if (!host || !port) {
    ws.close(1008, 'missing host or port');
    return;
  }

  const tgt = net.createConnection({ port, host, noDelay: true });

  tgt.on('data', d => {
    if (ws.readyState === WebSocket.OPEN) ws.send(d);
  });
  tgt.on('close', () => ws.close());
  tgt.on('error', e => ws.close(1011, e.message));

  ws.on('message', m => tgt.write(m));
  ws.on('close', () => tgt.destroy());
  ws.on('error', () => tgt.destroy());
});

/* ---------- game window ---------- */
let gameWin;

function createGameWindow() {
  gameWin = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
    autoHideMenuBar: true,
    fullscreenable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webgl: true,
      backgroundThrottling: false,
      allowRunningInsecureContent: false
    }
  });

  gameWin.loadFile('index.html');
  gameWin.once('ready-to-show', () => gameWin.show());
  gameWin.on('closed', () => gameWin = null);
}

app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('enable-oop-rasterization');
app.commandLine.appendSwitch('enable-accelerated-video');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-background-timer-throttling');

app.whenReady().then(createGameWindow);
app.on('window-all-closed', () => app.quit());