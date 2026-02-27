
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('videos')
export class Video {
    @PrimaryGeneratedColumn('uuid')
    id: string;

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
