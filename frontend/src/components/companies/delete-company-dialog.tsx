import { useState } from 'react'
import { useNavigate, useRouter } from '@tanstack/react-router'
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
import { deleteCompany, type Company } from '@/data/companies'

interface DeleteCompanyDialogProps {
  company: Company
}

export function DeleteCompanyDialog({ company }: DeleteCompanyDialogProps) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const router = useRouter()

  async function onConfirm() {
    await deleteCompany(company.id)
    setOpen(false)
    await navigate({ to: '/companies' })
    router.invalidate()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-red-600 hover:text-red-600">
          <Trash2 className="size-4" />
          Delete Company
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete {company.name}?</DialogTitle>
          <DialogDescription>
            This will permanently remove this company along with its deals,
            contacts, and deal stages. This action cannot be undone.
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
