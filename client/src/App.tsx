import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './components/RequireAuth'
import { AppShell } from './layouts/AppShell'
import { TodayRegister } from './pages/TodayRegister'
import { NewEntry } from './pages/NewEntry'
import { EditEntry } from './pages/EditEntry'
import { DayReport } from './pages/DayReport'
import { Login } from './pages/Login'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<TodayRegister />} />
            <Route path="/entries/new" element={<NewEntry />} />
            <Route path="/entries/:id/edit" element={<EditEntry />} />
            <Route path="/report" element={<DayReport />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
