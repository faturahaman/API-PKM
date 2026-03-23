import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('web_info')
@Index('idx_puskesmas_info_puskesmas', ['puskesmas_id'])
export class PuskesmasInfo {
    @PrimaryGeneratedColumn()
    id: number;

    // Tenant isolation - this is the primary way to link info to tenant
    @Column({ nullable: true })
    puskesmas_id: string;

    @Column()
    web_title: string;

    @Column({ nullable: true })
    logo: string;

    @Column({ nullable: true, default: '#3b82f6' })
    theme_color: string;

    @Column({ type: 'text', nullable: true })
    location: string;

    @Column({ type: 'json', nullable: true })
    social_links: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        youtube?: string;
        [key: string]: any;
    };

    @Column({ type: 'double', nullable: true })
    lantitude: number;

    @Column({ type: 'double', nullable: true })
    longtitude: number;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    contact: string;

    @Column({ nullable: true })
    kepala_puskesmas: string;

    @Column({ nullable: true })
    kepala_foto: string;

    @Column({ type: 'text', nullable: true })
    Sambutan_konten: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
