import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Menu } from '../../menus/entity/menu.entity';

@Entity('pages')
export class Page {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ unique: true })
    slug: string;

    @Column({ type: 'text', nullable: true })
    content: string;

    @Column({ nullable: true })
    image: string;

    @Column({ default: 'artikel' })
    layout: string;

    @Column({ type: 'int', default: 1 })
    status: number;

    @ManyToOne(() => Menu, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'menu_id' })
    menu: Menu | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
