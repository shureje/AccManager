import {app, BrowserWindow, ipcMain} from 'electron'
import path from 'path'
import { isDev } from './util.js';
import { getPreloadPath } from './pathResolver.js';
import './database.js';
import { accountsDB, db } from './database.js';



app.on('ready', () => {
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 700,
    minHeight: 500,
    backgroundColor: '#0a0a0a',
    show: false,
    autoHideMenuBar: true,
    icon: path.join( app.getAppPath(), '/public/x.jpg'),
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
  mainWindow.setTitle('FiatLocker');
})

ipcMain.handle('get-accounts', async() => {
  try {
    return await accountsDB.getAll();
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return [];
  }
})

ipcMain.handle('add-account', async(event, accountData) => {
  try {
    console.log('Received data:', accountData);
    
    // Проверяем что БД готова
    if (!db) {
      throw new Error('Database not initialized');
    }
    
    const id = await accountsDB.createAccount(accountData);
    console.log('Account created with ID:', id);
    return { success: true, id };
  } catch (error) {
    console.error('Error adding account:', error);
    return { success: false, error: error};
  }
})
