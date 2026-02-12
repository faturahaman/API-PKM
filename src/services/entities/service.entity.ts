import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
    Index,
} from 'typeorm';
import { ServiceFlow } from './service-flow.entity';

@Entity('services')
export class Service {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Index()
    @Column({ type: 'varchar', length: 150 })
    service_name: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    icon: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @OneToMany(() => ServiceFlow, (flow) => flow.service, {
        cascade: true, // Ini penting agar create/save otomatis menyimpan children
        eager: true,
    })
    flows: ServiceFlow[];
}