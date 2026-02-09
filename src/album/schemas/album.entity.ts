
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Gallery } from '../../gallery/schemas/gallery.entity';

@Entity('albums')
export class Album {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    album_title: string;

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
