import { createFileRoute, notFound, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DealStageTimeline } from '@/components/dashboard/deal-stage-timeline'
import { getContactById } from '@/data/contacts'

export const Route = createFileRoute('/companies/$contactId')({
  loader: ({ params }) => {
    const contact = getContactById(params.contactId)
    if (!contact) throw notFound()
    return contact
  },
  component: ContactDetailPage,
})

function ContactDetailPage() {
  const contact = Route.useLoaderData()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white">
            {contact.name
              .split(' ')
              .map((part) => part.charAt(0))
              .join('')
              .slice(0, 2)}
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {contact.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {contact.title}
            </p>
          </div>
        </div>
        <Button variant="outline">Edit Profile</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col divide-y">
              <div className="flex items-center justify-between py-3 first:pt-0">
                <span className="text-sm text-muted-foreground">
                  Email Address
                </span>
                <span className="text-sm font-medium">{contact.email}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-muted-foreground">
                  Phone Number
                </span>
                <span className="text-sm font-medium">{contact.phone}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-muted-foreground">
                  Associated Company
                </span>
                <Link
                  to="/companies/org/$companyId"
                  params={{ companyId: contact.companyId }}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  {contact.company}
                </Link>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-muted-foreground">
                  Position
                </span>
                <span className="text-sm font-medium">
                  {contact.position}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 last:pb-0">
                <span className="text-sm text-muted-foreground">
                  Contact Owner
                </span>
                <span className="text-sm font-medium">{contact.owner}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interaction Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                {contact.notes}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Deal Stages Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <DealStageTimeline stages={contact.dealStages} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
