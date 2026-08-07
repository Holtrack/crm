import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'

export type DealStatus = 'Negotiation' | 'Won' | 'Lost' | 'Proposal'

export interface Deal {
  id: string
  companyId: string
  name: string
  amount: string
  status: DealStatus
  probability: number
  contactId?: string
}

export interface DealFilters {
  companyId?: string
  [key: string]: string | undefined
}

export function listDeals(filters: DealFilters = {}): Promise<Deal[]> {
  return apiFetch<Deal[]>('/deals', { query: filters })
}

export function useDeals(): Deal[] {
  const [deals, setDeals] = useState<Deal[]>([])

  useEffect(() => {
    let cancelled = false
    listDeals()
      .then((result) => {
        if (!cancelled) setDeals(result)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return deals
}

export function getDeal(id: string): Promise<Deal> {
  return apiFetch<Deal>(`/deals/${id}`)
}

export function getDealsByCompanyId(companyId: string): Promise<Deal[]> {
  return listDeals({ companyId })
}

export interface NewDealInput {
  name: string
  amount: string
  status: DealStatus
  probability: number
  contactId?: string
}

export function addDeal(companyId: string, input: NewDealInput): Promise<Deal> {
  return apiFetch<Deal>('/deals', {
    method: 'POST',
    body: { ...input, companyId },
  })
}

export interface EditDealInput {
  name: string
  amount: string
  status: DealStatus
  probability: number
  contactId?: string
}

export function updateDeal(dealId: string, input: EditDealInput): Promise<Deal> {
  return apiFetch<Deal>(`/deals/${dealId}`, { method: 'PATCH', body: input })
}

export function updateDealStatus(
  dealId: string,
  status: DealStatus,
): Promise<Deal> {
  return apiFetch<Deal>(`/deals/${dealId}/status`, {
    method: 'PATCH',
    body: { status },
  })
}
