import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Search, Users, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AddContactDialog } from '@/components/contacts/add-contact-dialog'
import { ContactRow } from '@/components/contacts/contact-row'
import { listContacts, type ContactDetail } from '@/data/contacts'

export const Route = createFileRoute('/contacts')({
  component: ContactsPage,
})

function ContactsPage() {
  const [contacts, setContacts] = useState<ContactDetail[]>([])
  const [search, setSearch] = useState('')

  function refresh() {
    listContacts().then(setContacts).catch(() => {})
  }

  useEffect(() => {
    let cancelled = false
    listContacts()
      .then((result) => {
        if (!cancelled) setContacts(result)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(search.trim().toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-blue-950 via-slate-900 to-slate-900 px-6 py-7 shadow-lg sm:px-8">
        <div className="pointer-events-none absolute -top-16 -right-10 size-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/4 size-56 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-blue-300/80">
              <Sparkles className="size-3.5" />
              {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'} in your network
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Contacts
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Manage the people behind every deal.
            </p>
          </div>
          <AddContactDialog onCreated={refresh} />
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter by contact name..."
            className="pl-9"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Contact</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-16">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <Users className="size-5" />
                    </span>
                    <p className="text-sm text-muted-foreground">
                      No contacts match your filters.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {filteredContacts.map((contact) => (
              <ContactRow
                key={contact.id}
                contact={contact}
                onUpdated={refresh}
                onDeleted={refresh}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
