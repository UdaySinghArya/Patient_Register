import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ApiError, getEntry, updateEntry } from '../api'
import { StatusPanel } from '../components/StatusPanel'

type Fields = 'patientName' | 'address' | 'medicines' | 'amount'

export function EditEntry() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    patientName: '',
    address: '',
    medicines: '',
    amount: '',
  })
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Fields | 'server', string>>>({})
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    void getEntry(id)
      .then(({ entry }) => {
        if (cancelled) return
        setForm({
          patientName: entry.patientName,
          address: entry.address,
          medicines: entry.medicines,
          amount: String(entry.amount),
        })
        setLoadError(null)
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err instanceof ApiError ? err.message : 'Could not load this entry.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  function set(field: Fields, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!id) return
    setSaving(true)
    setFieldErrors({})
    try {
      const amountRaw = form.amount.trim()
      await updateEntry(id, {
        patientName: form.patientName,
        address: form.address,
        medicines: form.medicines,
        amount: amountRaw === '' ? Number.NaN : Number(amountRaw),
      })
      navigate('/')
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.errors)
      } else {
        setFieldErrors({ server: 'Could not update this entry. Try again.' })
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <StatusPanel loading />
  if (loadError) return <StatusPanel error={loadError} onRetry={() => window.location.reload()} />

  return (
    <div className="space-y-4 max-w-xl">
      <p className="text-sm text-slate">
        <Link to="/" className="hover:text-teal">
          Today's Register
        </Link>
        <span className="text-muted"> / </span>
        <span className="font-semibold text-teal">Edit entry</span>
      </p>

      <div className="relative overflow-hidden rounded-lg border border-hairline bg-paper p-5 shadow-sm space-y-5">
        <div className="absolute inset-x-0 top-0 h-1 bg-teal" />
        <div>
          <h2 className="text-base font-semibold text-ink">Update patient slip</h2>
          <p className="text-sm text-slate">Change name, address, medicines, or amount. Time stays the same.</p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <Field id="patientName" label="Patient full name" required error={fieldErrors.patientName}>
            <input
              id="patientName"
              className={inputClass(fieldErrors.patientName)}
              value={form.patientName}
              onChange={(e) => set('patientName', e.target.value)}
            />
          </Field>
          <Field id="address" label="Patient address" required error={fieldErrors.address}>
            <input
              id="address"
              className={inputClass(fieldErrors.address)}
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
            />
          </Field>
          <Field id="medicines" label="Medicines dispensed" required error={fieldErrors.medicines}>
            <textarea
              id="medicines"
              rows={3}
              className={`${inputClass(fieldErrors.medicines)} h-auto py-3 resize-y min-h-[88px]`}
              value={form.medicines}
              onChange={(e) => set('medicines', e.target.value)}
            />
          </Field>
          <Field id="amount" label="Amount received" required error={fieldErrors.amount}>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-serif text-xl font-semibold text-teal">
                ₹
              </span>
              <input
                id="amount"
                className={`${inputClass(fieldErrors.amount)} pl-9 font-serif text-xl tabular`}
                value={form.amount}
                onChange={(e) => set('amount', e.target.value)}
                inputMode="decimal"
              />
            </div>
          </Field>
          {fieldErrors.server ? <p className="text-sm font-medium text-alert">{fieldErrors.server}</p> : null}
          <div className="flex items-center gap-3 pt-1">
            <Link
              to="/"
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-line bg-canvas px-5 text-sm font-semibold text-slate hover:bg-hairline"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 inline-flex min-h-12 items-center justify-center rounded-md bg-teal px-5 text-sm font-semibold text-white hover:bg-teal-dark disabled:opacity-60"
            >
              {saving ? 'Updating…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function inputClass(error?: string) {
  return [
    'w-full h-12 rounded-md bg-canvas px-3 text-[15px] text-ink placeholder:text-muted outline-none border',
    error ? 'border-alert' : 'border-transparent focus:border-teal focus:bg-paper',
  ].join(' ')
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
        {required ? <span className="text-alert"> *</span> : null}
      </label>
      {children}
      {error ? <p className="text-xs font-medium text-alert">{error}</p> : null}
    </div>
  )
}
