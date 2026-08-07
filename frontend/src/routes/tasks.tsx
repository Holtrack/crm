import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CheckSquare2, ListTodo, Sparkles, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AddTaskDialog } from '@/components/tasks/add-task-dialog'
import { TaskCard } from '@/components/tasks/task-card'
import { TaskColumn } from '@/components/tasks/task-column'
import { EditTaskDialog } from '@/components/tasks/edit-task-dialog'
import { TaskPriorityBadge, TaskStatusBadge } from '@/components/tasks/task-badges'
import {
  deleteTask,
  formatDeadline,
  getTaskUrgency,
  listTasks,
  updateTaskStatus,
  type Task,
  type TaskStatus,
} from '@/data/tasks'

export const Route = createFileRoute('/tasks')({
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
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
  )

  function refresh() {
    listTasks().then(setTasks)
  }

  useEffect(() => {
    refresh()
  }, [])

  async function toggle(id: string, checked: boolean) {
    await updateTaskStatus(id, checked ? 'Completed' : 'Todo')
    refresh()
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    await updateTaskStatus(String(active.id), over.id as TaskStatus)
    refresh()
  }

  async function confirmDelete() {
    if (!deletingTask) return
    await deleteTask(deletingTask.id)
    setDeletingTask(null)
    refresh()
  }

  const activeTask = tasks.find((task) => task.id === activeId)
  const sortedTasks = [...tasks].sort((a, b) =>
    a.dueDate.localeCompare(b.dueDate),
  )
  const urgentCount = tasks.filter(
    (task) => getTaskUrgency(task) === 'urgent',
  ).length
  const completedCount = tasks.filter(
    (task) => task.status === 'Completed',
  ).length

  return (
    <div className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-rose-950 via-slate-900 to-slate-900 px-6 py-7 shadow-lg sm:px-8">
        <div className="pointer-events-none absolute -top-16 -right-10 size-64 rounded-full bg-rose-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/4 size-56 rounded-full bg-pink-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-rose-300/80">
              <Sparkles className="size-3.5" />
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} tracked
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Tasks
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Track and manage your daily sales activities and follow-ups.
              Drag cards between columns to update status.
            </p>
            <div className="mt-4 flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-rose-500/20 text-rose-300">
                  <ListTodo className="size-4" />
                </span>
                <div>
                  <p className="text-lg font-semibold text-white">
                    {urgentCount}
                  </p>
                  <p className="text-xs text-white/40">Urgent tasks</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                  <CheckSquare2 className="size-4" />
                </span>
                <div>
                  <p className="text-lg font-semibold text-white">
                    {completedCount}
                  </p>
                  <p className="text-xs text-white/40">Completed</p>
                </div>
              </div>
            </div>
          </div>
          <AddTaskDialog onCreated={refresh} />
        </div>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {COLUMNS.map((column) => (
            <TaskColumn
              key={column.key}
              stageKey={column.key}
              label={column.label}
              tasks={tasks.filter((task) => task.status === column.key)}
              onChanged={refresh}
              onDeleted={refresh}
              onEdit={setEditingTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Task</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-16">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <ListTodo className="size-5" />
                    </span>
                    <p className="text-sm text-muted-foreground">
                      No tasks yet.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {sortedTasks.map((task) => {
              const urgency = getTaskUrgency(task)
              return (
                <TableRow
                  key={task.id}
                  className="group cursor-pointer transition-colors hover:bg-muted/40"
                  onClick={() => setEditingTask(task)}
                >
                  <TableCell className="p-0">
                    <label
                      className="flex items-center gap-3 px-4 py-3"
                      onClick={(event) => event.stopPropagation()}
                    >
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
                    <TaskPriorityBadge priority={task.effectivePriority} />
                  </TableCell>
                  <TableCell>
                    <TaskStatusBadge status={task.status} />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 opacity-0 text-muted-foreground hover:text-destructive group-hover:opacity-100"
                      onClick={(event) => {
                        event.stopPropagation()
                        setDeletingTask(task)
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={deletingTask !== null}
        onOpenChange={(open) => !open && setDeletingTask(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete {deletingTask?.title}?</DialogTitle>
            <DialogDescription>
              This will permanently remove this task. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingTask(null)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-600/90"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditTaskDialog
        task={editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        onSaved={refresh}
      />
    </div>
  )
}
