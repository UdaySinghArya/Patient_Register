export type Entry = {
  id: string
  patientName: string
  address: string
  medicines: string
  amount: number
  createdAt: string
}

export type DayRegister = {
  date: string
  patientCount: number
  totalAmount: number
  lastEntry: { patientName: string; createdAt: string } | null
  entries: Entry[]
}

export type CreateEntryPayload = {
  patientName: string
  address: string
  medicines: string
  amount: number
}

export type CreateEntryResponse = {
  entry: Entry
  today: { date: string; patientCount: number; totalAmount: number }
}

const API_BASE = String(import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  errors: Record<string, string>

  constructor(status: number, errors: Record<string, string>) {
    const message = Object.values(errors)[0] ?? 'Request failed'
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

function apiUrl(path: string) {
  return `${API_BASE}${path}`
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function readErrors(json: unknown, fallback: string): Record<string, string> {
  if (
    isRecord(json) &&
    isRecord(json.errors)
  ) {
    const errors: Record<string, string> = {}
    for (const [key, value] of Object.entries(json.errors)) {
      if (typeof value === 'string') errors[key] = value
    }
    if (Object.keys(errors).length > 0) return errors
  }
  return { server: fallback }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(apiUrl(path), {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
    })
  } catch {
    throw new ApiError(0, {
      server: API_BASE
        ? 'Cannot reach the clinic API. Check that the Render service is awake.'
        : 'Cannot reach the server. Start the API on port 4747 and try again.',
    })
  }

  const contentType = res.headers.get('content-type') ?? ''
  let json: unknown = null
  if (contentType.includes('application/json')) {
    try {
      json = await res.json()
    } catch {
      json = null
    }
  }

  if (!res.ok) {
    throw new ApiError(res.status, readErrors(json, `Request failed (${res.status})`))
  }

  if (!isRecord(json)) {
    throw new ApiError(0, {
      server: API_BASE
        ? 'The clinic API did not return data. Set VITE_API_URL to your Render URL and redeploy.'
        : 'The API did not return data. Is the server running on port 4747?',
    })
  }

  return json as T
}

function isDayRegister(value: unknown): value is DayRegister {
  return isRecord(value) && Array.isArray(value.entries)
}

export async function getEntries(date?: string) {
  const query = date ? `?date=${encodeURIComponent(date)}` : ''
  const data = await request<DayRegister>(`/api/entries${query}`)
  if (!isDayRegister(data)) {
    throw new ApiError(0, { server: 'The clinic API returned an unexpected response.' })
  }
  return data
}

export function createEntry(payload: CreateEntryPayload) {
  return request<CreateEntryResponse>('/api/entries', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export type ClinicUser = {
  email: string
  role: 'Chemist' | 'Doctor'
  name: string
}

export type AuthUser = ClinicUser & { id: string }

export function getClinicDirectory() {
  return request<{ users: ClinicUser[] }>('/api/auth/directory')
}

export function sendOtp(email: string) {
  return request<{ ok: boolean; email: string }>('/api/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export function verifyOtp(email: string, otp: string) {
  return request<{ user: AuthUser }>('/api/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  })
}

export function logoutUser() {
  return request<{ ok: boolean }>('/api/auth/logout', { method: 'POST' })
}
