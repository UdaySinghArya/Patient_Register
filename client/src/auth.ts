import { logoutUser, type AuthUser } from './api'

const SESSION_KEY = 'patient-register-session'

export type Session = AuthUser

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Session
    if (!parsed.email || !parsed.role) return null
    return parsed
  } catch {
    return null
  }
}

export function isLoggedIn() {
  return getSession() !== null
}

export function saveSession(user: AuthUser) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
  void logoutUser().catch(() => undefined)
}
