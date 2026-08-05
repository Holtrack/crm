import { useState } from 'react'
import { createFileRoute, notFound, useRouter } from '@tanstack/react-router'
import { CalendarDays, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AvatarInitial } from '@/components/dashboard/avatar-initial'
import { ACTIVITY_TYPES } from '@/components/companies/add-activity-dialog'
import { getActivityById, updateActivity } from '@/data/activities'
import { getCompanyById } from '@/data/companies'

export const Route = createFileRoute('/companies/activity/$activityId')({
  loader: ({ params }) => {
    const activity = getActivityById(params.activityId)
    if (!activity) throw notFound()
    const company = getCompanyById(activity.companyId)
    if (!company) throw notFound()
    return { activity, contacts: company.contacts }
  },
  component: ActivityDetailPage,
})

function ActivityDetailPage() {
  const { activity, contacts } = Route.useLoaderData()
  const router = useRouter()

  const [editing, setEditing] = useState(false)
  const [values, setValues] = useState(() => ({
    title: activity.title,
    context: activity.context,
    type: activity.type,
    datetime: activity.datetime,
    participantIds: activity.participants.map((p) => p.contactId),
    summary: activity.summary,
  }))

  function startEditing() {
    setValues({
      title: activity.title,
      context: activity.context,
      type: activity.type,
      datetime: activity.datetime,
      participantIds: activity.participants.map((p) => p.contactId),
      summary: activity.summary,
    })
    setEditing(true)
  }

  function cancel() {
    setEditing(false)
  }

  function save() {
    const contactsById = new Map(contacts.map((c) => [c.contactId, c.name]))
    updateActivity(activity.id, values, contactsById)
    setEditing(false)
    router.invalidate()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <CalendarDays className="size-5" />
          </span>
          <div className="min-w-0">
            {editing ? (
              <div className="flex flex-col gap-2">
                <Input
                  value={values.title}
                  onChange={(event) =>
                    setValues((prev) => ({ ...prev, title: event.target.value }))
                  }
                  className="text-lg font-semibold"
                />
                <Input
                  value={values.context}
                  onChange={(event) =>
                    setValues((prev) => ({
                      ...prev,
                      context: event.target.value,
                    }))
                  }
                />
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-semibold tracking-tight">
                  {activity.title}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {activity.context}
                </p>
              </>
            )}
          </div>
        </div>
        {!editing && (
          <Button
            variant="outline"
            onClick={startEditing}
            className="shrink-0"
          >
            <Pencil className="size-4" />
            Edit Activity
          </Button>
        )}
      </div>

      <Card className="max-w-2xl">
        <CardContent className="flex flex-col divide-y">
          <div className="flex items-center justify-between py-3 first:pt-0">
            <span className="text-sm text-muted-foreground">
              Activity Type
            </span>
            {editing ? (
              <Select
                value={values.type}
                onValueChange={(value) =>
                  setValues((prev) => ({
                    ...prev,
                    type: value as typeof prev.type,
                  }))
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className="text-sm font-medium">{activity.type}</span>
            )}
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-muted-foreground">
              Date &amp; Time
            </span>
            {editing ? (
              <Input
                className="w-56"
                value={values.datetime}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    datetime: event.target.value,
                  }))
                }
              />
            ) : (
              <span className="text-sm font-medium">{activity.datetime}</span>
            )}
          </div>
          <div className="flex items-start justify-between py-3">
            <span className="pt-1 text-sm text-muted-foreground">
              Participants
            </span>
            {editing ? (
              <div className="flex flex-col gap-2">
                {contacts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    This company has no contacts yet.
                  </p>
                ) : (
                  contacts.map((contact) => (
                    <label
                      key={contact.contactId}
                      className="flex items-center justify-end gap-2 text-sm"
                    >
                      {contact.name}
                      <Checkbox
                        checked={values.participantIds.includes(
                          contact.contactId,
                        )}
                        onCheckedChange={(checked) =>
                          setValues((prev) => ({
                            ...prev,
                            participantIds: checked
                              ? [...prev.participantIds, contact.contactId]
                              : prev.participantIds.filter(
                                  (id) => id !== contact.contactId,
                                ),
                          }))
                        }
                      />
                    </label>
                  ))
                )}
              </div>
            ) : (
              <div className="flex flex-wrap justify-end gap-2">
                {activity.participants.map((participant) => (
                  <span
                    key={participant.contactId}
                    className="flex items-center gap-1.5"
                  >
                    <AvatarInitial name={participant.name} />
                    <span className="text-sm font-medium">
                      {participant.name}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="py-3 last:pb-0">
            <p className="mb-2 text-sm text-muted-foreground">Summary</p>
            {editing ? (
              <Textarea
                rows={3}
                value={values.summary}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    summary: event.target.value,
                  }))
                }
              />
            ) : (
              <p className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                {activity.summary}
              </p>
            )}
          </div>

          {editing && (
            <div className="flex justify-end gap-2 pt-3">
              <Button type="button" variant="outline" onClick={cancel}>
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-600/90"
                onClick={save}
              >
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
