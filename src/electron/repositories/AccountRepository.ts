import { Repository } from "typeorm";
import { Account } from "../entities/Account.js";
import { getDataSource } from "../database.js";


export class AccountRepository {

    private get repository(): Repository<Account> {
        return getDataSource().getRepository(Account);
    }

    async getAll(): Promise<Account[]> {
        return await this.repository.find({order: {id: 'ASC'}});
    }
}


export const accountDB = new AccountRepository()