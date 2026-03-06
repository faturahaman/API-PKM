
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('banners')
@Index('idx_banner_puskesmas_created', ['puskesmas_id', 'created_at'])
export class Banner {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Tenant isolation
    @Column({ nullable: true })
    puskesmas_id: string;

    @Column()
    image_path: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: true })
    is_publish: boolean;

    @Column({ default: 0, select: false })
    is_deleted: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
