import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Check, Mail, Pencil, Phone, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AvatarInitial } from '@/components/dashboard/avatar-initial'
import { useCompanies } from '@/data/companies'
import { deleteContact, updateContact, type ContactDetail } from '@/data/contacts'
import { TEAM_OWNERS } from '@/data/owners'

interface EditState {
  name: string
  companyId: string
  position: string
  email: string
  phone: string
  owner: string
}

function toEditState(contact: ContactDetail): EditState {
  return {
    name: contact.name,
    companyId: contact.companyId,
    position: contact.position,
    email: contact.email,
    phone: contact.phone,
    owner: contact.owner,
  }
}

export function ContactRow({
  contact,
  onUpdated,
  onDeleted,
}: {
  contact: ContactDetail
  onUpdated: (contact: ContactDetail) => void
  onDeleted?: (contactId: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [draft, setDraft] = useState<EditState>(() => toEditState(contact))
  const companies = useCompanies()

  function startEditing() {
    setDraft(toEditState(contact))
    setEditing(true)
  }

  function cancelEditing() {
    setEditing(false)
  }

  async function save() {
    if (!draft.name.trim()) return

    const updated = await updateContact(contact.id, {
      name: draft.name.trim(),
      companyId: draft.companyId,
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      position: draft.position.trim(),
      owner: draft.owner,
    })

    onUpdated(updated)
    setEditing(false)
  }

  async function confirmDelete() {
    await deleteContact(contact.id)
    setConfirmingDelete(false)
    onDeleted?.(contact.id)
  }

  const deleteDialog = (
    <Dialog open={confirmingDelete} onOpenChange={setConfirmingDelete}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete {contact.name}?</DialogTitle>
          <DialogDescription>
            This will permanently remove this contact. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setConfirmingDelete(false)}>
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-600/90"
            onClick={confirmDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  if (!editing) {
    return (
      <TableRow className="group transition-colors hover:bg-muted/40">
        <TableCell className="p-0">
          <Link
            to="/companies/$contactId"
            params={{ contactId: contact.id }}
            className="flex items-center gap-3 px-4 py-3"
          >
            <AvatarInitial name={contact.name} />
            <span className="font-medium">{contact.name}</span>
          </Link>
        </TableCell>
        <TableCell className="text-muted-foreground">
          <Link
            to="/companies/org/$companyId"
            params={{ companyId: contact.companyId }}
            className="hover:text-foreground hover:underline"
          >
            {contact.company}
          </Link>
        </TableCell>
        <TableCell className="text-muted-foreground">
          {contact.position}
        </TableCell>
        <TableCell className="text-muted-foreground">
          {contact.email ? (
            <span className="inline-flex items-center gap-1.5">
              <Mail className="size-3.5 shrink-0" />
              {contact.email}
            </span>
          ) : (
            '—'
          )}
        </TableCell>
        <TableCell className="text-muted-foreground">
          {contact.phone ? (
            <span className="inline-flex items-center gap-1.5">
              <Phone className="size-3.5 shrink-0" />
              {contact.phone}
            </span>
          ) : (
            '—'
          )}
        </TableCell>
        <TableCell>
          <Badge
            variant="outline"
            className="border-transparent bg-slate-100 font-medium text-slate-700"
          >
            {contact.owner}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={startEditing}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-destructive"
              onClick={() => setConfirmingDelete(true)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </TableCell>
        {deleteDialog}
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
            {companies.map((company) => (
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
