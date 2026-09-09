import { useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteEntry, type Entry } from '../api'
import { formatRupees, formatTimeIST } from '../lib/format'

type Props = {
  entries: Entry[]
  onChanged?: () => void
}

export function EntryList({ entries, onChanged }: Props) {
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onDelete(entry: Entry) {
    const ok = window.confirm(`Delete ${entry.patientName}'s slip? This cannot be undone.`)
    if (!ok) return
    setBusyId(entry.id)
    setError(null)
    try {
      await deleteEntry(entry.id)
      onChanged?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete this entry.')
    } finally {
      setBusyId(null)
    }
  }

  function Actions({ entry }: { entry: Entry }) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to={`/entries/${entry.id}/edit`}
          className="inline-flex min-h-9 items-center rounded-md border border-line px-2.5 text-xs font-semibold text-teal hover:bg-sage"
        >
          Edit
        </Link>
        <button
          type="button"
          disabled={busyId === entry.id}
          onClick={() => void onDelete(entry)}
          className="inline-flex min-h-9 items-center rounded-md border border-alert/30 px-2.5 text-xs font-semibold text-alert hover:bg-alert-bg disabled:opacity-60"
        >
          {busyId === entry.id ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    )
  }

  return (
    <>
      {error ? <p className="text-sm font-medium text-alert">{error}</p> : null}

      <div className="md:hidden space-y-3">
        {entries.map((entry, index) => (
          <article
            key={entry.id}
            className="rounded-lg border border-hairline bg-paper p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex items-start gap-2.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-canvas text-xs font-semibold text-teal">
                  {String(entries.length - index).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-ink leading-tight">{entry.patientName}</h3>
                  <p className="text-xs text-slate mt-0.5">
                    {entry.address}
                    <span className="text-muted"> · {formatTimeIST(entry.createdAt)}</span>
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-serif text-[22px] font-semibold leading-none text-teal tabular">
                  ₹{formatRupees(entry.amount)}
                </p>
                <span className="mt-1 inline-block rounded bg-sage px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-teal-ink">
                  Dispensed
                </span>
              </div>
            </div>
            <p className="mt-3 rounded-md bg-canvas px-3 py-2 text-sm text-ink">{entry.medicines}</p>
            <div className="mt-3">
              <Actions entry={entry} />
            </div>
          </article>
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto rounded-lg border border-hairline bg-paper">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#edf4f2] text-[11px] font-semibold uppercase tracking-wider text-ink border-b border-line">
              <th className="px-3 py-2.5">Time</th>
              <th className="px-3 py-2.5">Name</th>
              <th className="px-3 py-2.5">Address</th>
              <th className="px-3 py-2.5">Medicines</th>
              <th className="px-3 py-2.5 text-right">Amount</th>
              <th className="px-3 py-2.5">Status</th>
              <th className="px-3 py-2.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr
                key={entry.id}
                className={`border-b border-hairline last:border-0 ${i % 2 === 1 ? 'bg-[#fafcfb]' : 'bg-paper'}`}
              >
                <td className="px-3 py-3 whitespace-nowrap text-slate tabular">
                  {formatTimeIST(entry.createdAt)}
                </td>
                <td className="px-3 py-3 font-semibold text-ink">{entry.patientName}</td>
                <td className="px-3 py-3 text-slate">{entry.address}</td>
                <td className="px-3 py-3 text-ink">{entry.medicines}</td>
                <td className="px-3 py-3 text-right font-semibold text-teal tabular">
                  ₹{formatRupees(entry.amount)}
                </td>
                <td className="px-3 py-3">
                  <span className="inline-block rounded bg-sage px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-teal-ink">
                    Dispensed
                  </span>
                </td>
                <td className="px-3 py-3">
                  <Actions entry={entry} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
