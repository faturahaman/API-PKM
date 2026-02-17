import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { Service } from './service.entity';
@Entity('service_flows')
export class ServiceFlow {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @ManyToOne(() => Service, (service) => service.flows, {
        onDelete: 'CASCADE', 
        orphanedRowAction: 'delete',
    })
    @JoinColumn({ name: 'service_id' })
    service: Service;

    @Column({ type: 'varchar', length: 150 })
    title_flow: string;

    @Column({ type: 'text', nullable: true })
    description_flow: string;

    @Index()
    @Column({ type: 'int', default: 1 })
    step_order: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}