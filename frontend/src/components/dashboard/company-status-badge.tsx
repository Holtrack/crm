import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { updateCompanyStatus, type CompanyStatus } from '@/data/companies'

const STATUS_STYLES: Record<CompanyStatus, string> = {
  Active: 'bg-emerald-100 text-emerald-700',
  Prospect: 'bg-amber-100 text-amber-700',
  Customer: 'bg-blue-100 text-blue-700',
}

const STATUSES: CompanyStatus[] = ['Prospect', 'Active', 'Customer']

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

interface CompanyStatusSelectProps {
  companyId: string
  status: CompanyStatus
  onChanged?: (status: CompanyStatus) => void
}

export function CompanyStatusSelect({
  companyId,
  status,
  onChanged,
}: CompanyStatusSelectProps) {
  async function handleChange(next: string) {
    const updated = await updateCompanyStatus(companyId, next as CompanyStatus)
    onChanged?.(updated.status)
  }

  return (
    <Select value={status} onValueChange={handleChange}>
      <SelectTrigger
        size="sm"
        className={cn(
          'h-7 w-fit gap-1 border-transparent font-medium',
          STATUS_STYLES[status],
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
