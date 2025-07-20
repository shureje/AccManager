import { IsEmail, IsNotEmpty, length, Length } from "class-validator";
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
    @IsNotEmpty({ message: 'Login is required' })
    login: string;
    
    @Column()
    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    @Column({nullable: true})
    nickname: string;

    @Column('smallint', {nullable: true})
    pts: number;

    @Column()
    @IsEmail({},{message: 'Invalid email'} )
    @IsNotEmpty({message: 'Email is required'})
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
    @Length(0, 100, {message: 'Note can be max lenght 100'})
    note: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}