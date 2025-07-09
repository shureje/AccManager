import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


enum AccountType {
    STEAM = 'steam',
    EPIC_GAMES = 'epic games',
    FACEIT = 'faceit',
    HOYOPLAY = 'hoyoplay', 
    YOSTAR = 'yostar',
    OTHER = 'other'
}

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    login: string;
    
    @Column()
    password: string;

    @Column({nullable: true})
    nickname: string;

    @Column('smallint', {nullable: true})
    pts: number;

    @Column()
    email: string;

    @Column({nullable: true})
    emailPassword: string;

    @Column({nullable: true})
    phone: string;

    @Column({
        type: 'enum',
        enum: AccountType,
        default: AccountType.OTHER
    })
    type: AccountType;

    @Column('text', {nullable: true})
    note: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}