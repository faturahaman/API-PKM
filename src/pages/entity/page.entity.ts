import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Menu } from '../../menus/entity/menu.entity';

@Entity('pages')
@Index('idx_pages_puskesmas_created', ['puskesmas_id', 'createdAt'])
export class Page {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    user_id: string;

    // Tenant isolation - required for multi-tenancy
    @Column({ nullable: true })
    puskesmas_id: string;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    dynamic_content: string;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    file: string;

    @Column({ type: 'enum', enum: ['pdf', 'halaman', 'kartu'], default: 'halaman' })
    type: 'pdf' | 'halaman' | 'kartu';

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
