import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from "typeorm";

@Entity('visitors')
@Unique(['ip_address', 'visit_date'])
export class Visitor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ip_address: string;

    @Column({ type: 'text' })
    user_agent: string;

    @Column({ type: 'date' })
    visit_date: string;

    @Column({ nullable: true })
    path: string;

    @CreateDateColumn()
    created_at: Date;
}