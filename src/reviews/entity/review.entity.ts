
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum ReviewCategory {
    PELAYANAN = 'Pelayanan',
    FASILITAS = 'Fasilitas',
    TENAGA_MEDIS = 'Tenaga Medis',
    LAINNYA = 'Lainnya',
}

@Entity('reviews')
@Index('idx_review_puskesmas_created', ['puskesmas_id', 'created_at'])
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Tenant isolation
    @Column({ nullable: true })
    puskesmas_id: string;

    @Column({ default: 'Anonim' })
    username: string;

    @Column({ type: 'text' })
    message: string;

    @Column({
        type: 'enum',
        enum: ReviewCategory,
    })
    category: string;

    @Column({ default: false })
    is_publish: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
