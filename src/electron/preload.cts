import { ipcRenderer } from "electron";
import { Account } from "./database";

const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electronAPI', {
    getAccounts: () => ipcRenderer.invoke('get-accounts'),
    createAccount: (accountData: Account) => ipcRenderer.invoke('add-account', accountData),
    deleteAccounts: (ids: number | number[]) => ipcRenderer.invoke('delete-accounts', ids),
    updateAccount: (id: number, accountData: Account) => ipcRenderer.invoke('update-account', id, accountData)
})