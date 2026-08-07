import { useEffect, useState } from 'react'
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
import { Plus, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DealCard } from '@/components/pipeline/deal-card'
import { PipelineColumn } from '@/components/pipeline/pipeline-column'
import { AddDealDialog } from '@/components/companies/add-deal-dialog'
import { STAGES, getPipelineDeals, type StageKey } from '@/data/pipeline'
import { listDeals, updateDealStatus, type Deal } from '@/data/deals'
import { useCompanies } from '@/data/companies'
import { formatRupiah, parseRupiah } from '@/lib/utils'

export const Route = createFileRoute('/pipeline')({
  component: PipelinePage,
})

function PipelinePage() {
  const companies = useCompanies()
  const [rawDeals, setRawDeals] = useState<Deal[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  function refreshDeals() {
    listDeals().then(setRawDeals).catch(() => {})
  }

  useEffect(() => {
    refreshDeals()
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
  )

  const deals = getPipelineDeals(rawDeals, companies)

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const newStage = over.id as StageKey
    await updateDealStatus(String(active.id), newStage)
    refreshDeals()
  }

  const activeDeal = deals.find((deal) => deal.id === activeId)

  const openDeals = deals.filter(
    (deal) => deal.status !== 'Won' && deal.status !== 'Lost',
  )
  const openValue = openDeals.reduce(
    (sum, deal) => sum + parseRupiah(deal.amount),
    0,
  )
  const wonCount = deals.filter((deal) => deal.status === 'Won').length
  const closedCount = deals.filter(
    (deal) => deal.status === 'Won' || deal.status === 'Lost',
  ).length
  const winRate = closedCount === 0 ? 0 : Math.round((wonCount / closedCount) * 100)

  return (
    <div className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-amber-950 via-slate-900 to-slate-900 px-6 py-7 shadow-lg sm:px-8">
        <div className="pointer-events-none absolute -top-16 -right-10 size-64 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/4 size-56 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-amber-300/80">
              <Sparkles className="size-3.5" />
              {deals.length} {deals.length === 1 ? 'deal' : 'deals'} in motion
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Sales Pipeline
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Drag and drop cards to update deal status instantly.
            </p>
            <div className="mt-4 flex flex-wrap gap-6">
              <div>
                <p className="text-lg font-semibold text-white">
                  {formatRupiah(openValue)}
                </p>
                <p className="text-xs text-white/40">Open pipeline value</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{winRate}%</p>
                <p className="text-xs text-white/40">Win rate</p>
              </div>
            </div>
          </div>
          <AddDealDialog
            onCreated={refreshDeals}
            trigger={
              <Button className="bg-gradient-to-r from-amber-500 to-orange-600 font-medium text-white shadow-lg shadow-amber-600/25 hover:from-amber-400 hover:to-orange-500">
                <Plus className="size-4" />
                New Deal
              </Button>
            }
          />
        </div>
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
