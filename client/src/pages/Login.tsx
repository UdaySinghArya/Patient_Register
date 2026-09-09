import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ApiError, getClinicDirectory, sendOtp, verifyOtp, type ClinicUser } from '../api'
import { isLoggedIn, saveSession } from '../auth'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [directory, setDirectory] = useState<ClinicUser[]>([])

  useEffect(() => {
    void getClinicDirectory()
      .then((data) => setDirectory(data.users))
      .catch(() => setDirectory([]))
  }, [])

  if (isLoggedIn()) {
    return <Navigate to="/" replace />
  }

  async function onSendOtp(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await sendOtp(email)
      setStep('otp')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send OTP. Try again.')
    } finally {
      setSaving(false)
    }
  }

  async function onVerify(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const { user } = await verifyOtp(email, otp)
      saveSession(user)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not verify OTP. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-dvh bg-canvas flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal font-semibold text-white">
            PR
          </span>
          <h1 className="font-serif text-3xl font-semibold text-ink">Patient Register</h1>
          <p className="text-sm text-slate">Clinic Pharmacy Ledger · sign in with email OTP</p>
        </div>

        <div className="relative overflow-hidden rounded-lg border border-hairline bg-paper p-5 shadow-sm space-y-4">
          <div className="absolute inset-x-0 top-0 h-1 bg-teal" />
          {step === 'email' ? (
            <form className="space-y-4" onSubmit={onSendOtp}>
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-semibold text-ink">
                  Clinic email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="w-full h-12 rounded-md border border-line bg-canvas px-3 text-[15px] text-ink outline-none focus:border-teal focus:bg-paper"
                  placeholder="you@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError('')
                  }}
                />
              </div>
              {error ? <p className="text-sm font-medium text-alert">{error}</p> : null}
              <button
                type="submit"
                disabled={saving}
                className="w-full min-h-12 rounded-md bg-teal text-sm font-semibold text-white hover:bg-teal-dark disabled:opacity-60"
              >
                {saving ? 'Checking…' : 'Continue'}
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={onVerify}>
              <p className="text-sm text-slate">
                Enter the static OTP for <span className="font-semibold text-ink">{email}</span>
              </p>
              <div className="space-y-1.5">
                <label htmlFor="otp" className="text-sm font-semibold text-ink">
                  6-digit OTP
                </label>
                <input
                  id="otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="w-full h-12 rounded-md border border-line bg-canvas px-3 text-[15px] text-ink tabular outline-none focus:border-teal focus:bg-paper"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                    setError('')
                  }}
                />
              </div>
              {error ? <p className="text-sm font-medium text-alert">{error}</p> : null}
              <button
                type="submit"
                disabled={saving}
                className="w-full min-h-12 rounded-md bg-teal text-sm font-semibold text-white hover:bg-teal-dark disabled:opacity-60"
              >
                {saving ? 'Checking…' : 'Verify and open'}
              </button>
              <button
                type="button"
                className="w-full text-sm font-semibold text-teal"
                onClick={() => {
                  setStep('email')
                  setOtp('')
                  setError('')
                }}
              >
                Use a different email
              </button>
            </form>
          )}
        </div>

        {directory.length > 0 ? (
          <div className="rounded-lg border border-hairline bg-paper p-4 text-sm text-slate space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Allowed clinic emails</p>
            {directory.map((user) => (
              <div key={user.email} className="flex items-center justify-between gap-3">
                <span>{user.name}</span>
                <span className="font-semibold text-ink truncate">{user.email}</span>
              </div>
            ))}
            <p className="pt-1 text-xs">
              OTP: <span className="font-semibold text-teal tabular">0000</span>
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
