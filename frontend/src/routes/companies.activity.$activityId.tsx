import { useState } from 'react'
import { createFileRoute, notFound, useRouter } from '@tanstack/react-router'
import { CalendarDays, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { DatePicker } from '@/components/ui/date-picker'
import { TimeSelect } from '@/components/ui/time-select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ACTIVITY_TYPES } from '@/components/companies/add-activity-dialog'
import { BackButton } from '@/components/dashboard/back-button'
import { getActivity, splitOccurredAt, updateActivity } from '@/data/activities'
import { ApiError } from '@/lib/api'

export const Route = createFileRoute('/companies/activity/$activityId')({
  loader: async ({ params }) => {
    try {
      const activity = await getActivity(params.activityId)
      return { activity }
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound()
      throw err
    }
  },
  component: ActivityDetailPage,
})

function ActivityDetailPage() {
  const { activity } = Route.useLoaderData()
  const router = useRouter()

  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [values, setValues] = useState(() => ({
    title: activity.title,
    type: activity.type,
    summary: activity.summary,
    ...splitOccurredAt(activity.occurredAt),
  }))

  function startEditing() {
    setValues({
      title: activity.title,
      type: activity.type,
      summary: activity.summary,
      ...splitOccurredAt(activity.occurredAt),
    })
    setError('')
    setEditing(true)
  }

  function cancel() {
    setEditing(false)
    setError('')
  }

  async function save() {
    setError('')
    setSubmitting(true)
    try {
      const occurredAt = new Date(
        `${values.date}T${values.time}:00.000Z`,
      ).toISOString()
      await updateActivity(activity.id, {
        title: values.title,
        type: values.type,
        summary: values.summary,
        occurredAt,
      })
      setEditing(false)
      router.invalidate()
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Gagal menyimpan perubahan.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <BackButton />

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <CalendarDays className="size-5" />
          </span>
          <div className="min-w-0">
            {editing ? (
              <Input
                value={values.title}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, title: event.target.value }))
                }
                className="text-lg font-semibold"
              />
            ) : (
              <h1 className="text-2xl font-semibold tracking-tight">
                {activity.title}
              </h1>
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
              <div className="flex gap-2">
                <DatePicker
                  value={values.date}
                  onChange={(date) =>
                    setValues((prev) => ({ ...prev, date }))
                  }
                  placeholder="Pick a date"
                />
                <TimeSelect
                  value={values.time}
                  onValueChange={(time) =>
                    setValues((prev) => ({ ...prev, time }))
                  }
                  placeholder="Select time"
                />
              </div>
            ) : (
              <span className="text-sm font-medium">{activity.datetime}</span>
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
            <div className="flex flex-col gap-2 pt-3">
              {error && <p className="text-sm text-rose-600">{error}</p>}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={cancel}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-600/90"
                  onClick={save}
                >
                  {submitting ? 'Menyimpan...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
