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
  companyId?: string
}

export const TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Follow Up',
    tag: 'Lead',
    status: 'Todo',
    priority: 'Medium',
    createdAt: '2026-07-29',
    dueDate: '2026-08-13',
  },
  {
    id: 'task-2',
    title: 'Call PT ABC',
    tag: 'Lead',
    status: 'Todo',
    priority: 'Medium',
    createdAt: '2026-07-29',
    dueDate: '2026-08-10',
  },
  {
    id: 'task-3',
    title: 'Send Quotation',
    tag: 'Lead',
    status: 'Todo',
    priority: 'Low',
    createdAt: '2026-07-29',
    dueDate: '2026-08-15',
  },
  {
    id: 'task-4',
    title: 'Follow Up PT ABC',
    tag: 'Lead',
    status: 'Todo',
    priority: 'High',
    createdAt: '2026-07-29',
    dueDate: '2026-08-12',
  },
  {
    id: 'task-5',
    title: 'Demo PT XYZ',
    tag: 'Prospect',
    status: 'In Progress',
    priority: 'Medium',
    createdAt: '2026-07-20',
    dueDate: '2026-08-05',
  },
  {
    id: 'task-6',
    title: 'Proposal PT ABC',
    tag: 'Closed Won',
    status: 'Completed',
    priority: 'High',
    createdAt: '2026-07-01',
    dueDate: '2026-07-20',
  },
  {
    id: 'task-7',
    title: 'Meeting PT DEF',
    tag: 'Closed Won',
    status: 'Completed',
    priority: 'Medium',
    createdAt: '2026-07-05',
    dueDate: '2026-07-25',
  },
]

export function getTaskById(id: string) {
  return TASKS.find((task) => task.id === id)
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

export function addFollowUpTask(company: {
  id: string
  name: string
  status: string
}): Task {
  const created = new Date()
  const due = new Date(created)
  due.setDate(due.getDate() + 3)

  const task: Task = {
    id: `task-${TASKS.length + 1}`,
    title: `Follow Up ${company.name}`,
    tag: company.status,
    status: 'Todo',
    priority: 'Medium',
    createdAt: created.toISOString().slice(0, 10),
    dueDate: due.toISOString().slice(0, 10),
    companyId: company.id,
  }

  TASKS.push(task)
  return task
}

const DAY_MS = 24 * 60 * 60 * 1000

export function getTaskUrgency(task: Task, today: Date = new Date()): TaskUrgency {
  if (task.status === 'Completed') return 'normal'

  const created = new Date(`${task.createdAt}T00:00:00`)
  const daysSinceCreated = Math.floor(
    (today.getTime() - created.getTime()) / DAY_MS,
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
