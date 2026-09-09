import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './layouts/AppShell'
import { TodayRegister } from './pages/TodayRegister'
import { NewEntry } from './pages/NewEntry'
import { DayReport } from './pages/DayReport'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<TodayRegister />} />
          <Route path="/entries/new" element={<NewEntry />} />
          <Route path="/report" element={<DayReport />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
