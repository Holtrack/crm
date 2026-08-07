import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import {
  Pencil,
  IdCard,
  Globe,
  Phone,
  MapPin,
  UserRound,
  Tag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SOURCES } from '@/components/companies/edit-company-dialog'
import { TEAM_OWNERS } from '@/data/owners'
import { updateCompanyCredentials, type Company } from '@/data/companies'

interface CompanyCredentialsProps {
  company: Company
}

function credentialsFrom(company: Company) {
  return {
    industry: company.industry,
    website: company.website,
    phone: company.phone,
    address: company.address,
    teamLeadOwner: company.teamLeadOwner,
    source: company.source,
  }
}

export function CompanyCredentials({ company }: CompanyCredentialsProps) {
  const [editing, setEditing] = useState(false)
  const [values, setValues] = useState(() => credentialsFrom(company))
  const router = useRouter()

  function startEditing() {
    setValues(credentialsFrom(company))
    setEditing(true)
  }

  function cancel() {
    setValues(credentialsFrom(company))
    setEditing(false)
  }

  async function save() {
    await updateCompanyCredentials(company.id, values)
    setEditing(false)
    router.invalidate()
  }

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <IdCard className="size-4" />
          </span>
          Company Credentials
        </CardTitle>
        {!editing && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-foreground"
            aria-label="Edit company credentials"
            onClick={startEditing}
          >
            <Pencil className="size-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {editing ? (
          <>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Industry
              </p>
              <Input
                className="mt-1"
                value={values.industry}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, industry: event.target.value }))
                }
              />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Website
              </p>
              <Input
                className="mt-1"
                value={values.website}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, website: event.target.value }))
                }
              />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Phone Number
              </p>
              <Input
                className="mt-1"
                value={values.phone}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, phone: event.target.value }))
                }
              />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Address
              </p>
              <Input
                className="mt-1"
                value={values.address}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, address: event.target.value }))
                }
              />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Team Lead Owner
              </p>
              <Select
                value={values.teamLeadOwner}
                onValueChange={(value) =>
                  setValues((prev) => ({ ...prev, teamLeadOwner: value }))
                }
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  {TEAM_OWNERS.map((owner) => (
                    <SelectItem key={owner} value={owner}>
                      {owner}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Lead Source
              </p>
              <Select
                value={values.source}
                onValueChange={(value) =>
                  setValues((prev) => ({
                    ...prev,
                    source: value as Company['source'],
                  }))
                }
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {SOURCES.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={cancel}>
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-600/90"
                onClick={save}
              >
                Save
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col divide-y divide-border/60">
            {[
              { icon: IdCard, label: 'Industry', value: company.industry },
              { icon: Globe, label: 'Website', value: company.website },
              { icon: Phone, label: 'Phone Number', value: company.phone },
              { icon: MapPin, label: 'Address', value: company.address },
              {
                icon: UserRound,
                label: 'Team Lead Owner',
                value: company.teamLeadOwner,
              },
              { icon: Tag, label: 'Lead Source', value: company.source },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="truncate text-sm font-medium">
                    {value || '—'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </>
  )
}
