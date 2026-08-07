import { useDroppable } from '@dnd-kit/core'
import { Inbox } from 'lucide-react'
import { DealCard } from '@/components/pipeline/deal-card'
import { STAGE_STYLES, type PipelineDeal, type StageKey } from '@/data/pipeline'
import { cn, formatRupiah, parseRupiah } from '@/lib/utils'

interface PipelineColumnProps {
  stageKey: StageKey
  label: string
  deals: PipelineDeal[]
}

export function PipelineColumn({ stageKey, label, deals }: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stageKey })
  const styles = STAGE_STYLES[stageKey]
  const totalValue = deals.reduce(
    (sum, deal) => sum + parseRupiah(deal.amount),
    0,
  )

  return (
    <div className="flex w-72 shrink-0 flex-col gap-3">
      <div className="rounded-xl border border-border/60 bg-card px-3.5 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className={cn('size-2 shrink-0 rounded-full', styles.dot)} />
          <h2 className="text-sm font-semibold">{label}</h2>
          <span className="flex size-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
            {deals.length}
          </span>
        </div>
        <p className="mt-1 text-xs font-medium text-muted-foreground">
          {formatRupiah(totalValue)}
        </p>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex min-h-28 flex-1 flex-col gap-3 rounded-xl border border-dashed border-transparent p-2 transition-colors',
          isOver && cn('border-border', styles.tint),
        )}
      >
        {deals.length === 0 ? (
          <div className="flex h-28 flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border/60 text-xs text-muted-foreground">
            <Inbox className="size-4" />
            No deals
          </div>
        ) : (
          deals.map((deal) => <DealCard key={deal.id} deal={deal} />)
        )}
      </div>
    </div>
  )
}
