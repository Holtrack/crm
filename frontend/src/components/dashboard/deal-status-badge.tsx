import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { DealStatus } from '@/data/companies'

const DEAL_STATUS_STYLES: Record<DealStatus, string> = {
  Negotiation: 'bg-amber-100 text-amber-700',
  Won: 'bg-emerald-100 text-emerald-700',
  Lost: 'bg-rose-100 text-rose-700',
  Proposal: 'bg-blue-100 text-blue-700',
}

export function DealStatusBadge({ status }: { status: DealStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'border-transparent font-medium',
        DEAL_STATUS_STYLES[status],
      )}
    >
      {status}
    </Badge>
  )
}
