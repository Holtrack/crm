import { useDroppable } from '@dnd-kit/core'
import { Inbox } from 'lucide-react'
import { TaskCard } from '@/components/tasks/task-card'
import { TASK_STATUS_STYLES, type Task, type TaskStatus } from '@/data/tasks'
import { cn } from '@/lib/utils'

interface TaskColumnProps {
  stageKey: TaskStatus
  label: string
  tasks: Task[]
  onChanged: () => void
  onDeleted: () => void
  onEdit: (task: Task) => void
}

export function TaskColumn({
  stageKey,
  label,
  tasks,
  onChanged,
  onDeleted,
  onEdit,
}: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stageKey })
  const styles = TASK_STATUS_STYLES[stageKey]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-3.5 py-3 shadow-sm">
        <span className={cn('size-2 shrink-0 rounded-full', styles.dot)} />
        <p className="text-sm font-semibold">{label}</p>
        <span className="flex size-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex min-h-28 flex-1 flex-col gap-3 rounded-xl border border-dashed border-transparent p-2 transition-colors',
          isOver && cn('border-border', styles.tint),
        )}
      >
        {tasks.length === 0 ? (
          <div className="flex h-28 flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border/60 text-xs text-muted-foreground">
            <Inbox className="size-4" />
            No tasks
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onChanged={onChanged}
              onDeleted={onDeleted}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  )
}
