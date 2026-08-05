import type { DealStage } from '@/data/contacts'

export type DealStatus = 'Negotiation' | 'Won' | 'Lost' | 'Proposal'

export interface Deal {
  name: string
  amount: string
  status: DealStatus
}

export interface CompanyContact {
  contactId: string
  name: string
  position: string
  phone: string
}

export interface Company {
  id: string
  name: string
  industry: string
  tagline: string
  location: string
  website: string
  address: string
  teamLeadOwner: string
  dealStages: DealStage[]
  deals: Deal[]
  contacts: CompanyContact[]
}

export const COMPANIES: Company[] = [
  {
    id: 'pt-maju-bersama',
    name: 'PT Maju Bersama',
    industry: 'Manufacturing & Tech',
    tagline: 'Technology & Manufacturing Partner',
    location: 'Jakarta, ID',
    website: 'www.majubersama.co.id',
    address: 'Graha Multi, Kuningan, Jakarta',
    teamLeadOwner: 'Andi Wijaya',
    dealStages: [
      {
        title: 'Call Completed',
        description: 'Introductory phone call to understand server needs',
        date: 'Oct 10, 2023',
        done: true,
      },
      {
        title: 'Product Demo Scheduled',
        description: 'Walkthrough of Holtrack feature set',
        date: 'Oct 14, 2023',
        done: true,
      },
      {
        title: 'Proposal Sent',
        description: 'Custom Rp500 million solution draft',
        date: 'Oct 18, 2023',
        done: true,
      },
      {
        title: 'Negotiation',
        description: 'Discussions on annual licensing terms',
        date: 'Pending',
        done: false,
      },
    ],
    deals: [
      { name: 'ERP Implementation', amount: 'Rp500.000.000', status: 'Negotiation' },
      { name: 'CRM Integration Service', amount: 'Rp150.000.000', status: 'Won' },
    ],
    contacts: [
      {
        contactId: 'budi-santoso',
        name: 'Budi Santoso',
        position: 'Head of Procurement',
        phone: '08123456789',
      },
      {
        contactId: 'andi-wijaya',
        name: 'Andi Wijaya',
        position: 'Chief Technical Officer',
        phone: '08112233445',
      },
    ],
  },
  {
    id: 'pt-sejahtera',
    name: 'PT Sejahtera',
    industry: 'Retail & Distribution',
    tagline: 'Retail & Distribution Partner',
    location: 'Bandung, ID',
    website: 'www.sejahtera.co.id',
    address: 'Jl. Braga No. 12, Bandung',
    teamLeadOwner: 'Rina Kartika',
    dealStages: [
      {
        title: 'Call Completed',
        description: 'Discovery call on current pain points',
        date: 'Nov 2, 2023',
        done: true,
      },
      {
        title: 'Product Demo Scheduled',
        description: 'Demo focused on reporting features',
        date: 'Pending',
        done: false,
      },
      {
        title: 'Proposal Sent',
        description: 'Awaiting requirements confirmation',
        date: 'Pending',
        done: false,
      },
      {
        title: 'Negotiation',
        description: 'Not started',
        date: 'Pending',
        done: false,
      },
    ],
    deals: [
      { name: 'Inventory Management Suite', amount: 'Rp220.000.000', status: 'Proposal' },
    ],
    contacts: [
      {
        contactId: 'sarah-wijaya',
        name: 'Sarah Wijaya',
        position: 'Procurement Lead',
        phone: '08111111111',
      },
    ],
  },
  {
    id: 'pt-nusantara',
    name: 'PT Nusantara',
    industry: 'Logistics',
    tagline: 'Logistics & Fulfillment Partner',
    location: 'Surabaya, ID',
    website: 'www.nusantara.co.id',
    address: 'Jl. Rungkut Industri, Surabaya',
    teamLeadOwner: 'Dimas Prasetyo',
    dealStages: [
      {
        title: 'Call Completed',
        description: 'Renewal discussion',
        date: 'Sep 20, 2023',
        done: true,
      },
      {
        title: 'Product Demo Scheduled',
        description: 'New feature walkthrough',
        date: 'Sep 25, 2023',
        done: true,
      },
      {
        title: 'Proposal Sent',
        description: 'Renewal contract sent',
        date: 'Sep 28, 2023',
        done: true,
      },
      {
        title: 'Negotiation',
        description: 'Signed renewal terms',
        date: 'Oct 2, 2023',
        done: true,
      },
    ],
    deals: [
      { name: 'Annual License Renewal', amount: 'Rp180.000.000', status: 'Won' },
    ],
    contacts: [
      {
        contactId: 'ahmad-fauzi',
        name: 'Ahmad Fauzi',
        position: 'Operations Manager',
        phone: '08222222222',
      },
    ],
  },
]

export function getCompanyById(id: string) {
  return COMPANIES.find((company) => company.id === id)
}
