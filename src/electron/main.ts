import {app, BrowserWindow} from 'electron'
import path from 'path'
import { isDev } from './util.js';
import { getPreloadPath } from './pathResolver.js';



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