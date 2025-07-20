import { ChildProcess, spawn } from "child_process";
import { app } from "electron";
import path, { dirname } from 'path'
import fs from 'fs'
import { DataSource } from "typeorm";

class PostgresManager {

    private pgProcess: ChildProcess | null = null;
    private dataDir: string;
    private binDir: string;
    private port: number = 5536 // 5432 + Math.floor(Math.random() * 1000);

    constructor() {
        const documentsFolder = app.getPath('documents');
        const appFolder = path.join(documentsFolder, 'FiatLocker');
        this.dataDir = path.join(appFolder, 'pgdata');
       this.binDir = app.isPackaged 
        ? path.join(process.resourcesPath, 'postgres-bin', 'bin')
        : path.join(app.getAppPath(), 'postgres-bin', 'bin');

    }

    async start(): Promise<boolean> {
        if (!fs.existsSync(this.dataDir)) {
            await this.initDB();
        }
        const serverStarted = await this.startServer();

        if (serverStarted) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await this.createDatabase();

            const connected = await this.testConnection();
            console.log('Database connection test:', connected);
            return connected;
        }

        return false;
    }
    
    private async initDB(): Promise<void> {
        return new Promise((resolve, reject) => {
            const initDbPath = path.join(this.binDir, 'initdb.exe');

            const pwfile = path.join(this.dataDir, '..', 'pwfile');
            if (!fs.existsSync(path.dirname(pwfile))) {
                fs.mkdirSync(path.dirname(pwfile), {recursive: true});
            }
            fs.writeFileSync(pwfile, 'uY32lksI');

            const initProcess = spawn(initDbPath, [
                '-D',
                this.dataDir,
                '-U', 'postgres',
                '--pwfile', pwfile,
                '--auth-local=md5',
                '--auth-host=md5'
            ])

            initProcess.on('close', (code) => {
                fs.unlinkSync(pwfile);
                console.log('initdb finished with code:', code);
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`db init failed with code ${code}`));
                }

            });
        });

    }

    private async startServer(): Promise<boolean> {
        return new Promise((resolve) => {
            const postgresPath = path.join(this.binDir, 'postgres.exe');

            this.pgProcess = spawn(postgresPath, [
                '-D', this.dataDir,
                '-p', this.port.toString()
            ]);

            this.pgProcess.on('spawn', () => resolve(true));
            this.pgProcess.on('error', () => resolve(false));

            console.log('server started on port:', this.port);
        })
    }
 
    private async createDatabase(): Promise<void> {
        return new Promise((resolve, reject) => {
            const createdPath = path.join(this.binDir, 'createdb.exe');

            const createProcess = spawn(createdPath, [
                '-h', 'localhost',
                '-p', this.port.toString(),
                '-U', 'postgres',
                'accmanager'
            ], {
                env: {...process.env, PGPASSWORD: 'uY32lksI'}
            })

            createProcess.on('close', (code) => {
                console.log('Db create finished with code:', code);
                resolve();
            })
        })
    }

    async stop(): Promise<void> {
        if (this.pgProcess) {
            this.pgProcess.kill('SIGTERM');
            this.pgProcess = null;
            console.log('PostgreSQL stopped');
        }
    }

    async testConnection(): Promise<boolean> {
        return new Promise((resolve) => {
            const psqlPath = path.join(this.binDir, 'psql.exe');

            const testProcess = spawn(psqlPath, [
                '-h', 'localhost',
                '-p', this.port.toString(),
                '-U', 'postgres',
                '-d', 'accmanager',
            '-c', 'SELECT 1;'
            ], {
                env: {...process.env, PGPASSWORD: 'uY32lksI'}
            });

            testProcess.on('close', (code) => {
                console.log('Connection test finished with code:', code);
                resolve(code === 0);
            })

            testProcess.on('error', () => {
                resolve(false);
            })
        })
    }

     getConnectionConfig() {
        return {
            host: 'localhost',
            port: this.port,
            user: 'postgres',
            password: 'uY32lksI',
            database: 'accmanager'
        };
    }

    getDataSource(entities: any[] = []): DataSource {
        return new DataSource({
            type: 'postgres',
            host: 'localhost',
            port: this.port,
            username: 'postgres',
            password: 'uY32lksI',
            database: 'accmanager',
            synchronize: true,
            logging: false,
            entities: entities,
        });
    }
}


export const postgresManager = new PostgresManager();