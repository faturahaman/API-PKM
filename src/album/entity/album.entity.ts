
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { Gallery } from '../../gallery/entity/gallery.entity';

@Entity('albums')
@Index('idx_album_puskesmas_created', ['puskesmas_id', 'created_at'])
export class Album {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Tenant isolation
    @Column({ nullable: true })
    puskesmas_id: string;

    @Column()
    album_title: string;

    @Column({ nullable: true, type: 'text' })
    description: string;

    @Column({ nullable: true })
    album_cover: string;

    @Column({ default: 0 })
    count: number;

    @OneToMany(() => Gallery, (gallery) => gallery.album)
    galleries: Gallery[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
