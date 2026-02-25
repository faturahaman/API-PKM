import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Menu } from '../../menus/entity/menu.entity';

@Entity('static_pages')
export class StaticPage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    static_content: string;

    @ManyToOne(() => Menu, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'menu_id' })
    menu: Menu | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
