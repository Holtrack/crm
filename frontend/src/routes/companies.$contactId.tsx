import { createFileRoute, notFound, Link } from '@tanstack/react-router'
import { Mail, Phone, Building2, Briefcase, UserRound } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DeleteContactDialog } from '@/components/contacts/delete-contact-dialog'
import { EditContactDialog } from '@/components/contacts/edit-contact-dialog'
import { BackButton } from '@/components/dashboard/back-button'
import { getContact } from '@/data/contacts'
import { ApiError } from '@/lib/api'
import { cn, getAvatarGradient } from '@/lib/utils'

export const Route = createFileRoute('/companies/$contactId')({
  loader: async ({ params }) => {
    try {
      return await getContact(params.contactId)
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound()
      throw err
    }
  },
  component: ContactDetailPage,
})

function ContactDetailPage() {
  const contact = Route.useLoaderData()

  return (
    <div className="flex flex-col gap-6">
      <BackButton />

      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-white to-slate-50 px-6 py-6 shadow-sm sm:px-8">
        <div className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <span
              className={cn(
                'flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-semibold text-white shadow-lg',
                getAvatarGradient(contact.name),
              )}
            >
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
          <div className="flex flex-wrap gap-2">
            <EditContactDialog contact={contact} />
            <DeleteContactDialog contact={contact} />
          </div>
        </div>
      </div>

      <Card className="max-w-2xl border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <UserRound className="size-4" />
            </span>
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col divide-y divide-border/60">
          {[
            { icon: Mail, label: 'Email Address', value: contact.email },
            { icon: Phone, label: 'Phone Number', value: contact.phone },
            {
              icon: Building2,
              label: 'Associated Company',
              value: contact.company,
              link: {
                to: '/companies/org/$companyId',
                params: { companyId: contact.companyId },
              },
            },
            { icon: Briefcase, label: 'Position', value: contact.position },
            { icon: UserRound, label: 'Contact Owner', value: contact.owner },
          ].map(({ icon: Icon, label, value, link }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="size-4 shrink-0" />
                {label}
              </span>
              {link ? (
                <Link
                  to={link.to}
                  params={link.params}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  {value || '—'}
                </Link>
              ) : (
                <span className="text-sm font-medium">{value || '—'}</span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
