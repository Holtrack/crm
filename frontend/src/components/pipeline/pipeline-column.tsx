import { useDroppable } from '@dnd-kit/core'
import { DealCard } from '@/components/pipeline/deal-card'
import type { Deal, StageKey } from '@/data/pipeline'
import { cn } from '@/lib/utils'

interface PipelineColumnProps {
  stageKey: StageKey
  label: string
  deals: Deal[]
}

export function PipelineColumn({ stageKey, label, deals }: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stageKey })

  return (
    <div className="flex w-64 shrink-0 flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold">{label}</h2>
        <span className="flex size-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
          {deals.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex min-h-24 flex-col gap-3 rounded-lg p-1 transition-colors',
          isOver && 'bg-blue-50',
        )}
      >
        {deals.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
            No deals
          </div>
        ) : (
          deals.map((deal) => <DealCard key={deal.id} deal={deal} />)
        )}
      </div>
    </div>
  )
}
