import { getAuthToken } from '@/lib/auth'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function extractErrorMessage(body: unknown): string | undefined {
  if (!body || typeof body !== 'object') return undefined
  const message = (body as { message?: unknown }).message
  if (Array.isArray(message)) return message.join(', ')
  if (typeof message === 'string') return message
  return undefined
}

interface ApiFetchOptions {
  method?: string
  body?: unknown
  query?: Record<string, string | undefined>
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const url = new URL(path, API_URL)
  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      if (value) url.searchParams.set(key, value)
    }
  }

  const token = getAuthToken()
  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'

  let response: Response
  try {
    response = await fetch(url, {
      method: options.method ?? 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Tidak bisa terhubung ke server. Coba lagi.')
  }

  if (response.status === 204) {
    return undefined as T
  }

  const raw = await response.text()
  const data: unknown = raw ? JSON.parse(raw) : undefined

  if (!response.ok) {
    throw new ApiError(
      response.status,
      extractErrorMessage(data) ?? 'Terjadi kesalahan pada server.',
    )
  }

  return data as T
}
