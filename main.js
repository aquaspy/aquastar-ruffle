const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');    
const WebSocket = require('ws');
const net = require('net');

// Remove menu bar completely
Menu.setApplicationMenu(null);

/* ---------- 1.  single WebSocket→TCP proxy ---------- */
const wss = new WebSocket.Server({ port: 8181, host: '127.0.0.1' });

wss.on('connection', (ws, req) => {
  const u = new URL(req.url, 'http://localhost');
  const host = u.searchParams.get('host') || 'socket2.aq.com';
  const port = Number(u.searchParams.get('port') || 5591);

  const tgt = net.createConnection(port, host);

  tgt.on('data',  d => ws.send(d));
  tgt.on('close', () => ws.close());
  tgt.on('error', e => ws.close(1011, e.message));

  ws.on('message', m => tgt.write(m));
  ws.on('close', () => tgt.destroy());
  ws.on('error', () => tgt.destroy());
});

/* ---------- 2.  windows ---------- */
let selectWin, gameWin;

function createSelectWindow() {
  selectWin = new BrowserWindow({
    width: 400,
    height: 200,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Remove scrollbars from select window
  selectWin.webContents.on('dom-ready', () => {
    selectWin.webContents.insertCSS(`
      body { overflow: hidden !important; }
      ::-webkit-scrollbar { display: none !important; }
    `);
  });

  selectWin.loadFile('server_select.html');
  selectWin.on('closed', () => selectWin = null);
}

function createGameWindow(server) {
  gameWin = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: false,
    autoHideMenuBar: true, // Remove title menu
    fullscreenable: true,
    webPreferences: { 
      nodeIntegration: false, 
      contextIsolation: true,
      webgl: true, // Enable hardware acceleration
      allowRunningInsecureContent: false,
      contextIsolation: true
    }
  });

  gameWin.loadURL(`file://${__dirname}/index.html?server=${server}`);
  gameWin.once('ready-to-show', () => gameWin.show());
  gameWin.on('closed', () => gameWin = null);
}

/* ---------- 3.  ipc ---------- */
ipcMain.on('server-picked', (_, srv) => {
  if (selectWin) selectWin.close();
  createGameWindow(srv);
});

// Enable hardware acceleration for better performance
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('enable-oop-rasterization');
app.commandLine.appendSwitch('enable-accelerated-video');

/* ---------- 4.  bootstrap ---------- */
app.whenReady().then(createSelectWindow);
app.on('window-all-closed', () => app.quit());