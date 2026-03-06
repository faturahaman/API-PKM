import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum LogActivityAction {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    SWITCH_CONTEXT = 'SWITCH_CONTEXT',
}

@Entity('activity_logs')
@Index('idx_activity_log_puskesmas', ['puskesmas_id'])
@Index('idx_activity_log_created', ['created_at'])
@Index('idx_activity_log_admin', ['admin_id'])
@Index('idx_activity_log_puskesmas_created', ['puskesmas_id', 'created_at'])
export class LogActivity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    admin_id: string;

    @Column({ nullable: true })
    puskesmas_id: string;

    @Column({
        type: 'enum',
        enum: LogActivityAction,
    })
    action: string;

    @Column({ nullable: true })
    module: string;

    @Column({ nullable: true })
    entity_id: string;

    @Column({ type: 'json', nullable: true })
    payload_before: Record<string, any>;

    @Column({ type: 'json', nullable: true })
    payload_after: Record<string, any>;

    @Column({ nullable: true })
    ip_address: string;

    @Column({ nullable: true })
    user_agent: string;

    @CreateDateColumn()
    created_at: Date;
}
