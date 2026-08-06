import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Search, Building2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CompanyStatusSelect } from '@/components/dashboard/company-status-badge'
import { AddCompanyDialog } from '@/components/companies/add-company-dialog'
import { COMPANIES } from '@/data/companies'
import { TEAM_OWNERS } from '@/data/owners'

export const Route = createFileRoute('/companies/')({
  component: CompaniesPage,
})

function CompaniesPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [ownerFilter, setOwnerFilter] = useState('all')
  const [, forceRefresh] = useState(0)

  const filteredCompanies = COMPANIES.filter((company) => {
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Companies</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your B2B prospects and clients.
          </p>
        </div>
        <div className="flex gap-2">
          <AddCompanyDialog />
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
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

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Team Lead Owner</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-6 text-center text-sm text-muted-foreground"
                >
                  No companies match your filters.
                </TableCell>
              </TableRow>
            )}
            {filteredCompanies.map((company) => (
              <TableRow key={company.id} className="cursor-pointer">
                <TableCell className="p-0">
                  <Link
                    to="/companies/org/$companyId"
                    params={{ companyId: company.id }}
                    className="flex items-center gap-3 px-2 py-2"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
                      <Building2 className="size-4" />
                    </span>
                    <span className="font-medium">{company.name}</span>
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {company.industry}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {company.location}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {company.phone}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {company.teamLeadOwner}
                </TableCell>
                <TableCell>
                  <CompanyStatusSelect
                    companyId={company.id}
                    status={company.status}
                    onChanged={() => forceRefresh((tick) => tick + 1)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
