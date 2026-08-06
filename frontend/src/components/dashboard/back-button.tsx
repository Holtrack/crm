import { useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function BackButton() {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-fit text-muted-foreground hover:text-foreground"
      onClick={() => router.history.back()}
    >
      <ArrowLeft className="size-4" />
      Back
    </Button>
  )
}
