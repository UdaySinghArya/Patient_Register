import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError, createEntry } from '../api'

type Fields = 'patientName' | 'address' | 'medicines' | 'amount'

const EMPTY = {
  patientName: '',
  address: '',
  medicines: '',
  amount: '',
}

export function NewEntry() {
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Fields | 'server', string>>>({})
  const [saving, setSaving] = useState(false)

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
    setSaving(true)
    setFieldErrors({})
    try {
      const amountRaw = form.amount.trim()
      await createEntry({
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
        setFieldErrors({ server: 'Could not save this entry. Try again.' })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4 max-w-xl">
      <div>
        <p className="text-sm text-slate">
          <Link to="/" className="hover:text-teal">
            Today's Register
          </Link>
          <span className="text-muted"> / </span>
          <span className="font-semibold text-teal">New entry</span>
        </p>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-hairline bg-paper p-5 shadow-sm space-y-5">
        <div className="absolute inset-x-0 top-0 h-1 bg-teal" />
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-sage font-serif text-xl font-semibold text-teal">
            Rx
          </div>
          <div>
            <h2 className="text-base font-semibold text-ink">Dispensing slip</h2>
            <p className="text-sm text-slate">Record what was handed to the patient, then save to today's ledger.</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <Field
            id="patientName"
            label="Patient full name"
            required
            error={fieldErrors.patientName}
          >
            <input
              id="patientName"
              className={inputClass(fieldErrors.patientName)}
              value={form.patientName}
              onChange={(e) => set('patientName', e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              autoComplete="name"
            />
          </Field>

          <Field id="address" label="Patient address" required error={fieldErrors.address}>
            <input
              id="address"
              className={inputClass(fieldErrors.address)}
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              placeholder="e.g. Ward 2 lane, Near bus stand"
              autoComplete="street-address"
            />
          </Field>

          <Field
            id="medicines"
            label="Medicines dispensed"
            required
            error={fieldErrors.medicines}
            hint="Enter names exactly as written on the doctor's slip."
          >
            <textarea
              id="medicines"
              rows={3}
              className={`${inputClass(fieldErrors.medicines)} h-auto py-3 resize-y min-h-[88px]`}
              value={form.medicines}
              onChange={(e) => set('medicines', e.target.value)}
              placeholder="e.g. Paracetamol 500 (10 tab), ORS (2 pkt), Amoxicillin 250 (6 cap)"
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
                placeholder="180"
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
              {saving ? 'Saving…' : 'Save to register'}
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
  hint,
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  hint?: string
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
      {hint && !error ? <p className="text-xs text-slate italic">{hint}</p> : null}
    </div>
  )
}
