import { createFileRoute, notFound, Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DeleteContactDialog } from '@/components/contacts/delete-contact-dialog'
import { EditContactDialog } from '@/components/contacts/edit-contact-dialog'
import { BackButton } from '@/components/dashboard/back-button'
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
      <BackButton />

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
        <div className="flex gap-2">
          <EditContactDialog contact={contact} />
          <DeleteContactDialog contact={contact} />
        </div>
      </div>

      <Card className="max-w-2xl">
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
    </div>
  )
}
