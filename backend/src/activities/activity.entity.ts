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

export const ACTIVITY_TYPES = [
  'WhatsApp',
  'Call',
  'Email',
  'Demo',
  'Follow Up',
  'Meeting',
] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: ACTIVITY_TYPES })
  type: ActivityType;

  @Column({ type: 'timestamptz' })
  occurredAt: Date;

  @Column({ default: '' })
  summary: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
