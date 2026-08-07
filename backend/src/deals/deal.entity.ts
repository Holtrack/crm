import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../companies/company.entity';

export const DEAL_STATUSES = [
  'Proposal',
  'Negotiation',
  'Won',
  'Lost',
] as const;
export type DealStatus = (typeof DEAL_STATUSES)[number];

@Entity('deals')
export class Deal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column()
  name: string;

  @Column()
  amount: string;

  @Column({ type: 'enum', enum: DEAL_STATUSES, default: 'Proposal' })
  status: DealStatus;

  @Column({ type: 'int', default: 50 })
  probability: number;

  @Column({ nullable: true })
  contactId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
