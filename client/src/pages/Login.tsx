import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ApiError, getClinicDirectory, loginUser, type ClinicUser } from '../api'
import { isLoggedIn, saveSession } from '../auth'

export function Login() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
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

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const { user } = await loginUser(phone, pin)
      saveSession(user)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not sign in. Try again.')
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
          <p className="text-sm text-slate">Clinic Pharmacy Ledger · sign in with a saved clinic number</p>
        </div>

        <div className="relative overflow-hidden rounded-lg border border-hairline bg-paper p-5 shadow-sm space-y-4">
          <div className="absolute inset-x-0 top-0 h-1 bg-teal" />
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-sm font-semibold text-ink">
                Mobile number
              </label>
              <input
                id="phone"
                inputMode="numeric"
                autoComplete="tel"
                className="w-full h-12 rounded-md border border-line bg-canvas px-3 text-[15px] text-ink tabular outline-none focus:border-teal focus:bg-paper"
                placeholder="10-digit number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                  setError('')
                }}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="pin" className="text-sm font-semibold text-ink">
                PIN
              </label>
              <input
                id="pin"
                type="password"
                inputMode="numeric"
                autoComplete="off"
                className="w-full h-12 rounded-md border border-line bg-canvas px-3 text-[15px] text-ink tabular outline-none focus:border-teal focus:bg-paper"
                placeholder="0000"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, '').slice(0, 4))
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
              {saving ? 'Signing in…' : 'Open register'}
            </button>
          </form>
        </div>

        {directory.length > 0 ? (
          <div className="rounded-lg border border-hairline bg-paper p-4 text-sm text-slate space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Saved clinic users</p>
            {directory.map((user) => (
              <div key={user.phone} className="flex items-center justify-between gap-3">
                <span>{user.name}</span>
                <span className="font-semibold text-ink tabular">{user.phone}</span>
              </div>
            ))}
            <p className="pt-1 text-xs">
              PIN: <span className="font-semibold text-teal tabular">0000</span>
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
