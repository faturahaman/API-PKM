import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('consultations') 
export class Consultation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ nullable: true }) 
  phone_number: string;

  @Column()
  subject: string;

  @Column({ type: 'text' }) 
  message: string;

  @Column({ default: false })
  is_answer: boolean;

  @Column({ default: false })
  is_publish: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}