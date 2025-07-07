import path from 'path';
import { app } from 'electron';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import { isDev } from './util.js';

export interface Account {
    id: number;
    login: string;
    password: string;
    nickname: string;
    pts: number;
    email: string;
    phone?: string;
    created_at: string;
    updated_at: string;
}

let db: sqlite3.Database;

    const documents = app.getPath('documents');
    const appFolder = path.join(documents, 'FiatLocker');
    
app.whenReady().then(() => {
    try {
        if (!fs.existsSync(appFolder)) {
            fs.mkdirSync(appFolder, {recursive: true});
        }
        
        const dbPath = isDev() ? path.join(appFolder, 'accounts-dev.db') : path.join(appFolder, 'accounts.db');
        
        db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Database connection failed:', err);
                return;
            }
            
            db.run(`
                CREATE TABLE IF NOT EXISTS accounts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    login TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL,
                    nickname TEXT NOT NULL,
                    pts INTEGER NOT NULL DEFAULT 0,
                    email TEXT NOT NULL,
                    phone TEXT,
                    created_at TEXT DEFAULT (datetime('now', 'localtime')),
                    updated_at TEXT DEFAULT (datetime('now', 'localtime'))
                )
            `, (err) => {
                if (err) {
                    console.error('Table creation failed:', err);
                } else {
                    console.log('Database initialized successfully!');
                }
            });
        });
        
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
});



// function insertTestData() {
//     const testAccounts = [
//         { login: 'alex_gamer', password: 'secure123', nickname: 'AlexTheGreat', pts: 1500, email: 'alex@gmail.com', phone: '+79161234567' },
//         { login: 'maria_pro', password: 'mypass456', nickname: 'MariaPro', pts: 2000, email: 'maria@yandex.ru', phone: '+79162345678' },
//         { login: 'dmitry_king', password: 'king789', nickname: 'DmitryKing', pts: 1200, email: 'dmitry@mail.ru', phone: '+79163456789' },
//         { login: 'anna_star', password: 'star321', nickname: 'AnnaStar', pts: 1800, email: 'anna@outlook.com', phone: '+79164567890' },
//         { login: 'sergey_wolf', password: 'wolf654', nickname: 'SergeyWolf', pts: 2200, email: 'sergey@rambler.ru', phone: '+79165678901' },
//         { login: 'elena_moon', password: 'moon987', nickname: 'ElenaMoon', pts: 1600, email: 'elena@gmail.com', phone: '+79166789012' },
//         { login: 'ivan_fire', password: 'fire147', nickname: 'IvanFire', pts: 1900, email: 'ivan@yandex.ru', phone: '+79167890123' },
//         { login: 'olga_ice', password: 'ice258', nickname: 'OlgaIce', pts: 1400, email: 'olga@mail.ru', phone: '+79168901234' },
//         { login: 'pavel_storm', password: 'storm369', nickname: 'PavelStorm', pts: 2100, email: 'pavel@gmail.com', phone: '+79169012345' },
//         { login: 'natasha_wind', password: 'wind741', nickname: 'NatashaWind', pts: 1700, email: 'natasha@outlook.com', phone: '+79160123456' },
//         { login: 'roman_eagle', password: 'eagle852', nickname: 'RomanEagle', pts: 1300, email: 'roman@rambler.ru', phone: '+79161234568' },
//         { login: 'julia_rose', password: 'rose963', nickname: 'JuliaRose', pts: 2300, email: 'julia@gmail.com', phone: '+79162345679' },
//         { login: 'maxim_lion', password: 'lion159', nickname: 'MaximLion', pts: 1550, email: 'maxim@yandex.ru', phone: '+79163456780' },
//         { login: 'victoria_sun', password: 'sun753', nickname: 'VictoriaSun', pts: 1850, email: 'victoria@mail.ru', phone: '+79164567891' },
//         { login: 'andrey_shark', password: 'shark486', nickname: 'AndreyShark', pts: 2050, email: 'andrey@outlook.com', phone: '+79165678902' }
//     ]



//     const statement = db.prepare(`
//     INSERT OR IGNORE INTO accounts (login, password, nickname, pts, email, phone)
//     VALUES (?, ?, ?, ?, ?, ?)`
//     );
    
//     testAccounts.forEach(account => {
//         statement.run([account.login, account.password, account.nickname, account.pts, account.email, account.phone]);
//     });


//     statement.finalize();
//     console.log('Test data inserted successfully!');

// }

export const accountsDB = {
    getAll: (): Promise<Account[]> => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM accounts ORDER BY id', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows as Account[]);
                }
            });
        });
    },

    createAccount: (account: Omit<Account, 'id' | 'created_at' | 'updated_at'>): Promise<number> => {
        return new Promise((resolve, reject) => {
            
            {/*начало валидации*/}
            const RequiredFields = ['login', 'password', 'nickname', 'email'];

            if (!account.login && !account.password && !account.email && !account.nickname && !account.pts) {
                reject(new Error('Required fields are empry'));
                return;
            }

            for (const field of RequiredFields) {
                if (!account[field as keyof typeof account]) {
                    reject(new Error(`${field} is required`));
                    return;
                }
            }
            if (!account.pts) {
                reject(new Error('Pts is required'));
                return;
            }
            if (account.pts < 0 || account.pts > 20000) {
                reject(new Error('Incorrect value'));
                return;
            }
            
            {/*конец валидации*/}

            const statement = db.prepare(`
                INSERT INTO accounts (login, password, nickname, pts, email, phone)
                VALUES (?, ?, ?, ?, ?, ?)
            `);

            statement.run([account.login, account.password, account.nickname, account.pts, account.email, account.phone], 
                function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });

            statement.finalize();
        }); 
    },

    deleteAccounts: (ids: number | number[]): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            if (!ids || Array.isArray(ids) && ids.length === 0) {
                reject(new Error(`ID is required`));
                return;
            }
            
            const idsArray = Array.isArray(ids) ? ids : [ids];
            const placeholders = idsArray.map(() => '?').join(', ');

            const statement = db.prepare(`
                DELETE FROM accounts WHERE id IN (${placeholders})
            `);

            statement.run(idsArray, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0);
                }
            });

            statement.finalize();
        });
    },

    updateAccount: (id: number, updateDto: Partial<Omit<Account, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            if (!id) {
                reject(new Error(`ID is required`));
                return;
            }

            if (Object.keys(updateDto).length === 0) {
                reject(new Error(`No updates provided`));
                return;
            }

            if (updateDto.pts !== undefined) {
                if (updateDto.pts < 0 || updateDto.pts > 20000) {
                    reject(new Error('Incorrect pts value'));
                    return;
                }
            }

            const fields = Object.keys(updateDto);
            const values = Object.values(updateDto);

            const mapedString = fields.map(field => `${field} = ?`).join(',');

            const sql = `UPDATE accounts SET ${mapedString}, updated_at = datetime('now', 'localtime') WHERE id = ?`;

            values.push(id);

            const statement = db.prepare(sql);

            statement.run(values, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0);
                }
            });
        })
    }
};

export { db };