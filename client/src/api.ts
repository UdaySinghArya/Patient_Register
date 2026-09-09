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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(path, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
    })
  } catch {
    throw new ApiError(0, {
      server: 'Cannot reach the server. Start the API on port 4747 and try again.',
    })
  }

  let json: unknown = null
  try {
    json = await res.json()
  } catch {
    json = null
  }

  if (!res.ok) {
    const errors =
      json &&
      typeof json === 'object' &&
      json !== null &&
      'errors' in json &&
      typeof (json as { errors: unknown }).errors === 'object' &&
      (json as { errors: unknown }).errors !== null
        ? ((json as { errors: Record<string, string> }).errors)
        : { server: `Request failed (${res.status})` }
    throw new ApiError(res.status, errors)
  }

  return json as T
}

export function getEntries(date?: string) {
  const query = date ? `?date=${encodeURIComponent(date)}` : ''
  return request<DayRegister>(`/api/entries${query}`)
}

export function createEntry(payload: CreateEntryPayload) {
  return request<CreateEntryResponse>('/api/entries', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
