import { Navigate, Outlet } from 'react-router-dom'
import { isChemist } from '../auth'

export function RequireChemist() {
  if (!isChemist()) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
