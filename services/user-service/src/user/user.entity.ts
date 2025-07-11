import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";

export enum UserRole{
    ADMIN = 'admin',
    EDITOR = 'editor',
    VIEWER = 'viewer'
}

@Entity('User')
export class UserEntity{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({unique: true})
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column()
    role: string;

}