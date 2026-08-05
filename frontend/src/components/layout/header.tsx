import { Bell, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6">
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search contacts, companies, deals..."
          className="pl-9"
        />
      </div>

      <div className="flex items-center gap-5">
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
        >
          <Bell className="size-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <p className="text-sm font-medium">Walid</p>
            <p className="text-xs text-muted-foreground">
              Sales Administrator
            </p>
          </div>
          <Avatar>
            <AvatarImage src="" alt="Walid" />
            <AvatarFallback>W</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
