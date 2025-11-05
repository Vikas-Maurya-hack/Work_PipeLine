const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getDataFolder: () => ipcRenderer.invoke('get-data-folder'),
  saveLeads: (leads) => ipcRenderer.invoke('save-leads', leads),
  loadLeads: () => ipcRenderer.invoke('load-leads'),
  exportLeads: (leads) => ipcRenderer.invoke('export-leads', leads),
  isElectron: true
});