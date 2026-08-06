import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DealCard } from '@/components/pipeline/deal-card'
import { PipelineColumn } from '@/components/pipeline/pipeline-column'
import { AddDealDialog } from '@/components/companies/add-deal-dialog'
import { STAGES, getPipelineDeals, type StageKey } from '@/data/pipeline'
import { updateDealStatus } from '@/data/companies'

export const Route = createFileRoute('/pipeline')({
  component: PipelinePage,
})

function PipelinePage() {
  const [deals, setDeals] = useState(getPipelineDeals)
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const newStage = over.id as StageKey
    updateDealStatus(String(active.id), newStage)
    setDeals(getPipelineDeals())
  }

  const activeDeal = deals.find((deal) => deal.id === activeId)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Sales Pipeline
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag and drop cards to update deal status instantly.
          </p>
        </div>
        <AddDealDialog
          onCreated={() => setDeals(getPipelineDeals())}
          trigger={
            <Button className="bg-blue-600 hover:bg-blue-600/90">
              <Plus className="size-4" />
              New Deal
            </Button>
          }
        />
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => (
            <PipelineColumn
              key={stage.key}
              stageKey={stage.key}
              label={stage.label}
              deals={deals.filter((deal) => deal.status === stage.key)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeDeal ? <DealCard deal={activeDeal} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
