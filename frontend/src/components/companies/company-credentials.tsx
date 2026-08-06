import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Pencil } from 'lucide-react'
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

  function save() {
    updateCompanyCredentials(company.id, values)
    setEditing(false)
    router.invalidate()
  }

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Company Credentials</CardTitle>
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
          <>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Industry
              </p>
              <p className="mt-1 text-sm font-medium">{company.industry}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Website
              </p>
              <p className="mt-1 text-sm font-medium">{company.website}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Phone Number
              </p>
              <p className="mt-1 text-sm font-medium">{company.phone}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Address
              </p>
              <p className="mt-1 text-sm font-medium">{company.address}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Team Lead Owner
              </p>
              <p className="mt-1 text-sm font-medium">
                {company.teamLeadOwner}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Lead Source
              </p>
              <p className="mt-1 text-sm font-medium">{company.source}</p>
            </div>
          </>
        )}
      </CardContent>
    </>
  )
}
