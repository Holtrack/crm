import { createFileRoute, notFound } from '@tanstack/react-router'
import { CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AvatarInitial } from '@/components/dashboard/avatar-initial'
import { getActivityById } from '@/data/activities'

export const Route = createFileRoute('/companies/activity/$activityId')({
  loader: ({ params }) => {
    const activity = getActivityById(params.activityId)
    if (!activity) throw notFound()
    return activity
  },
  component: ActivityDetailPage,
})

function ActivityDetailPage() {
  const activity = Route.useLoaderData()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <CalendarDays className="size-5" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {activity.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {activity.context}
            </p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-600/90">
          Edit Activity
        </Button>
      </div>

      <Card className="max-w-2xl">
        <CardContent className="flex flex-col divide-y">
          <div className="flex items-center justify-between py-3 first:pt-0">
            <span className="text-sm text-muted-foreground">
              Activity Type
            </span>
            <span className="text-sm font-medium">{activity.type}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-muted-foreground">
              Date &amp; Time
            </span>
            <span className="text-sm font-medium">{activity.datetime}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-muted-foreground">
              Participants
            </span>
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
          </div>
          <div className="py-3 last:pb-0">
            <p className="mb-2 text-sm text-muted-foreground">Summary</p>
            <p className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
              {activity.summary}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
