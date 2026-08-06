import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Trash2 } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import { deleteTask, getTaskUrgency, updateTaskStatus, type Task } from '@/data/tasks'

const URGENCY_STYLES = {
  normal: 'border-l-transparent',
  warning: 'border-l-amber-500',
  urgent: 'border-l-rose-500',
} as const

const URGENCY_LABEL = {
  normal: undefined,
  warning: 'Follow-up due soon',
  urgent: 'Needs urgent follow-up',
} as const

export function TaskCard({
  task,
  onDeleted,
  onEdit,
}: {
  task: Task
  onDeleted?: () => void
  onEdit?: (task: Task) => void
}) {
  const router = useRouter()
  const urgency = getTaskUrgency(task)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id })

  function toggle(checked: boolean) {
    updateTaskStatus(task.id, checked ? 'Completed' : 'Todo')
    router.invalidate()
  }

  function confirmDelete() {
    deleteTask(task.id)
    setConfirmingDelete(false)
    onDeleted?.()
    router.invalidate()
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={cn(
        'group flex touch-none items-start gap-3 rounded-xl border border-l-4 bg-card p-4',
        URGENCY_STYLES[urgency],
        isDragging && 'opacity-40',
      )}
      title={URGENCY_LABEL[urgency]}
    >
      <Checkbox
        checked={task.status === 'Completed'}
        onCheckedChange={(checked) => toggle(checked === true)}
        className="mt-0.5"
        onPointerDown={(event) => event.stopPropagation()}
      />
      <div
        {...listeners}
        {...attributes}
        onClick={() => onEdit?.(task)}
        className="min-w-0 flex-1 cursor-grab active:cursor-grabbing"
      >
        <p
          className={cn(
            'text-sm font-medium',
            task.status === 'Completed' &&
              'text-muted-foreground line-through',
          )}
        >
          {task.title}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{task.tag}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-7 shrink-0 text-muted-foreground opacity-0 hover:text-destructive group-hover:opacity-100"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => setConfirmingDelete(true)}
      >
        <Trash2 className="size-4" />
      </Button>

      <Dialog open={confirmingDelete} onOpenChange={setConfirmingDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete {task.title}?</DialogTitle>
            <DialogDescription>
              This will permanently remove this task. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmingDelete(false)}
            >
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
    </div>
  )
}
