import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('kritik_saran')
@Index('idx_kritik_saran_puskesmas_created', ['puskesmas_id', 'created_at'])
export class KritikSaran {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nama: string;

    @Column({ nullable: true })
    email: string;

    @Column()
    no_hp: string;

    @Column({ type: 'text' })
    pesan: string;

    @Column({ type: 'enum', enum: ['kritik', 'saran'], default: 'saran' })
    kategori: string;

    @Column({ type: 'int', default: 0 })
    status: number; // 0 = baru, 1 = dibaca/diproses, 2 = ditindaklanjuti

    @Column({ nullable: true })
    puskesmas_id: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
