import { cn, getAvatarGradient } from '@/lib/utils'

export function AvatarInitial({ name }: { name: string }) {
  return (
    <span
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white shadow-sm',
        getAvatarGradient(name),
      )}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  )
}
