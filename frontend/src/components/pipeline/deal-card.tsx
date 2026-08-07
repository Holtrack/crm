import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Link } from '@tanstack/react-router'
import { STAGE_STYLES, type PipelineDeal } from '@/data/pipeline'
import { cn, getAvatarGradient } from '@/lib/utils'

const PROGRESS_SEGMENTS = 5

export function DealCard({ deal }: { deal: PipelineDeal }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: deal.id })

  const styles = STAGE_STYLES[deal.status]
  const filledSegments = Math.round((deal.probability / 100) * PROGRESS_SEGMENTS)

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={cn(
        'flex touch-none cursor-grab flex-col gap-2.5 rounded-xl border border-l-4 bg-card p-3.5 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing',
        styles.accent,
        isDragging && 'opacity-40',
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'flex size-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br text-[10px] font-semibold text-white',
            getAvatarGradient(deal.companyId),
          )}
        >
          {deal.companyName.charAt(0).toUpperCase()}
        </span>
        <p className="truncate text-xs text-muted-foreground">
          {deal.companyName}
        </p>
      </div>

      <Link
        to="/companies/deal/$dealId"
        params={{ dealId: deal.id }}
        onPointerDown={(event) => event.stopPropagation()}
        className="text-sm font-semibold hover:underline"
      >
        {deal.name}
      </Link>

      <p className={cn('text-sm font-semibold', styles.text)}>{deal.amount}</p>

      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {Array.from({ length: PROGRESS_SEGMENTS }).map((_, index) => (
            <span
              key={index}
              className={cn(
                'h-1 flex-1 rounded-full',
                index < filledSegments ? styles.dot : 'bg-muted',
              )}
            />
          ))}
        </div>
        <span className="text-[11px] font-medium text-muted-foreground">
          {deal.probability}%
        </span>
      </div>
    </div>
  )
}
