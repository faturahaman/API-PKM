import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('consultations')
@Index('idx_consultation_puskesmas_created', ['puskesmas_id', 'created_at'])
export class Consultation {
  @PrimaryGeneratedColumn()
  id: number;

  // Tenant isolation
  @Column({ nullable: true })
  puskesmas_id: string;

  @Column()
  username: string;

  @Column({})
  email: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'text', nullable: true })
  answer: string;

  @Column({ default: false })
  is_answer: boolean;

  @Column({ default: false })
  is_publish: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
