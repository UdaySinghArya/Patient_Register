import { useMemo, useState } from 'react'
import { StatusPanel } from '../components/StatusPanel'
import { EntryList } from '../components/EntryList'
import { useDayRegister } from '../hooks/useDayRegister'
import { formatLongDateIST, formatRupees, todayYmdIST } from '../lib/format'

function shiftYmd(ymd: string, days: number) {
  const [y, m, d] = ymd.split('-').map(Number)
  const utc = new Date(Date.UTC(y, m - 1, d + days))
  return utc.toISOString().slice(0, 10)
}

export function DayReport() {
  const today = useMemo(() => todayYmdIST(), [])
  const [date, setDate] = useState(today)
  const { state, retry } = useDayRegister(date)
  const yesterday = shiftYmd(today, -1)

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-hairline bg-paper p-4 shadow-sm space-y-3">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-ink">Day Report</h2>
          <p className="text-sm text-slate">Open a past day to see that day's patients and collection.</p>
        </div>
        <label className="block space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate">Date</span>
          <input
            type="date"
            value={date}
            max={today}
            onChange={(e) => {
              if (e.target.value) setDate(e.target.value)
            }}
            className="min-h-11 w-full rounded-md border border-line bg-canvas px-3 text-sm text-ink tabular outline-none focus:border-teal md:max-w-xs"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setDate(yesterday)}
            className={`min-h-11 rounded-md px-3 text-sm font-semibold ${
              date === yesterday ? 'bg-teal text-white' : 'bg-canvas text-slate border border-line'
            }`}
          >
            Yesterday
          </button>
          <button
            type="button"
            onClick={() => setDate(today)}
            className={`min-h-11 rounded-md px-3 text-sm font-semibold ${
              date === today ? 'bg-teal text-white' : 'bg-canvas text-slate border border-line'
            }`}
          >
            Today
          </button>
        </div>
      </div>

      {state.status === 'loading' ? <StatusPanel loading /> : null}
      {state.status === 'error' ? <StatusPanel error={state.message} onRetry={retry} /> : null}

      {state.status === 'ready' ? (
        <>
          <div className="relative overflow-hidden rounded-lg border border-hairline bg-paper p-4 shadow-sm">
            <div className="absolute inset-x-0 top-0 h-1 bg-teal" />
            <p className="text-sm text-slate">{formatLongDateIST(state.data.date)}</p>
            <div className="mt-3 flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate">Patients</p>
                <p className="font-serif text-2xl font-semibold text-ink tabular">{state.data.patientCount}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate">Day total</p>
                <p className="font-serif text-[32px] font-semibold leading-10 text-teal tabular">
                  ₹{formatRupees(state.data.totalAmount)}
                </p>
              </div>
            </div>
          </div>

          {state.data.entries.length === 0 ? (
            <StatusPanel empty="No entries on this date." />
          ) : (
            <EntryList entries={state.data.entries} onChanged={retry} />
          )}
        </>
      ) : null}
    </div>
  )
}
