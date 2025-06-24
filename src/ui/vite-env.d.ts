/// <reference types="vite/client" />
interface IElectronAPI {
  getAccounts: () => Promise<any[]>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}

export {};