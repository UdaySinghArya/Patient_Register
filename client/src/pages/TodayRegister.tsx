import { Link } from 'react-router-dom'
import { StatusPanel } from '../components/StatusPanel'
import { EntryList } from '../components/EntryList'
import { useDayRegister } from '../hooks/useDayRegister'
import { formatLongDateIST, formatRupees, formatTimeIST } from '../lib/format'

export function TodayRegister() {
  const { state, retry } = useDayRegister()

  if (state.status === 'loading') {
    return <StatusPanel loading />
  }

  if (state.status === 'error') {
    return <StatusPanel error={state.message} onRetry={retry} />
  }

  const { data } = state
  const empty = data.entries.length === 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 rounded-lg border border-hairline bg-paper p-4 shadow-sm">
        <div>
          <p className="font-semibold text-ink">Today's register</p>
          <p className="text-sm text-slate">{formatLongDateIST(data.date)}</p>
        </div>
        <Link
          to="/entries/new"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-teal px-4 text-sm font-semibold text-white hover:bg-teal-dark"
        >
          Add patient
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-hairline bg-paper p-4 shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-teal" />
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate">Today's collection</p>
        <p className="mt-1 font-serif text-[32px] font-semibold leading-10 tracking-tight text-teal tabular">
          ₹{formatRupees(data.totalAmount)}
        </p>
        <p className="mt-2 text-sm text-slate">
          {data.patientCount} {data.patientCount === 1 ? 'patient' : 'patients'} dispensed
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-hairline bg-paper p-3.5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate">Patients today</p>
          <p className="mt-1 text-lg font-semibold text-ink tabular">{data.patientCount} registered</p>
        </div>
        <div className="rounded-lg border border-hairline bg-paper p-3.5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate">Last entry</p>
          {data.lastEntry ? (
            <>
              <p className="mt-1 text-sm font-semibold text-ink truncate">{data.lastEntry.patientName}</p>
              <p className="text-xs text-slate tabular">{formatTimeIST(data.lastEntry.createdAt)}</p>
            </>
          ) : (
            <p className="mt-1 text-sm text-slate">None yet</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-ink">Dispensed today</h2>
        <span className="rounded-full bg-sage px-2 py-0.5 text-[11px] font-semibold text-teal-ink tabular">
          {data.patientCount}
        </span>
      </div>

      {empty ? (
        <StatusPanel empty="No patients recorded today. When the chemist saves a slip, it will appear here." />
      ) : (
        <EntryList entries={data.entries} onChanged={retry} />
      )}

      <div className="rounded-lg border border-hairline bg-paper px-4 py-3 flex items-center justify-between shadow-sm">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate">Day total</span>
        <span className="font-serif text-[22px] font-semibold text-spruce tabular">
          ₹{formatRupees(data.totalAmount)}
        </span>
      </div>
    </div>
  )
}
