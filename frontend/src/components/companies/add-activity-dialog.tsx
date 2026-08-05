import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { addActivity } from '@/data/activities'
import type { CompanyContact } from '@/data/companies'

export const ACTIVITY_TYPES = ['Meeting', 'Call', 'Email', 'Demo', 'Follow Up', 'Note'] as const

const formSchema = z.object({
  title: z.string().trim().min(3, 'Title is required'),
  context: z.string().trim().min(3, 'Context is required'),
  type: z.enum(ACTIVITY_TYPES),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  participantIds: z.array(z.string()).min(1, 'Select at least one participant'),
  summary: z.string().trim().min(5, 'Summary is required'),
})

type FormValues = z.infer<typeof formSchema>

interface AddActivityDialogProps {
  companyId: string
  contacts: CompanyContact[]
}

export function AddActivityDialog({
  companyId,
  contacts,
}: AddActivityDialogProps) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      context: '',
      type: 'Meeting',
      date: '',
      time: '',
      participantIds: [],
      summary: '',
    },
  })

  function onSubmit(values: FormValues) {
    const contactsById = new Map(
      contacts.map((contact) => [contact.contactId, contact.name]),
    )
    const activity = addActivity({ ...values, companyId }, contactsById)
    setOpen(false)
    form.reset()
    navigate({
      to: '/companies/activity/$activityId',
      params: { activityId: activity.id },
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) form.reset()
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-600/90">
          <Plus className="size-4" />
          Add Activity
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Activity</DialogTitle>
          <DialogDescription>
            Log a client touch point for this company.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Follow-up and Proposal Review Meeting"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Context</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="B2B Client Consultation • Indonesian Market"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ACTIVITY_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="participantIds"
              render={() => (
                <FormItem>
                  <FormLabel>Participants</FormLabel>
                  {contacts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      This company has no contacts yet.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2 rounded-lg border p-3">
                      {contacts.map((contact) => (
                        <FormField
                          key={contact.contactId}
                          control={form.control}
                          name="participantIds"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center gap-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(
                                    contact.contactId,
                                  )}
                                  onCheckedChange={(checked) => {
                                    field.onChange(
                                      checked
                                        ? [...field.value, contact.contactId]
                                        : field.value.filter(
                                            (id) => id !== contact.contactId,
                                          ),
                                    )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {contact.name}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What happened during this activity?"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-600/90">
                Log Activity
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
