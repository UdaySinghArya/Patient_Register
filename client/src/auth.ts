const SESSION_KEY = 'patient-register-session'
export const STATIC_PIN = '0000'

export const STATIC_USERS = [
  { phone: '9876543210', role: 'Chemist', label: 'Chemist desk' },
  { phone: '9123456780', role: 'Doctor', label: 'Doctor' },
] as const

export type Session = {
  phone: string
  role: (typeof STATIC_USERS)[number]['role']
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Session
    if (!STATIC_USERS.some((u) => u.phone === parsed.phone && u.role === parsed.role)) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function isLoggedIn() {
  return getSession() !== null
}

export function login(phone: string, pin: string): { ok: true } | { ok: false; error: string } {
  const cleaned = digitsOnly(phone)
  const user = STATIC_USERS.find((u) => u.phone === cleaned)

  if (cleaned.length !== 10) {
    return { ok: false, error: 'Enter a 10-digit mobile number' }
  }
  if (!user) {
    return { ok: false, error: 'This number is not on the clinic list' }
  }
  if (pin !== STATIC_PIN) {
    return { ok: false, error: 'PIN must be 0000' }
  }

  const session: Session = { phone: user.phone, role: user.role }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return { ok: true }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}
