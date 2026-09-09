type Props = {
  loading?: boolean
  error?: string | null
  empty?: string | null
  onRetry?: () => void
}

export function StatusPanel({ loading, error, empty, onRetry }: Props) {
  if (loading) {
    return (
      <div className="rounded-lg border border-hairline bg-paper px-4 py-8 text-center">
        <p className="text-sm font-medium text-slate">Loading register…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-alert/30 bg-alert-bg px-4 py-6 text-center space-y-3">
        <p className="text-sm font-medium text-alert">{error}</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-teal px-4 text-sm font-semibold text-white hover:bg-teal-dark"
          >
            Retry
          </button>
        ) : null}
      </div>
    )
  }

  if (empty) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-paper px-4 py-8 text-center">
        <p className="text-sm text-slate">{empty}</p>
      </div>
    )
  }

  return null
}
