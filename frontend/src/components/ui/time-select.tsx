import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const START_MINUTES = 7 * 60
const END_MINUTES = 20 * 60
const STEP_MINUTES = 30

const TIME_OPTIONS = Array.from(
  { length: (END_MINUTES - START_MINUTES) / STEP_MINUTES + 1 },
  (_, i) => {
    const totalMinutes = START_MINUTES + i * STEP_MINUTES
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    const value = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
    const period = hours >= 12 ? "PM" : "AM"
    const displayHour = hours % 12 === 0 ? 12 : hours % 12
    const label = `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`
    return { value, label }
  },
)

interface TimeSelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function TimeSelect({
  value,
  onValueChange,
  placeholder = "Select time",
  className,
}: TimeSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className ?? "w-full"}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {TIME_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
