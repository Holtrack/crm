import type { ContactStatus } from '@/components/dashboard/status-badge'

export interface DealStage {
  title: string
  description: string
  date: string
  done: boolean
}

export interface ContactDetail {
  id: string
  name: string
  title: string
  company: string
  companyId: string
  email: string
  phone: string
  position: string
  owner: string
  status: ContactStatus
  notes: string
  dealStages: DealStage[]
}

export const CONTACTS: ContactDetail[] = [
  {
    id: 'budi-santoso',
    name: 'Budi Santoso',
    title: 'Account Executive at PT Maju Bersama',
    company: 'PT Maju Bersama',
    companyId: 'pt-maju-bersama',
    email: 'budi.santoso@majubersama.com',
    phone: '08123456789',
    position: 'Head of Procurement',
    owner: 'Andi',
    status: 'Active',
    notes:
      '"Budi seems highly interested in integrating the ERP system next quarter. Prefers communications via Whatsapp. Andi scheduled to demo the product on Thursday."',
    dealStages: [
      {
        title: 'Call Completed',
        description: 'Introductory phone call to understand server needs',
        date: 'Oct 10, 2023',
        done: true,
      },
      {
        title: 'Product Demo Scheduled',
        description: 'Walkthrough of Holtrack feature set',
        date: 'Oct 14, 2023',
        done: true,
      },
      {
        title: 'Proposal Sent',
        description: 'Custom Rp500 million solution draft',
        date: 'Oct 18, 2023',
        done: true,
      },
      {
        title: 'Negotiation',
        description: 'Discussions on annual licensing terms',
        date: 'Pending',
        done: false,
      },
    ],
  },
  {
    id: 'andi-wijaya',
    name: 'Andi Wijaya',
    title: 'Chief Technical Officer at PT Maju Bersama',
    company: 'PT Maju Bersama',
    companyId: 'pt-maju-bersama',
    email: 'andi.wijaya@majubersama.co.id',
    phone: '08112233445',
    position: 'Chief Technical Officer',
    owner: 'Andi',
    status: 'Active',
    notes:
      '"Andi is the technical champion for the ERP deal and is coordinating the infrastructure review with his team."',
    dealStages: [
      {
        title: 'Call Completed',
        description: 'Introductory phone call to understand server needs',
        date: 'Oct 10, 2023',
        done: true,
      },
      {
        title: 'Product Demo Scheduled',
        description: 'Walkthrough of Holtrack feature set',
        date: 'Oct 14, 2023',
        done: true,
      },
      {
        title: 'Proposal Sent',
        description: 'Custom Rp500 million solution draft',
        date: 'Oct 18, 2023',
        done: true,
      },
      {
        title: 'Negotiation',
        description: 'Discussions on annual licensing terms',
        date: 'Pending',
        done: false,
      },
    ],
  },
  {
    id: 'sarah-wijaya',
    name: 'Sarah Wijaya',
    title: 'Procurement Lead at PT Sejahtera',
    company: 'PT Sejahtera',
    companyId: 'pt-sejahtera',
    email: 'sarah.wijaya@sejahtera.co.id',
    phone: '08111111111',
    position: 'Procurement Lead',
    owner: 'Rina',
    status: 'Prospect',
    notes:
      '"Sarah is comparing vendors and wants a formal proposal before the end of the month."',
    dealStages: [
      {
        title: 'Call Completed',
        description: 'Discovery call on current pain points',
        date: 'Nov 2, 2023',
        done: true,
      },
      {
        title: 'Product Demo Scheduled',
        description: 'Demo focused on reporting features',
        date: 'Pending',
        done: false,
      },
      {
        title: 'Proposal Sent',
        description: 'Awaiting requirements confirmation',
        date: 'Pending',
        done: false,
      },
      {
        title: 'Negotiation',
        description: 'Not started',
        date: 'Pending',
        done: false,
      },
    ],
  },
  {
    id: 'ahmad-fauzi',
    name: 'Ahmad Fauzi',
    title: 'Operations Manager at PT Nusantara',
    company: 'PT Nusantara',
    companyId: 'pt-nusantara',
    email: 'ahmad.fauzi@nusantara.co.id',
    phone: '08222222222',
    position: 'Operations Manager',
    owner: 'Dimas',
    status: 'Customer',
    notes:
      '"Long-term customer, renewed contract for another year. Happy with onboarding support."',
    dealStages: [
      {
        title: 'Call Completed',
        description: 'Renewal discussion',
        date: 'Sep 20, 2023',
        done: true,
      },
      {
        title: 'Product Demo Scheduled',
        description: 'New feature walkthrough',
        date: 'Sep 25, 2023',
        done: true,
      },
      {
        title: 'Proposal Sent',
        description: 'Renewal contract sent',
        date: 'Sep 28, 2023',
        done: true,
      },
      {
        title: 'Negotiation',
        description: 'Signed renewal terms',
        date: 'Oct 2, 2023',
        done: true,
      },
    ],
  },
]

export function getContactById(id: string) {
  return CONTACTS.find((contact) => contact.id === id)
}
