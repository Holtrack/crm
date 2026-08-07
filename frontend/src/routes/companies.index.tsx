import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Search, Building2, MapPin, Phone, UserRound, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { CompanyStatusSelect } from '@/components/dashboard/company-status-badge'
import { AddCompanyDialog } from '@/components/companies/add-company-dialog'
import { listCompanies, type Company } from '@/data/companies'
import { TEAM_OWNERS } from '@/data/owners'
import { cn, getAvatarGradient } from '@/lib/utils'

export const Route = createFileRoute('/companies/')({
  component: CompaniesPage,
})

function CompaniesPage() {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState<Company[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [ownerFilter, setOwnerFilter] = useState('all')

  useEffect(() => {
    let cancelled = false
    listCompanies()
      .then((result) => {
        if (!cancelled) setCompanies(result)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name
      .toLowerCase()
      .includes(search.trim().toLowerCase())
    const matchesStatus =
      statusFilter === 'all' ||
      company.status.toLowerCase() === statusFilter
    const matchesOwner =
      ownerFilter === 'all' || company.teamLeadOwner === ownerFilter

    return matchesSearch && matchesStatus && matchesOwner
  })

  function handleStatusChanged(companyId: string, status: Company['status']) {
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === companyId ? { ...company, status } : company,
      ),
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 px-6 py-7 shadow-lg sm:px-8">
        <div className="pointer-events-none absolute -top-16 -right-10 size-64 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/4 size-56 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-300/80">
              <Sparkles className="size-3.5" />
              {companies.length} {companies.length === 1 ? 'company' : 'companies'} tracked
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Companies
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Manage your B2B prospects and clients.
            </p>
          </div>
          <AddCompanyDialog />
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter by company name..."
            className="pl-9"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Status: All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="prospect">Prospect</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
          </SelectContent>
        </Select>
        <Select value={ownerFilter} onValueChange={setOwnerFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Owner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Owner: All</SelectItem>
            {TEAM_OWNERS.map((owner) => (
              <SelectItem key={owner} value={owner}>
                Owner: {owner}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredCompanies.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/60 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Building2 className="size-6" />
          </span>
          <p className="text-sm text-muted-foreground">
            No companies match your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCompanies.map((company) => (
            <Card
              key={company.id}
              onClick={() =>
                navigate({
                  to: '/companies/org/$companyId',
                  params: { companyId: company.id },
                })
              }
              className="group h-full cursor-pointer gap-4 border-border/60 py-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-lg"
            >
              <div className="flex items-start justify-between px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={cn(
                      'flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-semibold text-white shadow-md',
                      getAvatarGradient(company.id),
                    )}
                  >
                    {company.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{company.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {company.industry}
                    </p>
                  </div>
                </div>
                <div
                  className="shrink-0"
                  onClick={(event) => event.stopPropagation()}
                >
                  <CompanyStatusSelect
                    companyId={company.id}
                    status={company.status}
                    onChanged={(status) =>
                      handleStatusChanged(company.id, status)
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 border-t border-border/60 px-6 pt-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0" />
                  <span className="truncate">
                    {company.location || 'No location set'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="size-3.5 shrink-0" />
                  <span className="truncate">
                    {company.phone || 'No phone number'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserRound className="size-3.5 shrink-0" />
                  <span className="truncate">{company.teamLeadOwner}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
