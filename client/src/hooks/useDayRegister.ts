import { useCallback, useEffect, useState } from 'react'
import { ApiError, getEntries, type DayRegister } from '../api'

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: DayRegister }

export function useDayRegister(date?: string) {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [tick, setTick] = useState(0)

  const retry = useCallback(() => {
    setTick((n) => n + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })

    void (async () => {
      try {
        const data = await getEntries(date)
        if (!cancelled) setState({ status: 'ready', data })
      } catch (err) {
        if (cancelled) return
        const message =
          err instanceof ApiError
            ? err.message
            : 'Could not load the register. Try again.'
        setState({ status: 'error', message })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [date, tick])

  return { state, retry }
}
