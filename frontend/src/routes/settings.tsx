import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/dashboard/placeholder-page'

export const Route = createFileRoute('/settings')({
  component: () => (
    <PlaceholderPage title="Settings" description="Manage your workspace." />
  ),
})
