import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity('ingestions')
export class IngestionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  status: 'SUCCESS' | 'FAILED';

  @Column({ nullable: true })
  wordCount?: number;

  @Column({ nullable: true })
  pageCount?: number;

  @Column({ type: 'text', nullable: true })
  textPreview?: string;

  @CreateDateColumn()
  createdAt: Date;
}
