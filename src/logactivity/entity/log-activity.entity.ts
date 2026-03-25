import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum LogActivityAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  SWITCH_CONTEXT = 'SWITCH_CONTEXT',
  ACTIVATE_TENANT = 'ACTIVATE_TENANT',
  INACTIVATE_TENANT = 'INACTIVATE_TENANT',
  SUSPEND_TENANT = 'SUSPEND_TENANT',
  MAINTENANCE_TENANT = 'MAINTENANCE_TENANT',
}

@Entity('activity_logs')
@Index('idx_activity_log_puskesmas', ['puskesmas_id'])
@Index('idx_activity_log_created', ['created_at'])
@Index('idx_activity_log_admin', ['admin_id'])
@Index('idx_activity_log_puskesmas_created', ['puskesmas_id', 'created_at'])
@Index('idx_activity_log_action', ['action'])
export class LogActivity {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ========================
  // RELATION / IDENTIFIER
  // ========================
  @ApiPropertyOptional({ example: 'uuid-admin' })
  @Column({ type: 'char', length: 36, nullable: true })
  admin_id: string;

  @ApiPropertyOptional({ example: 'uuid-puskesmas' })
  @Column({ type: 'char', length: 36, nullable: true })
  puskesmas_id: string;

  @ApiPropertyOptional({ example: 'uuid-entity' })
  @Column({ type: 'char', length: 36, nullable: true })
  entity_id: string | null;

  // ========================
  // CORE LOG
  // ========================
  @ApiProperty({ enum: LogActivityAction })
  @Column({
    type: 'enum',
    enum: LogActivityAction,
  })
  action: string;

  // 🔥 dipindah ke TEXT (biar gak makan row size)
  @ApiPropertyOptional({ example: 'Admin User' })
  @Column({ type: 'text', nullable: true })
  admin_name: string;

  @ApiPropertyOptional({ example: 'agenda' })
  @Column({ type: 'text', nullable: true })
  module: string;

  // ========================
  // PAYLOAD (AMAN)
  // ========================
  @ApiPropertyOptional({ description: 'Data sebelum perubahan' })
  @Column({ type: 'json', nullable: true })
  payload_before: Record<string, any>;

  @ApiPropertyOptional({ description: 'Data setelah perubahan' })
  @Column({ type: 'json', nullable: true })
  payload_after: Record<string, any>;

  // ========================
  // REQUEST INFO
  // ========================
  @ApiPropertyOptional({ example: '192.168.1.1' })
  @Column({ type: 'varchar', length: 45, nullable: true })
  ip_address: string;

  @ApiPropertyOptional({ example: 'Mozilla/5.0...' })
  @Column({ type: 'text', nullable: true })
  user_agent: string;

  // 🔥 ubah ke TEXT (ini salah satu penyebab utama error)
  @ApiPropertyOptional({ example: '/api/v1/agenda' })
  @Column({ type: 'text', nullable: true })
  route: string;

  @ApiPropertyOptional({ example: 'POST' })
  @Column({ type: 'varchar', length: 10, nullable: true })
  method: string;

  @ApiPropertyOptional({ example: 200 })
  @Column({ type: 'smallint', nullable: true })
  status_code: number;

  // ========================
  // TIMESTAMP
  // ========================
  @ApiProperty({ example: '2026-03-24T21:19:36Z' })
  @CreateDateColumn()
  created_at: Date;
}