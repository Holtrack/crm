import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Check, Pencil, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TableCell, TableRow } from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AvatarInitial } from '@/components/dashboard/avatar-initial'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { COMPANIES } from '@/data/companies'
import { updateContact, type ContactDetail } from '@/data/contacts'

const TEAM_OWNERS = ['Charissa', 'Andi Wijaya', 'Rina Kartika', 'Dimas Prasetyo']

interface EditState {
  name: string
  companyId: string
  position: string
  email: string
  phone: string
  owner: string
  status: ContactDetail['status']
}

function toEditState(contact: ContactDetail): EditState {
  return {
    name: contact.name,
    companyId: contact.companyId,
    position: contact.position,
    email: contact.email,
    phone: contact.phone,
    owner: contact.owner,
    status: contact.status,
  }
}

export function ContactRow({
  contact,
  onUpdated,
}: {
  contact: ContactDetail
  onUpdated: (contact: ContactDetail) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<EditState>(() => toEditState(contact))

  function startEditing() {
    setDraft(toEditState(contact))
    setEditing(true)
  }

  function cancelEditing() {
    setEditing(false)
  }

  function save() {
    const company = COMPANIES.find((c) => c.id === draft.companyId)
    if (!company || !draft.name.trim()) return

    const updated = updateContact(contact.id, {
      name: draft.name.trim(),
      company: company.name,
      companyId: company.id,
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      position: draft.position.trim(),
      owner: draft.owner,
      status: draft.status,
    })
    onUpdated(updated)
    setEditing(false)
  }

  if (!editing) {
    return (
      <TableRow className="group">
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
        <TableCell className="text-muted-foreground">
          <Link
            to="/companies/org/$companyId"
            params={{ companyId: contact.companyId }}
            className="hover:underline"
          >
            {contact.company}
          </Link>
        </TableCell>
        <TableCell className="text-muted-foreground">
          {contact.position}
        </TableCell>
        <TableCell className="text-muted-foreground">
          {contact.email}
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
        <TableCell>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 opacity-0 group-hover:opacity-100"
            onClick={startEditing}
          >
            <Pencil className="size-4" />
          </Button>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <TableRow>
      <TableCell>
        <Input
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          className="h-8"
        />
      </TableCell>
      <TableCell>
        <Select
          value={draft.companyId}
          onValueChange={(value) => setDraft({ ...draft, companyId: value })}
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue placeholder="Company" />
          </SelectTrigger>
          <SelectContent>
            {COMPANIES.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Input
          value={draft.position}
          onChange={(e) => setDraft({ ...draft, position: e.target.value })}
          className="h-8"
        />
      </TableCell>
      <TableCell>
        <Input
          value={draft.email}
          onChange={(e) => setDraft({ ...draft, email: e.target.value })}
          className="h-8"
        />
      </TableCell>
      <TableCell>
        <Input
          value={draft.phone}
          onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
          className="h-8"
        />
      </TableCell>
      <TableCell>
        <Select
          value={draft.owner}
          onValueChange={(value) => setDraft({ ...draft, owner: value })}
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue placeholder="Owner" />
          </SelectTrigger>
          <SelectContent>
            {TEAM_OWNERS.map((owner) => (
              <SelectItem key={owner} value={owner}>
                {owner}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Select
          value={draft.status}
          onValueChange={(value) =>
            setDraft({ ...draft, status: value as EditState['status'] })
          }
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Prospect">Prospect</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Customer">Customer</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-emerald-600 hover:text-emerald-600"
            onClick={save}
          >
            <Check className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground"
            onClick={cancelEditing}
          >
            <X className="size-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
