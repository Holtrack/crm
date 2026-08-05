import { COMPANIES, type Deal, type DealStatus } from '@/data/companies'

export const STAGES = [
  { key: 'Proposal', label: 'Proposal' },
  { key: 'Negotiation', label: 'Negotiation' },
  { key: 'Won', label: 'Won' },
  { key: 'Lost', label: 'Lost' },
] as const

export type StageKey = DealStatus

export interface PipelineDeal extends Deal {
  companyName: string
}

export function getPipelineDeals(): PipelineDeal[] {
  return COMPANIES.flatMap((company) =>
    company.deals.map((deal) => ({ ...deal, companyName: company.name })),
  )
}
