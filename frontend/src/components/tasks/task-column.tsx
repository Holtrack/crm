import { useDroppable } from '@dnd-kit/core'
import { TaskCard } from '@/components/tasks/task-card'
import type { Task, TaskStatus } from '@/data/tasks'
import { cn } from '@/lib/utils'

interface TaskColumnProps {
  stageKey: TaskStatus
  label: string
  tasks: Task[]
  onDeleted: () => void
  onEdit: (task: Task) => void
}

export function TaskColumn({
  stageKey,
  label,
  tasks,
  onDeleted,
  onEdit,
}: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stageKey })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold">{label}</p>
        <span className="flex size-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex min-h-24 flex-col gap-3 rounded-lg p-1 transition-colors',
          isOver && 'bg-blue-50',
        )}
      >
        {tasks.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
            No tasks
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDeleted={onDeleted}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  )
}
