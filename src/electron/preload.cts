import { ipcRenderer } from "electron";
import { Account } from "./entities/Account";


const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electronAPI', {
    getAccounts: () => ipcRenderer.invoke('get-accounts'),
    createAccount: (account: Account) => ipcRenderer.invoke('create-account', account),
    deleteAccountsById: (ids: number | number[]) => ipcRenderer.invoke('delete-accounts', ids),
    getOne: (id: number) => ipcRenderer.invoke('get-one-account', id),
    updateAccount: (id: number, updates: Partial<Account>) => ipcRenderer.invoke('update-account', id, updates),

    close: () => ipcRenderer.invoke('close'),
    minimize: () => ipcRenderer.invoke('minimize'),
    maximize: () => ipcRenderer.invoke('maximize'),
})