import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const STATUS_STYLES = {
  Active: 'bg-emerald-100 text-emerald-700',
  Prospect: 'bg-amber-100 text-amber-700',
  Customer: 'bg-blue-100 text-blue-700',
} as const

export type ContactStatus = keyof typeof STATUS_STYLES

export function StatusBadge({ status }: { status: ContactStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn('border-transparent font-medium', STATUS_STYLES[status])}
    >
      {status}
    </Badge>
  )
}
