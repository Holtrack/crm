import { createFileRoute, notFound, Link } from '@tanstack/react-router'
import { Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AvatarInitial } from '@/components/dashboard/avatar-initial'
import { DealStageTimeline } from '@/components/dashboard/deal-stage-timeline'
import { DealStatusBadge } from '@/components/dashboard/deal-status-badge'
import { getCompanyById } from '@/data/companies'

export const Route = createFileRoute('/companies/org/$companyId')({
  loader: ({ params }) => {
    const company = getCompanyById(params.companyId)
    if (!company) throw notFound()
    return company
  },
  component: CompanyDetailPage,
})

function CompanyDetailPage() {
  const company = Route.useLoaderData()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Building2 className="size-6" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {company.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {company.tagline} • {company.location}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit Corporate Profile</Button>
          <Button className="bg-blue-600 hover:bg-blue-600/90">
            + Add Contact
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-600/90">
            + Add Activity
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Company Credentials</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Industry
              </p>
              <p className="mt-1 text-sm font-medium">{company.industry}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Website
              </p>
              <p className="mt-1 text-sm font-medium">{company.website}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Address
              </p>
              <p className="mt-1 text-sm font-medium">{company.address}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Team Lead Owner
              </p>
              <p className="mt-1 text-sm font-medium">
                {company.teamLeadOwner}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity / Deal Stages Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <DealStageTimeline stages={company.dealStages} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Associated Deals</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y">
            {company.deals.map((deal) => (
              <div
                key={deal.name}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium">{deal.name}</p>
                  <p className="text-sm text-blue-600">{deal.amount}</p>
                </div>
                <DealStatusBadge status={deal.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Associated Contacts</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y">
            {company.contacts.map((contact) => (
              <Link
                key={contact.contactId}
                to="/companies/$contactId"
                params={{ contactId: contact.contactId }}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <AvatarInitial name={contact.name} />
                  <div>
                    <p className="text-sm font-medium">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {contact.position}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {contact.phone}
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
