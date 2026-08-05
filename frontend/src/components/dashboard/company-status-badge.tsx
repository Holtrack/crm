import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { CompanyStatus } from '@/data/companies'

const STATUS_STYLES: Record<CompanyStatus, string> = {
  Active: 'bg-emerald-100 text-emerald-700',
  Prospect: 'bg-amber-100 text-amber-700',
  Customer: 'bg-blue-100 text-blue-700',
}

export function CompanyStatusBadge({ status }: { status: CompanyStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn('border-transparent font-medium', STATUS_STYLES[status])}
    >
      {status}
    </Badge>
  )
}
