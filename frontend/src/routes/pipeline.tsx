import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/dashboard/placeholder-page'

export const Route = createFileRoute('/pipeline')({
  component: () => (
    <PlaceholderPage title="Pipeline" description="Track your deals." />
  ),
})
