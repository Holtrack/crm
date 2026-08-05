import type { DealStage } from '@/data/contacts'

export type DealStatus = 'Negotiation' | 'Won' | 'Lost' | 'Proposal'
export type CompanyStatus = 'Prospect' | 'Active' | 'Customer'
export type CompanySource =
  | 'Referral'
  | 'Cold Outreach'
  | 'Inbound'
  | 'Event'
  | 'Other'

export interface DealActivityLogEntry {
  label: string
  date: string
  done: boolean
}

export interface Deal {
  id: string
  companyId: string
  name: string
  amount: string
  status: DealStatus
  probability: number
  contactId?: string
  activityLog: DealActivityLogEntry[]
  information: string
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
      {
        id: 'erp-implementation',
        companyId: 'pt-maju-bersama',
        name: 'ERP Implementation',
        amount: 'Rp500.000.000',
        status: 'Negotiation',
        probability: 75,
        contactId: 'budi-santoso',
        activityLog: [
          { label: 'Lead Created', date: 'Sep 24, 2023', done: true },
          { label: 'Introductory Call Completed', date: 'Oct 02, 2023', done: true },
          { label: 'Custom Technical Demo Done', date: 'Oct 08, 2023', done: true },
          { label: 'Proposal Submitted & Received', date: 'Oct 15, 2023', done: true },
        ],
        information:
          'Kita sempet kasih pricing Rp600jt tapi mereka ga setuju.',
      },
      {
        id: 'crm-integration-service',
        companyId: 'pt-maju-bersama',
        name: 'CRM Integration Service',
        amount: 'Rp150.000.000',
        status: 'Won',
        probability: 100,
        contactId: 'andi-wijaya',
        activityLog: [
          { label: 'Lead Created', date: 'Aug 12, 2023', done: true },
          { label: 'Contract Signed', date: 'Sep 05, 2023', done: true },
        ],
        information: 'Closed as part of the ERP bundle renewal.',
      },
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
      {
        id: 'inventory-management-suite',
        companyId: 'pt-sejahtera',
        name: 'Inventory Management Suite',
        amount: 'Rp220.000.000',
        status: 'Proposal',
        probability: 40,
        contactId: 'sarah-wijaya',
        activityLog: [
          { label: 'Lead Created', date: 'Oct 28, 2023', done: true },
          { label: 'Discovery Call Completed', date: 'Nov 02, 2023', done: true },
          { label: 'Proposal Sent', date: 'Nov 09, 2023', done: false },
        ],
        information: 'Waiting on requirements sign-off before pricing talks.',
      },
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
      {
        id: 'annual-license-renewal',
        companyId: 'pt-nusantara',
        name: 'Annual License Renewal',
        amount: 'Rp180.000.000',
        status: 'Won',
        probability: 100,
        contactId: 'ahmad-fauzi',
        activityLog: [
          { label: 'Renewal Discussion', date: 'Sep 20, 2023', done: true },
          { label: 'Renewal Contract Sent', date: 'Sep 28, 2023', done: true },
          { label: 'Renewal Terms Signed', date: 'Oct 02, 2023', done: true },
        ],
        information: 'Renewed at the same rate with a 12-month term.',
      },
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

export function getDealById(dealId: string) {
  for (const company of COMPANIES) {
    const deal = company.deals.find((deal) => deal.id === dealId)
    if (deal) return deal
  }
  return undefined
}

export function updateDealInformation(dealId: string, information: string): Deal {
  const deal = getDealById(dealId)
  if (!deal) {
    throw new Error(`Deal not found: ${dealId}`)
  }

  deal.information = information
  return deal
}

export interface EditDealInput {
  name: string
  amount: string
  status: DealStatus
  probability: number
  contactId?: string
}

export function updateDeal(dealId: string, input: EditDealInput): Deal {
  const deal = getDealById(dealId)
  if (!deal) {
    throw new Error(`Deal not found: ${dealId}`)
  }

  deal.name = input.name
  deal.amount = input.amount
  deal.status = input.status
  deal.probability = input.probability
  deal.contactId = input.contactId

  return deal
}

export interface EditCompanyCredentialsInput {
  industry: string
  website: string
  phone: string
  address: string
  teamLeadOwner: string
  source: CompanySource
}

export function updateCompanyCredentials(
  id: string,
  input: EditCompanyCredentialsInput,
): Company {
  const company = getCompanyById(id)
  if (!company) {
    throw new Error(`Company not found: ${id}`)
  }

  company.industry = input.industry
  company.website = input.website
  company.phone = input.phone
  company.address = input.address
  company.teamLeadOwner = input.teamLeadOwner
  company.source = input.source

  return company
}

export function updateDealStages(id: string, stages: DealStage[]): Company {
  const company = getCompanyById(id)
  if (!company) {
    throw new Error(`Company not found: ${id}`)
  }

  company.dealStages = stages
  return company
}

export interface EditCompanyInput {
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

export function updateCompany(id: string, input: EditCompanyInput): Company {
  const company = getCompanyById(id)
  if (!company) {
    throw new Error(`Company not found: ${id}`)
  }

  company.name = input.name
  company.industry = input.industry
  company.tagline = `${input.industry} Partner`
  company.location = `${input.region}, ID`
  company.website = input.website
  company.phone = input.phone
  company.address = input.address
  company.teamLeadOwner = input.teamLeadOwner
  company.status = input.status
  company.source = input.source

  return company
}
