import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DocumentEntity{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    filename: string;

    @Column()
    originalname:string;

    @Column()
    mimetype: string;

    @Column()
    size: number;

    @Column({ nullable: true})
    description: string;

    @CreateDateColumn()
    uploadedAt: Date;

}