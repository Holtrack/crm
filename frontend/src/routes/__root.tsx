import {
  createRootRoute,
  Outlet,
  redirect,
  useRouterState,
} from '@tanstack/react-router'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { isAuthenticated } from '@/lib/auth'

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    if (!isAuthenticated() && location.pathname !== '/login') {
      throw redirect({ to: '/login' })
    }
  },
  component: RootLayout,
})

function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  if (pathname === '/login') {
    return <Outlet />
  }

  return (
    <div className="flex h-svh bg-muted/40">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
