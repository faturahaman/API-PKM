
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('agenda')
export class Agenda {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    activity_name: string;

    @Column()
    date: Date;

    @Column()
    time: string;

    @Column()
    location: string;

    @Column({ nullable: true })
    effective_date: string;

    @Column({ default: false })
    is_deleted: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
