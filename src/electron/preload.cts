const electron = require('electron');

electron.contextBridge.exposeInMainWorld('electron', {
    SubscribeStatistics: (callback: (statistics: any) => void) => callback({}),
    getStaticData: () => console.log('static'),
})