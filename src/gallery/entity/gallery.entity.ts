
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Album } from '../../album/entity/album.entity';

@Entity('gallery')
@Index('idx_gallery_puskesmas_created', ['puskesmas_id', 'upload_date'])
export class Gallery {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Tenant isolation
    @Column({ nullable: true })
    puskesmas_id: string;

    @Column()
    image_title: string;

    @Column()
    image: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    album_id: string;

    @ManyToOne(() => Album, (album) => album.galleries, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'album_id' })
    album: Album;

    @Column({ default: false })
    is_deleted: boolean;

    @CreateDateColumn()
    upload_date: Date;
}
