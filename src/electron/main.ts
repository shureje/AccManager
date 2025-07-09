import "reflect-metadata";
import {app, BrowserWindow, ipcMain} from 'electron'
import path from 'path'
import { isDev } from './util.js';
import { getIconPath, getPreloadPath } from './pathResolver.js';
import './database.js';
import { postgresManager } from './postgresDB.js';
import { accountDB } from "./repositories/AccountRepository.js";
import { initDatabase } from "./database.js";




app.whenReady().then(async () => {

  try {
    console.log('starting PostreSQL...');
    const pgSstarted = await postgresManager.start();
    console.log('PostgreSQL started:', pgSstarted);

    if (pgSstarted) {
      console.log('initializing TypeORM...');
      const dbInitialized = await initDatabase();
      console.log('TypeORM initialized:', dbInitialized);
    }
  } catch (error) {
    console.log('PostgreSQL start failed:', error);
  }

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 700,
    minHeight: 500,
    backgroundColor: '#0a0a0a',
    show: false,
    roundedCorners: false,
    autoHideMenuBar: true,
    frame: false,
    icon: getIconPath(),
    webPreferences: {
      preload: getPreloadPath(),
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

ipcMain.handle('get-accounts', async() => {
  try {
    return await accountDB.getAll();
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return [];
  }
})

// ipcMain.handle('add-account', async(event, accountData) => {
//   try {
//     console.log('Received data:', accountData);

//     const id = await accountsDB.createAccount(accountData);
//     console.log('Account created with ID:', id);
//     return { success: true, id };
//   } catch (error) {
//     console.error('Error adding account:', error);
//     return { success: false, error: error};
//   }
// })

// ipcMain.handle('delete-accounts', async(event, ids) => {
//   try {
//     await accountsDB.deleteAccounts(ids);
//     console.log('Accounts deleted with IDs:', ids);
//     return { success: true };
//   } catch (error) {
//     console.error('Error deleting accounts:', error);
//     return { success: false, error: error};
//   }
// })

// ipcMain.handle('update-account', async(event, id, accountData) => {
//   try {
//     await accountsDB.updateAccount(id, accountData);
//     console.log('Account updated with ID:', id);
//     return { success: true };
//   } catch (error) {
//     console.error('Error updating account:', error);
//     return { success: false, error: error};
//   }
// })

