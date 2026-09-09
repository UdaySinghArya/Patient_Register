import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { getSession, isChemist, logout } from '../auth'
import { IconNewEntry, IconRegister, IconReport } from '../components/NavIcons'

const NAV = [
  { to: '/', label: "Today's Register", icon: IconRegister, end: true },
  { to: '/entries/new', label: 'New Entry', icon: IconNewEntry, end: false },
  { to: '/report', label: 'Day Report', icon: IconReport, end: false },
] as const

function todayLabel() {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date())
}

function navClass(isActive: boolean, variant: 'side' | 'bottom') {
  if (variant === 'side') {
    return [
      'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold min-h-11 transition-colors',
      isActive
        ? 'bg-teal text-white'
        : 'text-slate hover:bg-sage/80 hover:text-teal-ink',
    ].join(' ')
  }
  return [
    'flex flex-1 flex-col items-center justify-center gap-0.5 min-h-14 min-w-16 text-[11px] font-semibold tracking-wide uppercase',
    isActive ? 'text-teal' : 'text-muted',
  ].join(' ')
}

export function AppShell() {
  const dateText = todayLabel()
  const navigate = useNavigate()
  const session = getSession()
  const navItems = isChemist() ? NAV : NAV.filter((item) => item.to !== '/entries/new')

  function onLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-56 flex-col border-r border-hairline bg-paper">
        <div className="flex items-center gap-3 px-4 h-16 border-b border-hairline">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-sm font-semibold text-white">
            PR
          </span>
          <div className="min-w-0">
            <p className="font-serif text-[15px] font-semibold leading-tight text-ink">Patient Register</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Clinic desk</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 p-3" aria-label="Main">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => navClass(isActive, 'side')}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto px-4 pb-4 space-y-2">
          <p className="text-xs text-muted">One clinic · chemist and doctor</p>
          <button
            type="button"
            onClick={onLogout}
            className="w-full min-h-10 rounded-md border border-line text-xs font-semibold text-slate hover:bg-canvas"
          >
            Sign out
          </button>
        </div>
      </aside>

      <header className="fixed top-0 inset-x-0 z-30 h-16 border-b border-hairline bg-paper/90 backdrop-blur-md md:left-56">
        <div className="flex h-full items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="md:hidden flex h-8 w-8 items-center justify-center rounded-full bg-sage text-teal font-semibold text-sm">
              PR
            </span>
            <div className="min-w-0">
              <h1 className="font-serif text-lg font-semibold leading-tight text-ink truncate">Patient Register</h1>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Clinic Pharmacy Ledger</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-flex items-center rounded-md bg-canvas px-2 py-1 text-xs font-medium text-slate tabular">
              {dateText}
            </span>
            <span className="hidden sm:inline text-xs font-medium text-slate truncate max-w-28">
              {session?.name ?? session?.role}
            </span>
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-[11px] font-semibold text-white"
              title={session?.role ?? 'Clinic'}
            >
              {session?.role === 'Chemist' ? 'CH' : 'DR'}
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="min-h-8 rounded-md border border-line px-2.5 text-xs font-semibold text-slate hover:bg-canvas"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="pt-16 pb-24 md:pl-56 md:pb-8">
        <div className="mx-auto w-full max-w-5xl px-4 py-4 md:px-6 md:py-6">
          <Outlet />
        </div>
      </main>

      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-hairline bg-paper/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
        aria-label="Main"
      >
        <div className="flex items-stretch">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => navClass(isActive, 'bottom')}
            >
              <item.icon className="h-[22px] w-[22px]" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
