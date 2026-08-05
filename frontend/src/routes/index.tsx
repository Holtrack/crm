import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Users,
  Building2,
  DollarSign,
  CheckSquare,
  UserPlus,
  Trophy,
  CirclePlus,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCard } from '@/components/dashboard/stat-card'

export const Route = createFileRoute('/')({
  component: DashboardPage,
})

const STATS = [
  {
    label: 'Contacts',
    value: '120',
    hint: '+12 this week',
    icon: Users,
    iconClassName: 'bg-blue-100 text-blue-600',
  },
  {
    label: 'Companies',
    value: '35',
    hint: '+4 this week',
    icon: Building2,
    iconClassName: 'bg-emerald-100 text-emerald-600',
  },
  {
    label: 'Deals',
    value: '18',
    hint: 'Rp1.2B Pipeline',
    icon: DollarSign,
    iconClassName: 'bg-amber-100 text-amber-600',
  },
  {
    label: 'Tasks',
    value: '8',
    hint: '3 urgent tasks',
    icon: CheckSquare,
    iconClassName: 'bg-rose-100 text-rose-600',
  },
] as const

const UPCOMING_TASKS = [
  {
    title: 'Demo PT Maju Bersama',
    subtitle: 'Product Demo',
    due: 'Tomorrow',
    dotClassName: 'bg-amber-500',
  },
  {
    title: 'Follow Up PT ABC',
    subtitle: 'Proposal Feedback',
    due: 'Today',
    dotClassName: 'bg-rose-500',
  },
] as const

const RECENT_ACTIVITY = [
  {
    icon: UserPlus,
    iconClassName: 'bg-blue-100 text-blue-600',
    text: (
      <>
        <span className="font-medium">Charissa</span> added a new contact{' '}
        <span className="font-medium text-blue-600">Budi Santoso</span>
      </>
    ),
    time: '2 hours ago',
  },
  {
    icon: Trophy,
    iconClassName: 'bg-amber-100 text-amber-600',
    text: (
      <>
        <span className="font-medium">Andi</span> won the deal{' '}
        <span className="font-medium text-blue-600">PT XYZ – Rp 80jt</span>
      </>
    ),
    time: '4 hours ago',
  },
  {
    icon: CirclePlus,
    iconClassName: 'bg-emerald-100 text-emerald-600',
    text: (
      <>
        <span className="font-medium">Charissa</span> created deal{' '}
        <span className="font-medium text-blue-600">PT Maju Bersama</span>
      </>
    ),
    time: 'Yesterday',
  },
] as const

function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back, Charissa. Here is your team's performance today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
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
            {UPCOMING_TASKS.map((task) => (
              <div
                key={task.title}
                className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`size-2 shrink-0 rounded-full ${task.dotClassName}`}
                  />
                  <div>
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.subtitle}
                    </p>
                  </div>
                </div>
                <span className="rounded-md border bg-white px-3 py-1 text-xs font-medium">
                  {task.due}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {RECENT_ACTIVITY.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full ${activity.iconClassName}`}
                >
                  <activity.icon className="size-4" />
                </div>
                <div>
                  <p className="text-sm">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
