import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export type StatTheme = 'blue' | 'emerald' | 'amber' | 'rose'

interface StatCardProps {
  label: string
  value: string
  hint: string
  icon: LucideIcon
  theme: StatTheme
}

const THEME_STYLES: Record<
  StatTheme,
  { icon: string; glow: string; ring: string }
> = {
  blue: {
    icon: 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30',
    glow: 'from-blue-500/15',
    ring: 'hover:ring-blue-500/15',
  },
  emerald: {
    icon: 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/30',
    glow: 'from-emerald-500/15',
    ring: 'hover:ring-emerald-500/15',
  },
  amber: {
    icon: 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-500/30',
    glow: 'from-amber-500/15',
    ring: 'hover:ring-amber-500/15',
  },
  rose: {
    icon: 'bg-gradient-to-br from-rose-500 to-rose-600 shadow-rose-500/30',
    glow: 'from-rose-500/15',
    ring: 'hover:ring-rose-500/15',
  },
}

export function StatCard({ label, value, hint, icon: Icon, theme }: StatCardProps) {
  const styles = THEME_STYLES[theme]

  return (
    <Card
      className={cn(
        'group relative overflow-hidden border-border/60 py-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:ring-1',
        styles.ring,
      )}
    >
      <div
        className={cn(
          'pointer-events-none absolute -top-12 -right-12 size-36 rounded-full bg-gradient-to-br to-transparent opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100',
          styles.glow,
        )}
      />
      <CardContent className="relative flex items-start gap-4">
        <div
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-lg',
            styles.icon,
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1.5 text-3xl font-semibold tracking-tight">
            {value}
          </p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {hint}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
