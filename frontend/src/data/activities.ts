import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'

export type ActivityType =
  | 'WhatsApp'
  | 'Call'
  | 'Email'
  | 'Demo'
  | 'Follow Up'
  | 'Meeting'

export interface Activity {
  id: string
  companyId: string
  title: string
  type: ActivityType
  occurredAt: string
  datetime: string
  summary: string
  createdAt: string
  updatedAt: string
}

export interface ActivityFilters {
  companyId?: string
  [key: string]: string | undefined
}

export async function listActivities(
  filters: ActivityFilters = {},
): Promise<Activity[]> {
  return apiFetch<Activity[]>('/activities', { query: filters })
}

export function useActivities(filters: ActivityFilters = {}): Activity[] {
  const [activities, setActivities] = useState<Activity[]>([])
  const filterKey = JSON.stringify(filters)

  useEffect(() => {
    let cancelled = false
    listActivities(JSON.parse(filterKey)).then((data) => {
      if (!cancelled) setActivities(data)
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey])

  return activities
}

export async function getActivity(id: string): Promise<Activity> {
  return apiFetch<Activity>(`/activities/${id}`)
}

export async function getActivitiesByCompanyId(
  companyId: string,
): Promise<Activity[]> {
  return listActivities({ companyId })
}

export interface NewActivityInput {
  companyId: string
  title: string
  type: ActivityType
  date: string
  time: string
  summary: string
}

export async function addActivity(input: NewActivityInput): Promise<Activity> {
  return apiFetch<Activity>('/activities', { method: 'POST', body: input })
}

export interface EditActivityInput {
  title: string
  type: ActivityType
  occurredAt: string
  summary: string
}

export async function updateActivity(
  id: string,
  input: EditActivityInput,
): Promise<Activity> {
  return apiFetch<Activity>(`/activities/${id}`, {
    method: 'PATCH',
    body: input,
  })
}

export async function deleteActivity(id: string): Promise<void> {
  await apiFetch(`/activities/${id}`, { method: 'DELETE' })
}

export function splitOccurredAt(occurredAt: string) {
  const parsed = new Date(occurredAt)
  return {
    date: parsed.toISOString().slice(0, 10),
    time: parsed.toISOString().slice(11, 16),
  }
}
