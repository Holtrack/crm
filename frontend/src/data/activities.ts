export type ActivityType =
  | 'WhatsApp'
  | 'Call'
  | 'Email'
  | 'Demo'
  | 'Follow Up'
  | 'Meeting'

export interface ActivityParticipant {
  contactId: string
  name: string
}

export interface Activity {
  id: string
  companyId: string
  title: string
  context: string
  type: ActivityType
  datetime: string
  participants: ActivityParticipant[]
  summary: string
}

export const ACTIVITIES: Activity[] = []

export function getActivityById(id: string) {
  return ACTIVITIES.find((activity) => activity.id === id)
}

export function getActivitiesByCompanyId(companyId: string) {
  return ACTIVITIES.filter((activity) => activity.companyId === companyId)
}

export interface NewActivityInput {
  companyId: string
  title: string
  context: string
  type: ActivityType
  date: string
  time: string
  participantIds: string[]
  summary: string
}

function formatDateTime(date: string, time: string) {
  const parsed = new Date(`${date}T${time}`)
  if (Number.isNaN(parsed.getTime())) return `${date} ${time}`
  const datePart = parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  const timePart = parsed.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  return `${datePart}, ${timePart}`
}

export function addActivity(
  input: NewActivityInput,
  contactsById: Map<string, string>,
): Activity {
  const id = `act-${input.companyId}-${ACTIVITIES.length + 1}`

  const activity: Activity = {
    id,
    companyId: input.companyId,
    title: input.title,
    context: input.context,
    type: input.type,
    datetime: formatDateTime(input.date, input.time),
    participants: input.participantIds.map((contactId) => ({
      contactId,
      name: contactsById.get(contactId) ?? contactId,
    })),
    summary: input.summary,
  }

  ACTIVITIES.push(activity)
  return activity
}

export interface EditActivityInput {
  title: string
  context: string
  type: ActivityType
  datetime: string
  participantIds: string[]
  summary: string
}

export function updateActivity(
  id: string,
  input: EditActivityInput,
  contactsById: Map<string, string>,
): Activity {
  const activity = getActivityById(id)
  if (!activity) {
    throw new Error(`Activity not found: ${id}`)
  }

  activity.title = input.title
  activity.context = input.context
  activity.type = input.type
  activity.datetime = input.datetime
  activity.participants = input.participantIds.map((contactId) => ({
    contactId,
    name: contactsById.get(contactId) ?? contactId,
  }))
  activity.summary = input.summary

  return activity
}
