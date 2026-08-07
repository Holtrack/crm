import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Users,
  Building2,
  DollarSign,
  CheckSquare,
  Phone,
  Mail,
  Presentation,
  CalendarClock,
  MessageCircle,
  ListChecks,
  Activity as ActivityIcon,
  ArrowRight,
  Inbox,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCard, type StatTheme } from '@/components/dashboard/stat-card'
import { useContacts } from '@/data/contacts'
import { useCompanies } from '@/data/companies'
import { useDeals } from '@/data/deals'
import { useActivities } from '@/data/activities'
import { useTasks, formatDeadline, getTaskUrgency } from '@/data/tasks'
import { getCurrentUser } from '@/lib/auth'
import { formatRupiah, parseRupiah, cn } from '@/lib/utils'

export const Route = createFileRoute('/')({
  component: DashboardPage,
})

const ACTIVITY_STYLES: Record<
  string,
  { icon: typeof Presentation; className: string }
> = {
  Meeting: { icon: Presentation, className: 'bg-gradient-to-br from-indigo-500 to-indigo-600' },
  Call: { icon: Phone, className: 'bg-gradient-to-br from-blue-500 to-blue-600' },
  Email: { icon: Mail, className: 'bg-gradient-to-br from-violet-500 to-violet-600' },
  Demo: { icon: Presentation, className: 'bg-gradient-to-br from-fuchsia-500 to-fuchsia-600' },
  'Follow Up': { icon: CalendarClock, className: 'bg-gradient-to-br from-amber-500 to-amber-600' },
  WhatsApp: { icon: MessageCircle, className: 'bg-gradient-to-br from-emerald-500 to-emerald-600' },
}

const URGENCY_STYLES = {
  normal: { dot: 'bg-blue-500', badge: 'border-border/60 bg-white text-foreground' },
  warning: { dot: 'bg-amber-500', badge: 'border-amber-200 bg-amber-50 text-amber-700' },
  urgent: { dot: 'bg-rose-500', badge: 'border-rose-200 bg-rose-50 text-rose-700' },
} as const

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 11) return 'Selamat pagi'
  if (hour < 15) return 'Selamat siang'
  if (hour < 19) return 'Selamat sore'
  return 'Selamat malam'
}

function DashboardPage() {
  const companies = useCompanies()
  const contacts = useContacts()
  const deals = useDeals()
  const tasks = useTasks()
  const activities = useActivities()
  const user = getCurrentUser()
  const companyById = new Map(companies.map((company) => [company.id, company]))

  const openDeals = deals.filter(
    (deal) => deal.status !== 'Won' && deal.status !== 'Lost',
  )
  const pipelineValue = openDeals.reduce(
    (sum, deal) => sum + parseRupiah(deal.amount),
    0,
  )
  const activeCompanies = companies.filter(
    (company) => company.status === 'Active',
  ).length
  const urgentTasks = tasks.filter(
    (task) => getTaskUrgency(task) === 'urgent',
  ).length

  const stats: {
    label: string
    value: string
    hint: string
    icon: typeof Users
    theme: StatTheme
  }[] = [
    {
      label: 'Contacts',
      value: String(contacts.length),
      hint: `Across ${companies.length} companies`,
      icon: Users,
      theme: 'blue',
    },
    {
      label: 'Companies',
      value: String(companies.length),
      hint: `${activeCompanies} active`,
      icon: Building2,
      theme: 'emerald',
    },
    {
      label: 'Deals',
      value: String(deals.length),
      hint: `${formatRupiah(pipelineValue)} open pipeline`,
      icon: DollarSign,
      theme: 'amber',
    },
    {
      label: 'Tasks',
      value: String(tasks.length),
      hint: `${urgentTasks} urgent task${urgentTasks === 1 ? '' : 's'}`,
      icon: CheckSquare,
      theme: 'rose',
    },
  ]

  const upcomingTasks = tasks
    .filter((task) => task.status !== 'Completed')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4)

  const recentActivity = activities.slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-6 py-7 shadow-lg sm:px-8">
        <div className="pointer-events-none absolute -top-16 -right-10 size-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/4 size-56 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative">
          <p className="text-sm font-medium text-blue-300/80">
            {getGreeting()}, {user?.name ?? 'there'} 👋
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Dashboard Overview
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Here is your team&apos;s performance today.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="flex size-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
                <ListChecks className="size-4" />
              </span>
              Upcoming Tasks
            </CardTitle>
            <Link
              to="/tasks"
              className="group flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View All
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            {upcomingTasks.length === 0 && (
              <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border/60 py-10 text-center">
                <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Inbox className="size-5" />
                </span>
                <p className="text-sm text-muted-foreground">
                  Nothing due — you&apos;re all caught up.
                </p>
              </div>
            )}
            {upcomingTasks.map((task) => {
              const urgency = getTaskUrgency(task)
              const styles = URGENCY_STYLES[urgency]
              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-xl border border-transparent bg-muted/40 px-4 py-3 transition-colors hover:border-border/60 hover:bg-muted/70"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn('size-2 shrink-0 rounded-full', styles.dot)}
                    />
                    <div>
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.tag}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'rounded-md border px-3 py-1 text-xs font-medium',
                      styles.badge,
                    )}
                  >
                    {formatDeadline(task.dueDate)}
                  </span>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <ActivityIcon className="size-4" />
              </span>
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {recentActivity.length === 0 && (
              <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border/60 py-10 text-center">
                <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <ActivityIcon className="size-5" />
                </span>
                <p className="text-sm text-muted-foreground">
                  No activity logged yet.
                </p>
              </div>
            )}
            {recentActivity.map((activity) => {
              const style = ACTIVITY_STYLES[activity.type]
              const Icon = style?.icon ?? ActivityIcon
              const company = companyById.get(activity.companyId)
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-full text-white shadow-sm',
                      style?.className ?? 'bg-gradient-to-br from-slate-500 to-slate-600',
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
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
