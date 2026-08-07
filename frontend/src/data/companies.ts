import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'

export type CompanyStatus = 'Prospect' | 'Active' | 'Customer'
export type CompanySource =
  | 'Website Contact Form'
  | 'Cold Outreach'
  | 'Existing Client Referral'
  | 'Charissa'
  | 'Brantley'
  | 'Delvin'
  | 'Other'

export interface Company {
  id: string
  slug: string
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
  createdAt: string
  updatedAt: string
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

export interface EditCompanyCredentialsInput {
  industry: string
  website: string
  phone: string
  address: string
  teamLeadOwner: string
  source: CompanySource
}

export interface CompanyFilters {
  search?: string
  status?: string
  owner?: string
  [key: string]: string | undefined
}

// Simple in-memory cache of the unfiltered company list, kept fresh by
// listCompanies() and used by components that just need a synchronous
// picker (company selects, global search) via useCompanies().
let companiesCache: Company[] = []

export function listCompanies(filters: CompanyFilters = {}): Promise<Company[]> {
  return apiFetch<Company[]>('/companies', { query: filters }).then((companies) => {
    if (!filters.search && !filters.status && !filters.owner) {
      companiesCache = companies
    }
    return companies
  })
}

export function getCachedCompanies(): Company[] {
  return companiesCache
}

export function useCompanies(): Company[] {
  const [companies, setCompanies] = useState<Company[]>(() => companiesCache)

  useEffect(() => {
    let cancelled = false
    listCompanies()
      .then((result) => {
        if (!cancelled) setCompanies(result)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return companies
}

export function getCompany(id: string): Promise<Company> {
  return apiFetch<Company>(`/companies/${id}`)
}

export function addCompany(input: NewCompanyInput): Promise<Company> {
  return apiFetch<Company>('/companies', { method: 'POST', body: input })
}

export function updateCompany(id: string, input: EditCompanyInput): Promise<Company> {
  return apiFetch<Company>(`/companies/${id}`, { method: 'PATCH', body: input })
}

export function updateCompanyStatus(
  id: string,
  status: CompanyStatus,
): Promise<Company> {
  return apiFetch<Company>(`/companies/${id}/status`, {
    method: 'PATCH',
    body: { status },
  })
}

export function updateCompanyCredentials(
  id: string,
  input: EditCompanyCredentialsInput,
): Promise<Company> {
  return apiFetch<Company>(`/companies/${id}/credentials`, {
    method: 'PATCH',
    body: input,
  })
}

export function deleteCompany(id: string): Promise<void> {
  return apiFetch<void>(`/companies/${id}`, { method: 'DELETE' })
}
