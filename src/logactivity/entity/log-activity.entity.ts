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
@Index('idx_activity_log_action', ['action'])
@Index('idx_activity_log_module', ['module'])
@Index('idx_log_puskesma_created', ['puskesmas_id', 'created_at'])
@Index('idx_log_admin_created', ['admin_id', 'created_at'])
@Index('idx_log_module_action', ['module', 'action'])
export class LogActivity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  admin_id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  admin_name: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  puskesmas_id: string;

  @Column({
    type: 'enum',
    enum: LogActivityAction,
  })
  action: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  module: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  entity_id: string | null;

  @Column({ type: 'json', nullable: true })
  payload_before: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  payload_after: Record<string, any>;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip_address: string;

  @Column({ type: 'text', nullable: true })
  user_agent: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  route: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  method: string;

  @Column({ type: 'smallint', nullable: true })
  status_code: number;

  @CreateDateColumn()
  created_at: Date;
}