export function AvatarInitial({ name }: { name: string }) {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
      {name.charAt(0).toUpperCase()}
    </span>
  )
}
