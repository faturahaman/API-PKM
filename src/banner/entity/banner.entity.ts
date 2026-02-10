
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('banners')
export class Banner {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    image_path: string;

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
