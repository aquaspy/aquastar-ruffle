const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  pickServer: (srv) => ipcRenderer.send('server-picked', srv)
});
