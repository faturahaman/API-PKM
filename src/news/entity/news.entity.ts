import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('news')
export class News {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column()
    title: string;

    @Column({ type: 'text' })
    content: string;

    @Column()
    day: string;

    @Column()
    date: Date;

    @Column()
    clock: string;

    @Column()
    image: string;

    @Column({ default: false })
    is_deleted: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
