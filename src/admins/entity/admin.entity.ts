
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AdminRole {
    OPERATOR = 'operator',
    SUPER_ADMIN = 'super_admin',
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
    level: string;

    @Column()
    password: string;

    @Column({ nullable: true, type: 'text' })
    current_token: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
