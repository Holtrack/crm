import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'

export type TaskStatus = 'Todo' | 'In Progress' | 'Completed'
export type TaskPriority = 'Low' | 'Medium' | 'High'
export type TaskUrgency = 'normal' | 'warning' | 'urgent'

export const TASK_STATUS_STYLES: Record<
  TaskStatus,
  { dot: string; tint: string }
> = {
  Todo: { dot: 'bg-slate-500', tint: 'bg-slate-50/60' },
  'In Progress': { dot: 'bg-blue-500', tint: 'bg-blue-50/60' },
  Completed: { dot: 'bg-emerald-500', tint: 'bg-emerald-50/60' },
}

export interface Task {
  id: string
  title: string
  tag: string
  status: TaskStatus
  priority: TaskPriority
  effectivePriority: TaskPriority
  createdAt: string
  updatedAt: string
  dueDate: string
  notes: string
  companyId?: string
  isFollowUp: boolean
}

export interface TaskFilters {
  companyId?: string
  status?: TaskStatus
  [key: string]: string | undefined
}

export async function listTasks(filters: TaskFilters = {}): Promise<Task[]> {
  return apiFetch<Task[]>('/tasks', { query: filters })
}

export function useTasks(filters: TaskFilters = {}): Task[] {
  const [tasks, setTasks] = useState<Task[]>([])
  const filterKey = JSON.stringify(filters)

  useEffect(() => {
    let cancelled = false
    listTasks(JSON.parse(filterKey)).then((data) => {
      if (!cancelled) setTasks(data)
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey])

  return tasks
}

export async function getTask(id: string): Promise<Task> {
  return apiFetch<Task>(`/tasks/${id}`)
}

export interface NewTaskInput {
  title: string
  tag: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  companyId?: string
}

export async function addTask(input: NewTaskInput): Promise<Task> {
  return apiFetch<Task>('/tasks', { method: 'POST', body: input })
}

export interface EditTaskInput {
  dueDate: string
  priority: TaskPriority
  notes: string
}

export async function updateTask(
  id: string,
  input: EditTaskInput,
): Promise<Task> {
  return apiFetch<Task>(`/tasks/${id}`, { method: 'PATCH', body: input })
}

export async function updateTaskStatus(
  id: string,
  status: TaskStatus,
): Promise<Task> {
  return apiFetch<Task>(`/tasks/${id}/status`, {
    method: 'PATCH',
    body: { status },
  })
}

export async function deleteTask(id: string): Promise<void> {
  await apiFetch(`/tasks/${id}`, { method: 'DELETE' })
}

export async function createFollowUpTask(company: {
  id: string
  name: string
  status: string
}): Promise<Task> {
  return apiFetch<Task>('/tasks/follow-up', {
    method: 'POST',
    body: {
      companyId: company.id,
      companyName: company.name,
      companyStatus: company.status,
    },
  })
}

const DAY_MS = 24 * 60 * 60 * 1000

export function getTaskUrgency(
  task: Task,
  today: Date = new Date(),
): TaskUrgency {
  if (task.status === 'Completed') return 'normal'

  const daysSinceCreated = Math.floor(
    (today.getTime() - new Date(task.createdAt).getTime()) / DAY_MS,
  )

  if (daysSinceCreated >= 14) return 'urgent'
  if (daysSinceCreated >= 7) return 'warning'
  return 'normal'
}

export function formatDeadline(dueDate: string, today: Date = new Date()) {
  const due = new Date(`${dueDate}T00:00:00`)
  const todayStart = new Date(
    `${today.toISOString().slice(0, 10)}T00:00:00`,
  )
  const diffDays = Math.round(
    (due.getTime() - todayStart.getTime()) / DAY_MS,
  )

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'

  return due.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}
