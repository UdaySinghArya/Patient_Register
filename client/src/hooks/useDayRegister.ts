import { useCallback, useEffect, useState } from 'react'
import { ApiError, getEntries, type DayRegister } from '../api'

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: DayRegister }

export function useDayRegister(date?: string) {
  const [state, setState] = useState<State>({ status: 'loading' })

  const load = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const data = await getEntries(date)
      setState({ status: 'ready', data })
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Could not load the register. Try again.'
      setState({ status: 'error', message })
    }
  }, [date])

  useEffect(() => {
    void load()
  }, [load])

  return { state, retry: load }
}
