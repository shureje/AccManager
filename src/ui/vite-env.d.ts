/// <reference types="vite/client" />
interface IElectronAPI {
  getAccounts: () => Promise<any[]>;
  createAccount: (account: Account) => Promise<{success: boolean, id?: number, error?: string}>;
  deleteAccounts: (ids: number | number[]) => Promise<{success: boolean, id?: number, error?: string}>;
  updateAccount: (id: number, account: Account) => Promise<{success: boolean, id?: number, error?: string}>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}

export {};