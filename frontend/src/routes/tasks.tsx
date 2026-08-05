import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/dashboard/placeholder-page'

export const Route = createFileRoute('/tasks')({
  component: () => (
    <PlaceholderPage title="Tasks" description="Track your tasks." />
  ),
})
