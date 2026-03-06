import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn } from 'typeorm';

@Entity('visitors')
@Index('IDX_UNIQUE_VISITOR', ['ip_address', 'visit_date', 'puskesmas_id'], { unique: true })
export class Visitor {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Index('IDX_VISITOR_PUSKESMAS') 
    @Column({ nullable: true })
    puskesmas_id: string;  
    
    @Column()
    ip_address: string;

    @Column({ type: 'text', nullable: true })
    user_agent: string; 

    @Column({ nullable: true })
    path: string; 
    
    @Index('IDX_VISITOR_DATE')
    @Column({ type: 'date' })
    visit_date: string;

    @CreateDateColumn()
    created_at: Date; 
}