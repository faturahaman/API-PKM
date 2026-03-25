import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('consultations')
@Index('idx_consultation_puskesmas_created', ['puskesmas_id', 'created_at'])
export class Consultation {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Column({ nullable: true })
  puskesmas_id: string;

  @ApiProperty({ example: 'johndoe' })
  @Column()
  username: string;

  @ApiProperty({ example: 'john@example.com' })
  @Column({})
  email: string;

  @ApiProperty({ example: 'Pertanyaan tentang layanan kesehatan' })
  @Column()
  subject: string;

  @ApiProperty({ example: 'Saya ingin bertanya mengenai prosedur rawat jalan di puskesmas ini...' })
  @Column({ type: 'text' })
  message: string;

  @ApiPropertyOptional({ example: 'Terima kasih atas pertanyaan Anda. Untuk layanan rawat jalan...' })
  @Column({ type: 'text', nullable: true })
  answer: string;

  @ApiProperty({ example: false })
  @Column({ default: false })
  is_answer: boolean;

  @ApiProperty({ example: false })
  @Column({ default: false })
  is_publish: boolean;

  @ApiProperty({ example: '2026-03-24T21:19:36Z' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ example: '2026-03-24T21:19:36Z' })
  @UpdateDateColumn()
  updated_at: Date;
}
