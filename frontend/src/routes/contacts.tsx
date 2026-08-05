import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/dashboard/placeholder-page'

export const Route = createFileRoute('/contacts')({
  component: () => (
    <PlaceholderPage title="Contacts" description="Manage your contacts." />
  ),
})
