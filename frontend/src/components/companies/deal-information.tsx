import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { updateDealInformation, type Deal } from '@/data/companies'

interface DealInformationProps {
  deal: Deal
}

export function DealInformation({ deal }: DealInformationProps) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(deal.information)
  const router = useRouter()

  function startEditing() {
    setValue(deal.information)
    setEditing(true)
  }

  function cancel() {
    setValue(deal.information)
    setEditing(false)
  }

  function save() {
    updateDealInformation(deal.id, value.trim())
    setEditing(false)
    router.invalidate()
  }

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Deal Information</CardTitle>
        {!editing && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-foreground"
            aria-label="Edit deal information"
            onClick={startEditing}
          >
            <Pencil className="size-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {editing ? (
          <div className="flex flex-col gap-3">
            <Textarea
              value={value}
              onChange={(event) => setValue(event.target.value)}
              rows={3}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={cancel}>
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-600/90"
                onClick={save}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <p className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
            {deal.information || 'No notes yet.'}
          </p>
        )}
      </CardContent>
    </>
  )
}
