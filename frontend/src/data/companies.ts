import type { DealStage } from '@/data/contacts'

export type DealStatus = 'Negotiation' | 'Won' | 'Lost' | 'Proposal'
export type CompanyStatus = 'Prospect' | 'Active' | 'Customer'
export type CompanySource =
  | 'Website Contact Form'
  | 'Cold Outreach'
  | 'Existing Client Referral'
  | 'Charissa'
  | 'Brantley'
  | 'Delvin'
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

export const COMPANIES: Company[] = []

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

export function addCompanyContact(
  companyId: string,
  contact: CompanyContact,
): Company {
  const company = getCompanyById(companyId)
  if (!company) {
    throw new Error(`Company not found: ${companyId}`)
  }

  company.contacts.push(contact)
  return company
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
