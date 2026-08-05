import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { AddTaskDialog } from '@/components/tasks/add-task-dialog'
import { TaskCard } from '@/components/tasks/task-card'
import { TaskPriorityBadge, TaskStatusBadge } from '@/components/tasks/task-badges'
import {
  TASKS,
  formatDeadline,
  getTaskUrgency,
  updateTaskStatus,
  type TaskStatus,
} from '@/data/tasks'

export const Route = createFileRoute('/tasks')({
  loader: () => ({ tasks: TASKS }),
  component: TasksPage,
})

const COLUMNS: { key: TaskStatus; label: string }[] = [
  { key: 'Todo', label: 'Todo' },
  { key: 'In Progress', label: 'In Progress' },
  { key: 'Completed', label: 'Completed' },
]

const URGENCY_TEXT_STYLES = {
  normal: 'text-muted-foreground',
  warning: 'text-amber-600 font-medium',
  urgent: 'text-rose-600 font-medium',
} as const

function TasksPage() {
  const { tasks } = Route.useLoaderData()
  const router = useRouter()

  function toggle(id: string, checked: boolean) {
    updateTaskStatus(id, checked ? 'Completed' : 'Todo')
    router.invalidate()
  }

  const sortedTasks = [...tasks].sort((a, b) =>
    a.dueDate.localeCompare(b.dueDate),
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track and manage your daily sales activities and follow-ups.
          </p>
        </div>
        <AddTaskDialog />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.key)
          return (
            <div key={column.key} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">{column.label}</p>
                <span className="flex size-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                  {columnTasks.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.map((task) => {
              const urgency = getTaskUrgency(task)
              return (
                <TableRow key={task.id}>
                  <TableCell className="p-0">
                    <label className="flex items-center gap-3 px-2 py-2">
                      <Checkbox
                        checked={task.status === 'Completed'}
                        onCheckedChange={(checked) =>
                          toggle(task.id, checked === true)
                        }
                      />
                      <span
                        className={cn(
                          'font-medium',
                          task.status === 'Completed' &&
                            'text-muted-foreground line-through',
                        )}
                      >
                        {task.title}
                      </span>
                    </label>
                  </TableCell>
                  <TableCell
                    className={cn(URGENCY_TEXT_STYLES[urgency])}
                    title={
                      urgency === 'urgent'
                        ? 'Needs urgent follow-up'
                        : urgency === 'warning'
                          ? 'Follow-up due soon'
                          : undefined
                    }
                  >
                    {formatDeadline(task.dueDate)}
                  </TableCell>
                  <TableCell>
                    <TaskPriorityBadge priority={task.priority} />
                  </TableCell>
                  <TableCell>
                    <TaskStatusBadge status={task.status} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
