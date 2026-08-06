import { createFileRoute, notFound, Link, useRouter } from '@tanstack/react-router'
import { Building2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AvatarInitial } from '@/components/dashboard/avatar-initial'
import { DealStatusBadge } from '@/components/dashboard/deal-status-badge'
import { CompanyStatusBadge } from '@/components/dashboard/company-status-badge'
import { AddActivityDialog } from '@/components/companies/add-activity-dialog'
import { AddContactDialog } from '@/components/contacts/add-contact-dialog'
import { EditCompanyDialog } from '@/components/companies/edit-company-dialog'
import { DeleteCompanyDialog } from '@/components/companies/delete-company-dialog'
import { CompanyCredentials } from '@/components/companies/company-credentials'
import { DealStageList } from '@/components/companies/deal-stage-list'
import { AddDealDialog } from '@/components/companies/add-deal-dialog'
import { BackButton } from '@/components/dashboard/back-button'
import { getCompanyById } from '@/data/companies'
import { getActivitiesByCompanyId } from '@/data/activities'

export const Route = createFileRoute('/companies/org/$companyId')({
  loader: ({ params }) => {
    const company = getCompanyById(params.companyId)
    if (!company) throw notFound()
    return {
      company,
      activities: getActivitiesByCompanyId(company.id),
    }
  },
  component: CompanyDetailPage,
})

function CompanyDetailPage() {
  const { company, activities } = Route.useLoaderData()
  const router = useRouter()

  return (
    <div className="flex flex-col gap-6">
      <BackButton />

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Building2 className="size-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {company.name}
              </h1>
              <CompanyStatusBadge status={company.status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {company.tagline} • {company.location}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <EditCompanyDialog company={company} />
          <AddActivityDialog companyId={company.id} />
          <DeleteCompanyDialog company={company} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CompanyCredentials company={company} />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deal Stages Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <DealStageList companyId={company.id} stages={company.dealStages} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Associated Deals</CardTitle>
            <AddDealDialog companyId={company.id} />
          </CardHeader>
          <CardContent className="flex flex-col divide-y">
            {company.deals.length === 0 && (
              <p className="py-1 text-sm text-muted-foreground">
                No deals yet.
              </p>
            )}
            {company.deals.map((deal) => (
              <Link
                key={deal.id}
                to="/companies/deal/$dealId"
                params={{ dealId: deal.id }}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 hover:bg-muted/50"
              >
                <div>
                  <p className="text-sm font-medium">{deal.name}</p>
                  <p className="text-sm text-blue-600">{deal.amount}</p>
                </div>
                <DealStatusBadge status={deal.status} />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Associated Contacts</CardTitle>
            <AddContactDialog
              companyId={company.id}
              onCreated={() => router.invalidate()}
              trigger={
                <Button size="sm" variant="outline">
                  <Plus className="size-4" />
                  Add
                </Button>
              }
            />
          </CardHeader>
          <CardContent className="flex flex-col divide-y">
            {company.contacts.length === 0 && (
              <p className="py-1 text-sm text-muted-foreground">
                No contacts linked yet.
              </p>
            )}
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

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y">
            {activities.length === 0 && (
              <p className="py-1 text-sm text-muted-foreground">
                No activities logged yet.
              </p>
            )}
            {activities.map((activity) => (
              <Link
                key={activity.id}
                to="/companies/activity/$activityId"
                params={{ activityId: activity.id }}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 hover:bg-muted/50"
              >
                <div>
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.type} • {activity.datetime}
                  </p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
