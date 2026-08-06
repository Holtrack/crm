import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Check, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/date-picker'
import { TimeSelect } from '@/components/ui/time-select'
import { updateDealStages } from '@/data/companies'
import { formatDateTime } from '@/data/activities'
import { cn } from '@/lib/utils'
import type { DealStage } from '@/data/contacts'

const BLANK_STAGE: DealStage = {
  title: '',
  description: '',
  date: '',
  done: false,
}

interface DealStageListProps {
  companyId: string
  stages: DealStage[]
}

export function DealStageList({ companyId, stages }: DealStageListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [draft, setDraft] = useState<DealStage>(BLANK_STAGE)
  const router = useRouter()

  function startEditing(index: number) {
    setDraft(stages[index])
    setEditingIndex(index)
  }

  function startAdding() {
    setDraft(BLANK_STAGE)
    setEditingIndex(stages.length)
  }

  function cancel() {
    setEditingIndex(null)
    setDraft(BLANK_STAGE)
  }

  function save() {
    if (editingIndex === null || !draft.title.trim()) return
    const next = [...stages]
    next[editingIndex] = draft
    updateDealStages(companyId, next)
    setEditingIndex(null)
    router.invalidate()
  }

  function remove(index: number) {
    const next = stages.filter((_, i) => i !== index)
    updateDealStages(companyId, next)
    setEditingIndex(null)
    router.invalidate()
  }

  if (stages.length === 0 && editingIndex === null) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">No stages logged yet.</p>
        <Button
          type="button"
          variant="outline"
          className="border-dashed"
          onClick={startAdding}
        >
          <Plus className="size-4" />
          Add Stage
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {stages.map((stage, index) =>
        editingIndex === index ? (
          <StageEditRow
            key={index}
            draft={draft}
            setDraft={setDraft}
            onSave={save}
            onCancel={cancel}
            onDelete={() => remove(index)}
          />
        ) : (
          <button
            key={index}
            type="button"
            onClick={() => startEditing(index)}
            className="-mx-2 flex items-start gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-muted/50"
          >
            <span
              className={cn(
                'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full',
                stage.done
                  ? 'bg-emerald-500 text-white'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              <Check className="size-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium">{stage.title}</p>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {stage.date}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {stage.description}
              </p>
            </div>
          </button>
        ),
      )}

      {editingIndex === stages.length ? (
        <StageEditRow
          draft={draft}
          setDraft={setDraft}
          onSave={save}
          onCancel={cancel}
        />
      ) : (
        <Button
          type="button"
          variant="outline"
          className="border-dashed"
          onClick={startAdding}
        >
          <Plus className="size-4" />
          Add Stage
        </Button>
      )}
    </div>
  )
}

interface StageEditRowProps {
  draft: DealStage
  setDraft: (updater: (prev: DealStage) => DealStage) => void
  onSave: () => void
  onCancel: () => void
  onDelete?: () => void
}

function StageEditRow({
  draft,
  setDraft,
  onSave,
  onCancel,
  onDelete,
}: StageEditRowProps) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  function applyDate(next: string) {
    setDate(next)
    setDraft((prev) => ({ ...prev, date: formatDateTime(next, time || '00:00') }))
  }

  function applyTime(next: string) {
    setTime(next)
    if (date) {
      setDraft((prev) => ({ ...prev, date: formatDateTime(date, next) }))
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-3">
      <Input
        placeholder="Stage title"
        value={draft.title}
        onChange={(event) =>
          setDraft((prev) => ({ ...prev, title: event.target.value }))
        }
      />
      <div className="grid grid-cols-2 gap-3">
        <DatePicker value={date} onChange={applyDate} placeholder="Pick a date" />
        <TimeSelect
          value={time}
          onValueChange={applyTime}
          placeholder="Select time"
        />
      </div>
      <Input
        placeholder="Description"
        value={draft.description}
        onChange={(event) =>
          setDraft((prev) => ({ ...prev, description: event.target.value }))
        }
      />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={draft.done}
            onCheckedChange={(checked) =>
              setDraft((prev) => ({ ...prev, done: checked === true }))
            }
          />
          Completed
        </label>
        <div className="flex gap-2">
          {onDelete && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              aria-label="Remove stage"
              onClick={onDelete}
            >
              <Trash2 className="size-4" />
            </Button>
          )}
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-blue-600 hover:bg-blue-600/90"
            onClick={onSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
