import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum PuskesmasStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
    MAINTENANCE = 'MAINTENANCE',
}

@Entity('puskesmas')
export class Puskesmas {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true, length: 100 })
    slug: string;

    @Column({
        type: 'enum',
        enum: PuskesmasStatus,
        default: PuskesmasStatus.ACTIVE,
    })
    status: string;

    // === Tenant Status Tracking Fields ===

    @Column({ nullable: true, length: 500 })
    suspended_reason: string;

    @Column({ type: 'datetime', nullable: true })
    suspended_at: Date;

    @Column({ nullable: true })
    suspended_by: string;

    @Column({ type: 'datetime', nullable: true })
    deactivated_at: Date;

    @Column({ nullable: true })
    deactivated_by: string;

    @Column({ nullable: true })
    deactivated_reason: string;

    @Column({ type: 'datetime', nullable: true })
    activated_at: Date;

    @Column({ nullable: true })
    activated_by: string;

    @Column({ type: 'datetime', nullable: true })
    maintenance_started_at: Date;

    @Column({ nullable: true })
    maintenance_message: string;

    // === Timestamps ===

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
