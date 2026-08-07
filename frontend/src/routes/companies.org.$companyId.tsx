import { createFileRoute, notFound, Link, useRouter } from '@tanstack/react-router'
import {
  Building2,
  Plus,
  CalendarClock,
  Briefcase,
  Users,
  Inbox,
} from 'lucide-react'
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
import { AddDealDialog } from '@/components/companies/add-deal-dialog'
import { BackButton } from '@/components/dashboard/back-button'
import { getCompany } from '@/data/companies'
import { getDealsByCompanyId } from '@/data/deals'
import { getContactsByCompanyId } from '@/data/contacts'
import { getActivitiesByCompanyId } from '@/data/activities'
import { ApiError } from '@/lib/api'
import { cn, getAvatarGradient } from '@/lib/utils'

export const Route = createFileRoute('/companies/org/$companyId')({
  loader: async ({ params }) => {
    let company
    try {
      company = await getCompany(params.companyId)
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound()
      throw err
    }
    return {
      company,
      deals: await getDealsByCompanyId(company.id),
      contacts: await getContactsByCompanyId(company.id),
      activities: await getActivitiesByCompanyId(company.id),
    }
  },
  component: CompanyDetailPage,
})

function EmptyState({
  icon: Icon,
  label,
}: {
  icon: typeof Inbox
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-5" />
      </span>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

function CompanyDetailPage() {
  const { company, deals, contacts, activities } = Route.useLoaderData()
  const router = useRouter()

  return (
    <div className="flex flex-col gap-6">
      <BackButton />

      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-white to-slate-50 px-6 py-6 shadow-sm sm:px-8">
        <div className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <span
              className={cn(
                'flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-xl font-semibold text-white shadow-lg',
                getAvatarGradient(company.id),
              )}
            >
              <Building2 className="size-7" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
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
          <div className="flex flex-wrap gap-2">
            <EditCompanyDialog company={company} />
            <AddActivityDialog companyId={company.id} />
            <DeleteCompanyDialog company={company} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-border/60 shadow-sm">
          <CompanyCredentials company={company} />
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <CalendarClock className="size-4" />
              </span>
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border/60">
            {activities.length === 0 && (
              <EmptyState icon={CalendarClock} label="No activities logged yet." />
            )}
            {activities.map((activity) => (
              <Link
                key={activity.id}
                to="/companies/activity/$activityId"
                params={{ activityId: activity.id }}
                className="flex items-center justify-between gap-3 rounded-lg px-2 py-3 transition-colors first:pt-0 last:pb-0 hover:bg-muted/60"
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

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="flex size-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <Briefcase className="size-4" />
              </span>
              Associated Deals
            </CardTitle>
            <AddDealDialog companyId={company.id} />
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border/60">
            {deals.length === 0 && (
              <EmptyState icon={Briefcase} label="No deals yet." />
            )}
            {deals.map((deal) => (
              <Link
                key={deal.id}
                to="/companies/deal/$dealId"
                params={{ dealId: deal.id }}
                className="flex items-center justify-between gap-3 rounded-lg px-2 py-3 transition-colors first:pt-0 last:pb-0 hover:bg-muted/60"
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

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <Users className="size-4" />
              </span>
              Associated Contacts
            </CardTitle>
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
          <CardContent className="flex flex-col divide-y divide-border/60">
            {contacts.length === 0 && (
              <EmptyState icon={Users} label="No contacts linked yet." />
            )}
            {contacts.map((contact) => (
              <Link
                key={contact.id}
                to="/companies/$contactId"
                params={{ contactId: contact.id }}
                className="flex items-center justify-between gap-3 rounded-lg px-2 py-3 transition-colors first:pt-0 last:pb-0 hover:bg-muted/60"
              >
                <div className="flex items-center gap-3">
                  <AvatarInitial name={contact.name} />
                  <div>
                    <p className="text-sm font-medium">{contact.name}</p>
                    {contact.position && (
                      <p className="text-xs text-muted-foreground">
                        {contact.position}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5 text-right">
                  {contact.phone && (
                    <span className="text-sm text-muted-foreground">
                      {contact.phone}
                    </span>
                  )}
                  {contact.email && (
                    <span className="text-xs text-muted-foreground">
                      {contact.email}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
