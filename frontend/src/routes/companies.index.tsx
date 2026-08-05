import { createFileRoute, Link } from '@tanstack/react-router'
import { Search, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AvatarInitial } from '@/components/dashboard/avatar-initial'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { CONTACTS } from '@/data/contacts'

export const Route = createFileRoute('/companies/')({
  component: CompaniesPage,
})

function CompaniesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Companies</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your B2B prospects and clients.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-600/90">
          <Plus className="size-4" />
          Add Contact
        </Button>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Filter by name or company..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Status: All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="prospect">Prospect</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="walid">
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Owner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="walid">Owner: Walid</SelectItem>
            <SelectItem value="andi">Owner: Andi</SelectItem>
            <SelectItem value="rina">Owner: Rina</SelectItem>
            <SelectItem value="dimas">Owner: Dimas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CONTACTS.map((contact) => (
              <TableRow key={contact.id} className="cursor-pointer">
                <TableCell className="p-0">
                  <Link
                    to="/companies/$contactId"
                    params={{ contactId: contact.id }}
                    className="flex items-center gap-3 px-2 py-2"
                  >
                    <AvatarInitial name={contact.name} />
                    <span className="font-medium">{contact.name}</span>
                  </Link>
                </TableCell>
                <TableCell className="p-0">
                  <Link
                    to="/companies/org/$companyId"
                    params={{ companyId: contact.companyId }}
                    className="block px-2 py-2 text-muted-foreground hover:text-blue-600 hover:underline"
                  >
                    {contact.company}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {contact.phone}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {contact.owner}
                </TableCell>
                <TableCell>
                  <StatusBadge status={contact.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
