import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import type { PipelineDeal } from '@/data/pipeline'

export function DealCard({ deal }: { deal: PipelineDeal }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: deal.id })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={`flex cursor-grab flex-col gap-1.5 rounded-lg border bg-card p-3 shadow-sm touch-none active:cursor-grabbing ${
        isDragging ? 'opacity-40' : ''
      }`}
    >
      <Link
        to="/companies/deal/$dealId"
        params={{ dealId: deal.id }}
        onPointerDown={(event) => event.stopPropagation()}
        className="text-sm font-medium hover:underline"
      >
        {deal.name}
      </Link>
      <p className="text-xs text-muted-foreground">{deal.companyName}</p>
      <p className="text-sm font-medium text-blue-600">{deal.amount}</p>
      <Badge variant="secondary" className="w-fit text-[11px] font-normal">
        {deal.probability}% probability
      </Badge>
    </div>
  )
}
