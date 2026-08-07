export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

interface StoredAuth {
  token: string
  user: AuthUser
}

interface LoginResponse {
  accessToken: string
  user: AuthUser
}

const STORAGE_KEY = 'crm-holtrack-auth'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export class LoginError extends Error {}

function extractErrorMessage(body: unknown): string | undefined {
  if (!body || typeof body !== 'object') return undefined
  const message = (body as { message?: unknown }).message
  if (Array.isArray(message)) return message.join(', ')
  if (typeof message === 'string') return message
  return undefined
}

export async function login(email: string, password: string): Promise<void> {
  let response: Response
  try {
    response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
  } catch {
    throw new LoginError('Tidak bisa terhubung ke server. Coba lagi.')
  }

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null)
    throw new LoginError(
      extractErrorMessage(body) ?? 'Email atau password salah.',
    )
  }

  const data = (await response.json()) as LoginResponse
  const stored: StoredAuth = { token: data.accessToken, user: data.user }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY)
}

function getStoredAuth(): StoredAuth | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as StoredAuth
  } catch {
    return null
  }
}

export function getCurrentUser(): AuthUser | null {
  return getStoredAuth()?.user ?? null
}

export function getAuthToken(): string | null {
  return getStoredAuth()?.token ?? null
}

export function isAuthenticated(): boolean {
  return getStoredAuth() !== null
}
