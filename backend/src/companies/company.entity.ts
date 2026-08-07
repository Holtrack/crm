import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export const COMPANY_STATUSES = ['Prospect', 'Active', 'Customer'] as const;
export type CompanyStatus = (typeof COMPANY_STATUSES)[number];

export const COMPANY_SOURCES = [
  'Website Contact Form',
  'Cold Outreach',
  'Existing Client Referral',
  'Charissa',
  'Brantley',
  'Delvin',
  'Other',
] as const;
export type CompanySource = (typeof COMPANY_SOURCES)[number];

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column()
  industry: string;

  @Column()
  region: string;

  @Column({ default: '' })
  website: string;

  @Column({ default: '' })
  phone: string;

  @Column({ default: '' })
  address: string;

  @Column()
  teamLeadOwner: string;

  @Column({ type: 'enum', enum: COMPANY_STATUSES, default: 'Prospect' })
  status: CompanyStatus;

  @Column({ type: 'enum', enum: COMPANY_SOURCES })
  source: CompanySource;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
