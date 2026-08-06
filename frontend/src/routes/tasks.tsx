import { useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
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
import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AddTaskDialog } from '@/components/tasks/add-task-dialog'
import { TaskCard } from '@/components/tasks/task-card'
import { TaskColumn } from '@/components/tasks/task-column'
import { EditTaskDialog } from '@/components/tasks/edit-task-dialog'
import { TaskPriorityBadge, TaskStatusBadge } from '@/components/tasks/task-badges'
import {
  TASKS,
  deleteTask,
  formatDeadline,
  getEffectivePriority,
  getTaskUrgency,
  updateTaskStatus,
  type Task,
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
  const [activeId, setActiveId] = useState<string | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
  )

  function toggle(id: string, checked: boolean) {
    updateTaskStatus(id, checked ? 'Completed' : 'Todo')
    router.invalidate()
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    updateTaskStatus(String(active.id), over.id as TaskStatus)
    router.invalidate()
  }

  function confirmDelete() {
    if (!deletingTask) return
    deleteTask(deletingTask.id)
    setDeletingTask(null)
    router.invalidate()
  }

  const activeTask = tasks.find((task) => task.id === activeId)
  const sortedTasks = [...tasks].sort((a, b) =>
    a.dueDate.localeCompare(b.dueDate),
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track and manage your daily sales activities and follow-ups. Drag
            cards between columns to update status.
          </p>
        </div>
        <AddTaskDialog />
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
              onDeleted={() => router.invalidate()}
              onEdit={setEditingTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.map((task) => {
              const urgency = getTaskUrgency(task)
              return (
                <TableRow
                  key={task.id}
                  className="group cursor-pointer"
                  onClick={() => setEditingTask(task)}
                >
                  <TableCell className="p-0">
                    <label
                      className="flex items-center gap-3 px-2 py-2"
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
                    <TaskPriorityBadge priority={getEffectivePriority(task)} />
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
        onSaved={() => router.invalidate()}
      />
    </div>
  )
}
