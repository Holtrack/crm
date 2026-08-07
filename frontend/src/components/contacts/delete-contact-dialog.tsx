import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { deleteContact, type ContactDetail } from '@/data/contacts'

interface DeleteContactDialogProps {
  contact: ContactDetail
}

export function DeleteContactDialog({ contact }: DeleteContactDialogProps) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  async function onConfirm() {
    await deleteContact(contact.id)
    setOpen(false)
    navigate({ to: '/contacts' })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-red-600 hover:text-red-600">
          <Trash2 className="size-4" />
          Delete Contact
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete {contact.name}?</DialogTitle>
          <DialogDescription>
            This will permanently remove this contact. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-600/90"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
