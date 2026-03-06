
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('videos')
@Index('idx_video_puskesmas_created', ['puskesmas_id', 'upload_date'])
export class Video {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Tenant isolation
    @Column({ nullable: true })
    puskesmas_id: string;

    @Column()
    video_title: string;

    @Column({ nullable: true })
    video_desc: string;

    @Column()
    embed: string;

    @Column({ default: false })
    is_embed: boolean;

    @Column({ default: false })
    is_deleted: boolean;

    @CreateDateColumn()
    upload_date: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
