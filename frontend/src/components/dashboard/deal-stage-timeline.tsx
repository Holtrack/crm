import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DealStage } from '@/data/contacts'

export function DealStageTimeline({ stages }: { stages: DealStage[] }) {
  return (
    <div className="flex flex-col gap-5">
      {stages.map((stage) => (
        <div key={stage.title} className="flex items-start gap-3">
          <span
            className={cn(
              'flex size-6 shrink-0 items-center justify-center rounded-full',
              stage.done
                ? 'bg-emerald-500 text-white'
                : 'bg-muted text-muted-foreground',
            )}
          >
            <Check className="size-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium">{stage.title}</p>
              <span className="shrink-0 text-xs text-muted-foreground">
                {stage.date}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {stage.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
