import { createFileRoute, notFound, Link } from '@tanstack/react-router'
import { Briefcase, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DealStatusBadge } from '@/components/dashboard/deal-status-badge'
import { EditDealDialog } from '@/components/companies/edit-deal-dialog'
import { DealInformation } from '@/components/companies/deal-information'
import { getDealById, getCompanyById } from '@/data/companies'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/companies/deal/$dealId')({
  loader: ({ params }) => {
    const deal = getDealById(params.dealId)
    if (!deal) throw notFound()
    const company = getCompanyById(deal.companyId)
    if (!company) throw notFound()
    return { deal, company }
  },
  component: DealDetailPage,
})

const PROGRESS_SEGMENTS = 5

function DealDetailPage() {
  const { deal, company } = Route.useLoaderData()
  const primaryContact = company.contacts.find(
    (contact) => contact.contactId === deal.contactId,
  )
  const filledSegments = Math.round(
    (deal.probability / 100) * PROGRESS_SEGMENTS,
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white">
            <Briefcase className="size-6" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {deal.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Pipeline Contract with{' '}
              <Link
                to="/companies/org/$companyId"
                params={{ companyId: company.id }}
                className="text-blue-600 hover:underline"
              >
                {company.name}
              </Link>
            </p>
          </div>
        </div>
        <EditDealDialog deal={deal} contacts={company.contacts} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Deal Specifications</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Current Stage: <span className="font-medium text-foreground">{deal.status}</span>
                </span>
                <span className="font-medium text-amber-600">
                  {deal.probability}% Probability
                </span>
              </div>
              <div className="mt-2 flex gap-1">
                {Array.from({ length: PROGRESS_SEGMENTS }).map((_, index) => (
                  <span
                    key={index}
                    className={cn(
                      'h-1.5 flex-1 rounded-full',
                      index < filledSegments ? 'bg-amber-500' : 'bg-muted',
                    )}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col divide-y">
              <div className="flex items-center justify-between py-3 first:pt-0">
                <span className="text-sm text-muted-foreground">
                  Contract Value
                </span>
                <span className="text-sm font-semibold text-amber-600">
                  {deal.amount}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-muted-foreground">Stage</span>
                <DealStatusBadge status={deal.status} />
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-muted-foreground">
                  Target Company
                </span>
                <Link
                  to="/companies/org/$companyId"
                  params={{ companyId: company.id }}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  {company.name}
                </Link>
              </div>
              <div className="flex items-center justify-between py-3 last:pb-0">
                <span className="text-sm text-muted-foreground">
                  Primary Contact Person
                </span>
                <span className="text-sm font-medium">
                  {primaryContact?.name ?? 'Unassigned'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historical Activity log</CardTitle>
          </CardHeader>
          <CardContent>
            {deal.activityLog.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No activity logged yet.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {deal.activityLog.map((entry) => (
                  <div
                    key={entry.label}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          'flex size-5 shrink-0 items-center justify-center rounded-full',
                          entry.done
                            ? 'bg-emerald-500 text-white'
                            : 'bg-muted text-muted-foreground',
                        )}
                      >
                        <Check className="size-3" />
                      </span>
                      <p className="text-sm font-medium">{entry.label}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {entry.date}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <DealInformation deal={deal} />
        </Card>
      </div>
    </div>
  )
}
