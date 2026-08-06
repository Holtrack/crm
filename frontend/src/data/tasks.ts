export type TaskStatus = 'Todo' | 'In Progress' | 'Completed'
export type TaskPriority = 'Low' | 'Medium' | 'High'
export type TaskUrgency = 'normal' | 'warning' | 'urgent'

export interface Task {
  id: string
  title: string
  tag: string
  status: TaskStatus
  priority: TaskPriority
  createdAt: string
  dueDate: string
  notes?: string
  companyId?: string
  isFollowUp?: boolean
}

export const TASKS: Task[] = []

export function getTaskById(id: string) {
  return TASKS.find((task) => task.id === id)
}

export function deleteTask(id: string) {
  const index = TASKS.findIndex((task) => task.id === id)
  if (index === -1) return
  TASKS.splice(index, 1)
}

export interface NewTaskInput {
  title: string
  tag: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  companyId?: string
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export function addTask(input: NewTaskInput): Task {
  const task: Task = {
    id: `task-${TASKS.length + 1}`,
    title: input.title,
    tag: input.tag,
    status: input.status,
    priority: input.priority,
    createdAt: todayIso(),
    dueDate: input.dueDate,
    companyId: input.companyId,
  }

  TASKS.push(task)
  return task
}

export function updateTaskStatus(id: string, status: TaskStatus): Task {
  const task = getTaskById(id)
  if (!task) {
    throw new Error(`Task not found: ${id}`)
  }

  task.status = status
  return task
}

export interface EditTaskInput {
  dueDate: string
  priority: TaskPriority
  notes: string
}

export function updateTask(id: string, input: EditTaskInput): Task {
  const task = getTaskById(id)
  if (!task) {
    throw new Error(`Task not found: ${id}`)
  }

  task.dueDate = input.dueDate
  task.priority = input.priority
  task.notes = input.notes
  return task
}

export function addFollowUpTask(company: {
  id: string
  name: string
  status: string
}): Task {
  const created = new Date()
  const due = new Date(created)
  due.setDate(due.getDate() + 14)

  const task: Task = {
    id: `task-${TASKS.length + 1}`,
    title: `Follow Up ${company.name}`,
    tag: company.status,
    status: 'Todo',
    priority: 'Low',
    createdAt: created.toISOString().slice(0, 10),
    dueDate: due.toISOString().slice(0, 10),
    companyId: company.id,
    isFollowUp: true,
  }

  TASKS.push(task)
  return task
}

const DAY_MS = 24 * 60 * 60 * 1000

function daysSince(dateIso: string, today: Date) {
  const start = new Date(`${dateIso}T00:00:00`)
  return Math.floor((today.getTime() - start.getTime()) / DAY_MS)
}

export function getTaskUrgency(task: Task, today: Date = new Date()): TaskUrgency {
  if (task.status === 'Completed') return 'normal'

  const daysSinceCreated = daysSince(task.createdAt, today)

  if (daysSinceCreated >= 14) return 'urgent'
  if (daysSinceCreated >= 7) return 'warning'
  return 'normal'
}

/**
 * Automated follow-up tasks escalate priority the longer they sit open:
 * Medium after 7 days, High after 14 days.
 */
export function getEffectivePriority(
  task: Task,
  today: Date = new Date(),
): TaskPriority {
  if (!task.isFollowUp) return task.priority

  const daysSinceCreated = daysSince(task.createdAt, today)

  if (daysSinceCreated >= 14) return 'High'
  if (daysSinceCreated >= 7) return 'Medium'
  return task.priority
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
