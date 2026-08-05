export interface AuthUser {
  name: string
  email: string
  role: string
}

const VALID_CREDENTIALS = {
  email: 'admin@holtrack.com',
  password: 'holtrack2026',
}

const VALID_USER: AuthUser = {
  name: 'Charissa',
  email: 'admin@holtrack.com',
  role: 'Sales Administrator',
}

const STORAGE_KEY = 'crm-holtrack-auth'

export function login(email: string, password: string): boolean {
  const isValid =
    email.trim().toLowerCase() === VALID_CREDENTIALS.email &&
    password === VALID_CREDENTIALS.password

  if (!isValid) return false

  localStorage.setItem(STORAGE_KEY, JSON.stringify(VALID_USER))
  return true
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY)
}

export function getCurrentUser(): AuthUser | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}
