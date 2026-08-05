import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseRupiah(amount: string): number {
  const digits = amount.replace(/[^0-9]/g, '')
  return digits ? Number(digits) : 0
}

export function formatRupiah(amount: number): string {
  return `Rp${amount.toLocaleString('id-ID')}`
}
