import type { Deal, DealStatus } from '@/data/deals'
import type { Company } from '@/data/companies'

export const STAGES = [
  { key: 'Proposal', label: 'Proposal' },
  { key: 'Negotiation', label: 'Negotiation' },
  { key: 'Won', label: 'Won' },
  { key: 'Lost', label: 'Lost' },
] as const

export type StageKey = DealStatus

export const STAGE_STYLES: Record<
  StageKey,
  { dot: string; accent: string; tint: string; text: string }
> = {
  Proposal: {
    dot: 'bg-blue-500',
    accent: 'border-l-blue-500',
    tint: 'bg-blue-50/60',
    text: 'text-blue-600',
  },
  Negotiation: {
    dot: 'bg-amber-500',
    accent: 'border-l-amber-500',
    tint: 'bg-amber-50/60',
    text: 'text-amber-600',
  },
  Won: {
    dot: 'bg-emerald-500',
    accent: 'border-l-emerald-500',
    tint: 'bg-emerald-50/60',
    text: 'text-emerald-600',
  },
  Lost: {
    dot: 'bg-rose-500',
    accent: 'border-l-rose-500',
    tint: 'bg-rose-50/60',
    text: 'text-rose-600',
  },
}

export interface PipelineDeal extends Deal {
  companyName: string
}

export function getPipelineDeals(
  deals: Deal[],
  companies: Company[],
): PipelineDeal[] {
  const nameById = new Map(companies.map((company) => [company.id, company.name]))
  return deals.map((deal) => ({
    ...deal,
    companyName: nameById.get(deal.companyId) ?? 'Unknown Company',
  }))
}
