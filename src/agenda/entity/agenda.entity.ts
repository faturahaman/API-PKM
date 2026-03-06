
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('agenda')
@Index('idx_agenda_puskesmas_created', ['puskesmas_id', 'created_at'])
export class Agenda {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Tenant isolation
    @Column({ nullable: true })
    puskesmas_id: string;

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
