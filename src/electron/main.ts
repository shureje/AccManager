import "reflect-metadata";
import {app, BrowserWindow, ipcMain} from 'electron'
import path from 'path'
import { isDev } from './util.js';
import { getIconPath, getPreloadPath } from './pathResolver.js';
import './database.js';
import { postgresManager } from './postgresDB.js';
import { accountDB } from "./repositories/AccountRepository.js";
import { initDatabase } from "./database.js";
import { error } from "console";
import { Account } from "./entities/Account.js";




app.whenReady().then(async () => {

  try {
    console.log('starting PostreSQL...');
    const pgSstarted = await postgresManager.start();
    console.log('PostgreSQL started:', pgSstarted);

    if (pgSstarted) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('initializing TypeORM...');
      const dbInitialized = await initDatabase();
      if (dbInitialized) {
        accountDB.resetSequence();
      }
      console.log('TypeORM initialized:', dbInitialized);
    }
  } catch (error) {
    console.log('PostgreSQL start failed:', error);
  }

  const mainWindow = new BrowserWindow({
    width: 900,
    height: 500,
    minWidth: 700,
    minHeight: 500,
    backgroundColor: '#0a0a0a',
    show: false,
    roundedCorners: false,
    autoHideMenuBar: true,
    frame: false,
    icon: getIconPath(),
    transparent: false,
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
    },
    
  });

  if (isDev()) {
    mainWindow.loadURL('http://localhost:5123');
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
  mainWindow.show()
  })
})

app.on('before-quit', async () => {
  await postgresManager.stop();
})

ipcMain.handle('close', ()=> {
  app.quit();
})

ipcMain.handle('minimize', () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    focusedWindow.minimize();
  }
})

ipcMain.handle('maximize', () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    if (focusedWindow.isMaximized()) {
      focusedWindow.unmaximize();
    } else {
      focusedWindow.maximize();
    }
  }
  return focusedWindow?.isMaximized() || false;
});

ipcMain.handle('get-accounts', async() => {
  try {
    return await accountDB.getAll();
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return [];
  }
})

ipcMain.handle('create-account', async(event, accountData) => {
  try {
    console.log('Received data:', accountData);

    const id = await accountDB.createAccount(accountData);
    console.log('Account created with ID:', id);
    return { success: true, id };
  } catch (error) {
    console.error('Error adding account:', error);
    return { success: false, error: error};
  }
})

ipcMain.handle('delete-accounts', async(event, ids) => {
  try {
    await accountDB.deleteAccountsById(ids);
    console.log('Accounts deleted with IDs:', ids);
    return { success: true };
  } catch (error) {
    console.error('Error deleting accounts:', error);
    return { success: false, error: error};
  }
})

ipcMain.handle('get-one-account', async (event, id) => {
  try {
    await accountDB.getOne(id);
    console.log('Getted account with id:', id)
    return await accountDB.getOne(id);
  } catch (error) {
    console.log('Error getting accont:', error);
    return null;
  }
})

ipcMain.handle('update-account', async (event, id: number, updates: Partial<Account>) => {
  try {
      const account = await accountDB.updateAccount(id, updates);
      return { success: true, data: account };
  } catch (error: any) {
      console.error('Error updating account:', error);
      return { success: false, error: error.message };
  }
});
