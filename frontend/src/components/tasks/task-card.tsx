import { useRouter } from '@tanstack/react-router'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { getTaskUrgency, updateTaskStatus, type Task } from '@/data/tasks'

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

export function TaskCard({ task }: { task: Task }) {
  const router = useRouter()
  const urgency = getTaskUrgency(task)

  function toggle(checked: boolean) {
    updateTaskStatus(task.id, checked ? 'Completed' : 'Todo')
    router.invalidate()
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border border-l-4 bg-card p-4',
        URGENCY_STYLES[urgency],
      )}
      title={URGENCY_LABEL[urgency]}
    >
      <Checkbox
        checked={task.status === 'Completed'}
        onCheckedChange={(checked) => toggle(checked === true)}
        className="mt-0.5"
      />
      <div className="min-w-0">
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
    </div>
  )
}
