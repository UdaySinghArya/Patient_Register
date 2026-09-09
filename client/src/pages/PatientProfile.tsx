import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ApiError, getEntry, type Entry } from '../api'
import { StatusPanel } from '../components/StatusPanel'
import { formatLongDateIST, formatRupees, formatTimeIST } from '../lib/format'

function formatDateTimeIST(iso: string) {
  const datePart = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(iso))
  return `${formatLongDateIST(datePart)} · ${formatTimeIST(iso)}`
}

export function PatientProfile() {
  const { id } = useParams()
  const [entry, setEntry] = useState<Entry | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    void getEntry(id)
      .then(({ entry: row }) => {
        if (!cancelled) {
          setEntry(row)
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Could not load this patient.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) return <StatusPanel loading />
  if (error || !entry) {
    return <StatusPanel error={error ?? 'Patient not found'} onRetry={() => window.location.reload()} />
  }

  const fields = [
    { label: 'Patient name', value: entry.patientName },
    { label: 'Address', value: entry.address },
    { label: 'Medicines dispensed', value: entry.medicines },
    { label: 'Amount', value: `₹${formatRupees(entry.amount)}` },
    { label: 'Dispensed at', value: formatDateTimeIST(entry.createdAt) },
    { label: 'Status', value: 'Dispensed' },
  ]

  return (
    <div className="space-y-4 max-w-xl">
      <p className="text-sm text-slate">
        <Link to="/" className="hover:text-teal">
          Today's Register
        </Link>
        <span className="text-muted"> / </span>
        <span className="font-semibold text-teal">Patient profile</span>
      </p>

      <div className="relative overflow-hidden rounded-lg border border-hairline bg-paper p-5 shadow-sm space-y-5">
        <div className="absolute inset-x-0 top-0 h-1 bg-teal" />
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Patient profile</p>
            <h2 className="font-serif text-2xl font-semibold text-ink mt-1">{entry.patientName}</h2>
            <p className="text-sm text-slate mt-1">Read-only slip for the doctor</p>
          </div>
          <span className="rounded bg-sage px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-teal-ink">
            Dispensed
          </span>
        </div>

        <dl className="space-y-3">
          {fields.map((field) => (
            <div key={field.label} className="rounded-md bg-canvas px-3 py-3">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">{field.label}</dt>
              <dd className="mt-1 text-[15px] text-ink whitespace-pre-wrap">{field.value}</dd>
            </div>
          ))}
        </dl>

        <Link
          to="/"
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-line bg-canvas px-4 text-sm font-semibold text-slate hover:bg-hairline"
        >
          Back to register
        </Link>
      </div>
    </div>
  )
}
