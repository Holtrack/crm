import { Bell, LogOut } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { GlobalSearch } from '@/components/layout/global-search'
import { getCurrentUser, logout } from '@/lib/auth'

export function Header() {
  const navigate = useNavigate()
  const user = getCurrentUser()

  function handleLogout() {
    logout()
    navigate({ to: '/login' })
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6">
      <GlobalSearch />

      <div className="flex items-center gap-5">
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
        >
          <Bell className="size-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <p className="text-sm font-medium">{user?.name ?? 'Guest'}</p>
            <p className="text-xs text-muted-foreground">
              {user?.role ?? ''}
            </p>
          </div>
          <Avatar>
            <AvatarImage src="" alt={user?.name ?? 'Guest'} />
            <AvatarFallback>{(user?.name ?? 'G').charAt(0)}</AvatarFallback>
          </Avatar>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </header>
  )
}
