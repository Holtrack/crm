import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'

export interface ContactDetail {
  id: string
  name: string
  title: string
  company: string
  companyId: string
  email: string
  phone: string
  position: string
  owner: string
  notes: string
}

interface ContactApiResponse {
  id: string
  name: string
  companyId: string
  companyName: string
  title: string
  email: string
  phone: string
  position: string
  owner: string
  notes: string
}

function toContactDetail(raw: ContactApiResponse): ContactDetail {
  return {
    id: raw.id,
    name: raw.name,
    title: raw.title,
    company: raw.companyName,
    companyId: raw.companyId,
    email: raw.email,
    phone: raw.phone,
    position: raw.position,
    owner: raw.owner,
    notes: raw.notes,
  }
}

export interface ContactFilters {
  search?: string
  companyId?: string
  [key: string]: string | undefined
}

export async function listContacts(
  filters: ContactFilters = {},
): Promise<ContactDetail[]> {
  const raw = await apiFetch<ContactApiResponse[]>('/contacts', { query: filters })
  return raw.map(toContactDetail)
}

export function useContacts(): ContactDetail[] {
  const [contacts, setContacts] = useState<ContactDetail[]>([])

  useEffect(() => {
    let cancelled = false
    listContacts()
      .then((result) => {
        if (!cancelled) setContacts(result)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return contacts
}

export async function getContact(id: string): Promise<ContactDetail> {
  const raw = await apiFetch<ContactApiResponse>(`/contacts/${id}`)
  return toContactDetail(raw)
}

export function getContactsByCompanyId(companyId: string): Promise<ContactDetail[]> {
  return listContacts({ companyId })
}

export interface NewContactInput {
  name: string
  companyId: string
  email: string
  phone: string
  position: string
  owner: string
  notes: string
}

export async function addContact(input: NewContactInput): Promise<ContactDetail> {
  const raw = await apiFetch<ContactApiResponse>('/contacts', {
    method: 'POST',
    body: input,
  })
  return toContactDetail(raw)
}

export interface UpdateContactInput {
  name: string
  companyId: string
  email: string
  phone: string
  position: string
  owner: string
}

export async function updateContact(
  id: string,
  input: UpdateContactInput,
): Promise<ContactDetail> {
  const raw = await apiFetch<ContactApiResponse>(`/contacts/${id}`, {
    method: 'PATCH',
    body: input,
  })
  return toContactDetail(raw)
}

export function deleteContact(id: string): Promise<void> {
  return apiFetch<void>(`/contacts/${id}`, { method: 'DELETE' })
}
