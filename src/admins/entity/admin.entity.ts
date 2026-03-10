
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Puskesmas } from '../../puskesmas/entity/puskesmas.entity';

export enum AdminRole {
    OPERATOR = 'OPERATOR',
    SUPER_ADMIN = 'SUPER_ADMIN',
}

@Entity('admins')
export class Admin {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    photo: string;

    @Column({
        type: 'enum',
        enum: AdminRole,
        default: AdminRole.OPERATOR,
    })
    role: string;

    @Column()
    password: string;

    @Column({ nullable: true, type: 'text' })
    current_token: string;

    // For OPERATOR role - the puskesmas they manage
    @Column({ nullable: true })
    puskesmas_id: string;

    // Relation to puskesmas
    @ManyToOne(() => Puskesmas, { nullable: true, eager: true })
    @JoinColumn({ name: 'puskesmas_id' })
    puskesmas: Puskesmas;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
