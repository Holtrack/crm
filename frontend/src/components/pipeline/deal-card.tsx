import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Badge } from '@/components/ui/badge'
import type { Deal } from '@/data/pipeline'

export function DealCard({ deal }: { deal: Deal }) {
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
      <p className="text-sm font-medium">{deal.company}</p>
      <p className="text-sm font-medium text-blue-600">{deal.value}</p>
      <Badge variant="secondary" className="w-fit text-[11px] font-normal">
        {deal.tag}
      </Badge>
    </div>
  )
}
