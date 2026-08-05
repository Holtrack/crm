import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Users,
  Building2,
  DollarSign,
  CheckSquare,
  Phone,
  Mail,
  Presentation,
  StickyNote,
  CalendarClock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCard } from '@/components/dashboard/stat-card'
import { CONTACTS } from '@/data/contacts'
import { COMPANIES, getCompanyById } from '@/data/companies'
import { ACTIVITIES } from '@/data/activities'
import { TASKS, formatDeadline, getTaskUrgency } from '@/data/tasks'
import { formatRupiah, parseRupiah, cn } from '@/lib/utils'

export const Route = createFileRoute('/')({
  component: DashboardPage,
})

const ACTIVITY_ICONS = {
  Meeting: Presentation,
  Call: Phone,
  Email: Mail,
  Demo: Presentation,
  'Follow Up': CalendarClock,
  Note: StickyNote,
} as const

const URGENCY_DOT_STYLES = {
  normal: 'bg-blue-500',
  warning: 'bg-amber-500',
  urgent: 'bg-rose-500',
} as const

function DashboardPage() {
  const totalDeals = COMPANIES.flatMap((company) => company.deals)
  const openDeals = totalDeals.filter(
    (deal) => deal.status !== 'Won' && deal.status !== 'Lost',
  )
  const pipelineValue = openDeals.reduce(
    (sum, deal) => sum + parseRupiah(deal.amount),
    0,
  )
  const activeCompanies = COMPANIES.filter(
    (company) => company.status === 'Active',
  ).length
  const urgentTasks = TASKS.filter(
    (task) => getTaskUrgency(task) === 'urgent',
  ).length

  const stats = [
    {
      label: 'Contacts',
      value: String(CONTACTS.length),
      hint: `Across ${COMPANIES.length} companies`,
      icon: Users,
      iconClassName: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Companies',
      value: String(COMPANIES.length),
      hint: `${activeCompanies} active`,
      icon: Building2,
      iconClassName: 'bg-emerald-100 text-emerald-600',
    },
    {
      label: 'Deals',
      value: String(totalDeals.length),
      hint: `${formatRupiah(pipelineValue)} open pipeline`,
      icon: DollarSign,
      iconClassName: 'bg-amber-100 text-amber-600',
    },
    {
      label: 'Tasks',
      value: String(TASKS.length),
      hint: `${urgentTasks} urgent task${urgentTasks === 1 ? '' : 's'}`,
      icon: CheckSquare,
      iconClassName: 'bg-rose-100 text-rose-600',
    },
  ]

  const upcomingTasks = TASKS.filter((task) => task.status !== 'Completed')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4)

  const recentActivity = [...ACTIVITIES].reverse().slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here is your team's performance today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Upcoming Tasks</CardTitle>
            <Link
              to="/tasks"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              View All
            </Link>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {upcomingTasks.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nothing due — you're all caught up.
              </p>
            )}
            {upcomingTasks.map((task) => {
              const urgency = getTaskUrgency(task)
              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'size-2 shrink-0 rounded-full',
                        URGENCY_DOT_STYLES[urgency],
                      )}
                    />
                    <div>
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.tag}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-md border bg-white px-3 py-1 text-xs font-medium">
                    {formatDeadline(task.dueDate)}
                  </span>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {recentActivity.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No activity logged yet.
              </p>
            )}
            {recentActivity.map((activity) => {
              const Icon = ACTIVITY_ICONS[activity.type]
              const company = getCompanyById(activity.companyId)
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{activity.title}</span>
                      {company && (
                        <>
                          {' '}
                          with{' '}
                          <span className="font-medium text-blue-600">
                            {company.name}
                          </span>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.datetime}
                    </p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
