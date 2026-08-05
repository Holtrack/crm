export const STAGES = [
  { key: 'prospecting', label: 'Prospecting' },
  { key: 'qualified', label: 'Qualified' },
  { key: 'demo', label: 'Demo' },
  { key: 'proposal', label: 'Proposal' },
  { key: 'negotiation', label: 'Negotiation' },
  { key: 'won', label: 'Won' },
  { key: 'lost', label: 'Lost' },
] as const

export type StageKey = (typeof STAGES)[number]['key']

export interface Deal {
  id: string
  company: string
  value: string
  tag: string
  stage: StageKey
}

export const INITIAL_DEALS: Deal[] = [
  { id: 'pt-abc', company: 'PT ABC', value: 'Rp50 jt', tag: 'Lead', stage: 'prospecting' },
  { id: 'pt-def', company: 'PT DEF', value: 'Undetermined', tag: 'Cold', stage: 'prospecting' },
  { id: 'pt-xyz', company: 'PT XYZ', value: 'Rp80 jt', tag: 'Enterprise', stage: 'qualified' },
]
