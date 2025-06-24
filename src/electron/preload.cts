import { ipcRenderer } from "electron";

const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electronAPI', {
    getAccounts: () => ipcRenderer.invoke('get-accounts')
})