import type { DealStage } from '@/data/contacts'

export type DealStatus = 'Negotiation' | 'Won' | 'Lost' | 'Proposal'
export type CompanyStatus = 'Prospect' | 'Active' | 'Customer'
export type CompanySource =
  | 'Referral'
  | 'Cold Outreach'
  | 'Inbound'
  | 'Event'
  | 'Other'

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
  phone: string
  address: string
  teamLeadOwner: string
  status: CompanyStatus
  source: CompanySource
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
    phone: '0215551234',
    address: 'Graha Multi, Kuningan, Jakarta',
    teamLeadOwner: 'Andi Wijaya',
    status: 'Active',
    source: 'Referral',
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
    phone: '0225557890',
    address: 'Jl. Braga No. 12, Bandung',
    teamLeadOwner: 'Rina Kartika',
    status: 'Prospect',
    source: 'Cold Outreach',
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
    phone: '0315559012',
    address: 'Jl. Rungkut Industri, Surabaya',
    teamLeadOwner: 'Dimas Prasetyo',
    status: 'Customer',
    source: 'Event',
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

export function slugifyCompanyName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export interface NewCompanyInput {
  name: string
  industry: string
  region: string
  website: string
  phone: string
  address: string
  teamLeadOwner: string
  status: CompanyStatus
  source: CompanySource
}

export function addCompany(input: NewCompanyInput): Company {
  const slug = slugifyCompanyName(input.name)
  const id = COMPANIES.some((company) => company.id === slug)
    ? `${slug}-${COMPANIES.length + 1}`
    : slug

  const company: Company = {
    id,
    name: input.name,
    industry: input.industry,
    tagline: `${input.industry} Partner`,
    location: `${input.region}, ID`,
    website: input.website,
    phone: input.phone,
    address: input.address,
    teamLeadOwner: input.teamLeadOwner,
    status: input.status,
    source: input.source,
    dealStages: [],
    deals: [],
    contacts: [],
  }

  COMPANIES.push(company)
  return company
}
