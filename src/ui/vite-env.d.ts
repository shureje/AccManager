/// <reference types="vite/client" />


interface IElectronAPI {
  getAccounts: () => Promise<any[]>;
  createAccount: (account: Account) => Promise<{success: boolean, id?: number, error?: string}>;
  deleteAccountsById: (ids: number | number[]) => Promise<{success: boolean, id?: number, error?: string}>;
  updateAccount: (id: number, dto: Partial<Account>) => Promise<{success: boolean, data?: Account, error?: string}>;
  getOne: (id: number) => Promise<Account | null>;

  close: () => void;
  minimize: () => void;
  maximize: () => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}

export {};