import { Repository } from "typeorm";
import { Account } from "../entities/Account.js";
import { getDataSource } from "../database.js";
import { validate } from "class-validator";


export class AccountRepository {

    private get repository(): Repository<Account> {
        return getDataSource().getRepository(Account);
    }

    async getAll(): Promise<Account[]> {
        return await this.repository.find({order: {id: 'ASC'}});
    }

    async getOne(id: number): Promise<Account | null> {
        return await this.repository.findOneBy({id: id});
    }

    async createAccount(accountData: Partial<Account>): Promise<Account> {
        const account = this.repository.create(accountData);
        const errors = await validate(account);
        if (errors.length > 0) {
            const errorMessages = errors.map(e => Object.values(e.constraints || {}).join(', ')).join('; ');
            throw new Error(errorMessages);
        }
        return await this.repository.save(account);
    }

    async deleteAccountsById(ids: number | number[]): Promise<Account[]> {
        const idsArray = Array.isArray(ids) ? ids : [ids];
        const accounts = await this.repository.findByIds(idsArray);
        await this.repository.delete(idsArray);
        return accounts;
    }

    async updateAccount(id: number, updates: Partial<Account>): Promise<Account> {
        const existingAccount = await this.repository.findOneBy({id});
        if (!existingAccount) {
            throw new Error('Account not found');
        }
        
        const updatedData = { ...existingAccount, ...updates };
        const accountInstance = this.repository.create(updatedData);
        
        const errors = await validate(accountInstance);
        if (errors.length > 0) {
            const errorMessages = errors.map(e => Object.values(e.constraints || {}).join(', ')).join('; ');
            throw new Error(errorMessages);
        }
        
        return await this.repository.save(accountInstance);
    }

    async resetSequence(): Promise<void> {
        const maxId = await this.repository
        .createQueryBuilder()
        .select("MAX(id)", "max")
        .getRawOne();

        const nextVal = (maxId.max || 0) + 1;

        await this.repository.query(
            `ALTER SEQUENCE account_id_seq RESTART WITH ${nextVal}`
        );
    }


}


export const accountDB = new AccountRepository()