import { Navigate, Outlet } from 'react-router-dom'
import { isDoctor } from '../auth'

export function RequireDoctor() {
  if (!isDoctor()) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
