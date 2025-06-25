import { ipcRenderer } from "electron";
import { Account } from "./database";

const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electronAPI', {
    getAccounts: () => ipcRenderer.invoke('get-accounts'),
    createAccount: (accountData: Account) => ipcRenderer.invoke('add-account', accountData)
})