import "reflect-metadata";
import { app } from 'electron';
import { DataSource, Repository } from "typeorm";
import { Account } from "./entities/Account.js";
import { postgresManager } from "./postgresDB.js";
import { AccountRepository } from "./repositories/AccountRepository.js";


let dataSource: DataSource;

export const initDatabase = async (): Promise<boolean> => {
    try {
        dataSource = postgresManager.getDataSource([Account]);

        await dataSource.initialize();
        return true;
    } catch (error) {
        console.log('TypeORM initialization failed:', error);
        return false;
    }
}

export const getDataSource = (): DataSource => {
    if (!dataSource) {
        throw new Error('Database is not initialized');
    }
    return dataSource;
}