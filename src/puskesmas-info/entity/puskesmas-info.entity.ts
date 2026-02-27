import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('web_info')
export class PuskesmasInfo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    web_title: string;

    @Column({ nullable: true })
    logo: string;

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

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
