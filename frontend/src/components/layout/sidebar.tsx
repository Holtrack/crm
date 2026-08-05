import { Link, useRouterState } from '@tanstack/react-router'
import {
  LayoutGrid,
  Building2,
  Users,
  GitBranch,
  CheckSquare,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/', icon: LayoutGrid },
  { label: 'Companies', to: '/companies', icon: Building2 },
  { label: 'Contacts', to: '/contacts', icon: Users },
  { label: 'Pipeline', to: '/pipeline', icon: GitBranch },
  { label: 'Tasks', to: '/tasks', icon: CheckSquare },
  { label: 'Settings', to: '/settings', icon: Settings },
] as const

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <aside className="flex h-svh w-60 shrink-0 flex-col bg-[#0b0f1a] text-slate-300">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
          <LayoutGrid className="size-4" />
        </div>
        <span className="text-sm font-semibold text-white">CRM Holtrack</span>
      </div>

      <nav className="flex flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => {
          const active =
            to === '/' ? pathname === '/' : pathname.startsWith(to)
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200',
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto px-5 py-5">
        <div className="rounded-lg bg-slate-800/60 px-3 py-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            Team Space
          </p>
          <p className="mt-1 text-sm font-medium text-white">
            Indonesia B2B Sales
          </p>
        </div>
      </div>
    </aside>
  )
}
