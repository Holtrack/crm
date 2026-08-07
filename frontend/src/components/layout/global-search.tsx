import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search, Building2, Briefcase } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { AvatarInitial } from '@/components/dashboard/avatar-initial'
import { useContacts } from '@/data/contacts'
import { useCompanies } from '@/data/companies'
import { useDeals } from '@/data/deals'

const MAX_RESULTS_PER_GROUP = 5

export function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const companies = useCompanies()
  const allContacts = useContacts()
  const allDeals = useDeals()

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return { contacts: [], companies: [], deals: [] }

    const contacts = allContacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(term) ||
        contact.company.toLowerCase().includes(term),
    ).slice(0, MAX_RESULTS_PER_GROUP)

    const matchedCompanies = companies.filter(
      (company) =>
        company.name.toLowerCase().includes(term) ||
        company.industry.toLowerCase().includes(term),
    ).slice(0, MAX_RESULTS_PER_GROUP)

    const companyById = new Map(companies.map((company) => [company.id, company]))
    const deals = allDeals.filter(
      (deal) =>
        deal.name.toLowerCase().includes(term) && companyById.has(deal.companyId),
    )
      .map((deal) => ({ deal, company: companyById.get(deal.companyId)! }))
      .slice(0, MAX_RESULTS_PER_GROUP)

    return { contacts, companies: matchedCompanies, deals }
  }, [query, companies, allContacts, allDeals])

  const hasResults =
    results.contacts.length > 0 ||
    results.companies.length > 0 ||
    results.deals.length > 0

  function goTo(path: string, params: Record<string, string>) {
    navigate({ to: path, params })
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setOpen(false)
            event.currentTarget.blur()
          }
        }}
        placeholder="Search contacts, companies, deals..."
        className="pl-9"
      />

      {open && query.trim() && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-lg border bg-white shadow-lg">
          {!hasResults ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              No results for &quot;{query}&quot;
            </p>
          ) : (
            <div className="flex max-h-96 flex-col overflow-y-auto py-2">
              {results.contacts.length > 0 && (
                <div className="flex flex-col">
                  <p className="px-4 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Contacts
                  </p>
                  {results.contacts.map((contact) => (
                    <button
                      key={contact.id}
                      type="button"
                      onClick={() =>
                        goTo('/companies/$contactId', {
                          contactId: contact.id,
                        })
                      }
                      className="flex items-center gap-3 px-4 py-2 text-left hover:bg-muted/50"
                    >
                      <AvatarInitial name={contact.name} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {contact.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {contact.company}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.companies.length > 0 && (
                <div className="flex flex-col">
                  <p className="px-4 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Companies
                  </p>
                  {results.companies.map((company) => (
                    <button
                      key={company.id}
                      type="button"
                      onClick={() =>
                        goTo('/companies/org/$companyId', {
                          companyId: company.id,
                        })
                      }
                      className="flex items-center gap-3 px-4 py-2 text-left hover:bg-muted/50"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
                        <Building2 className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {company.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {company.industry}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.deals.length > 0 && (
                <div className="flex flex-col">
                  <p className="px-4 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Deals
                  </p>
                  {results.deals.map(({ deal, company }) => (
                    <button
                      key={deal.id}
                      type="button"
                      onClick={() =>
                        goTo('/companies/deal/$dealId', { dealId: deal.id })
                      }
                      className="flex items-center gap-3 px-4 py-2 text-left hover:bg-muted/50"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white">
                        <Briefcase className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {deal.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {company.name} • {deal.amount}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
