import type { ContactStatus } from '@/components/dashboard/status-badge'

export interface DealStage {
  title: string
  description: string
  date: string
  done: boolean
}

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
  status: ContactStatus
  notes: string
  dealStages: DealStage[]
}

export const CONTACTS: ContactDetail[] = []

export function getContactById(id: string) {
  return CONTACTS.find((contact) => contact.id === id)
}

export function slugifyContactName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export interface NewContactInput {
  name: string
  company: string
  companyId: string
  email: string
  phone: string
  position: string
  owner: string
  status: ContactStatus
  notes: string
}

export interface UpdateContactInput {
  name: string
  company: string
  companyId: string
  email: string
  phone: string
  position: string
  owner: string
  status: ContactStatus
}

export function updateContact(
  id: string,
  input: UpdateContactInput,
): ContactDetail {
  const contact = getContactById(id)
  if (!contact) {
    throw new Error(`Contact not found: ${id}`)
  }

  contact.name = input.name
  contact.title = `${input.position} at ${input.company}`
  contact.company = input.company
  contact.companyId = input.companyId
  contact.email = input.email
  contact.phone = input.phone
  contact.position = input.position
  contact.owner = input.owner
  contact.status = input.status

  return contact
}

export function addContact(input: NewContactInput): ContactDetail {
  const slug = slugifyContactName(input.name)
  const id = CONTACTS.some((contact) => contact.id === slug)
    ? `${slug}-${CONTACTS.length + 1}`
    : slug

  const contact: ContactDetail = {
    id,
    name: input.name,
    title: `${input.position} at ${input.company}`,
    company: input.company,
    companyId: input.companyId,
    email: input.email,
    phone: input.phone,
    position: input.position,
    owner: input.owner,
    status: input.status,
    notes: input.notes,
    dealStages: [],
  }

  CONTACTS.push(contact)
  return contact
}
