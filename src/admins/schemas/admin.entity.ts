
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AdminRole {
    STAFF = '0',
    ADMIN = '1',
    SUPER_ADMIN = '2',
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
        default: AdminRole.STAFF,
    })
    level: string;

    @Column()
    password: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
