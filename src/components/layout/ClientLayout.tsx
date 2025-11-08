import { NavLink, Outlet } from 'react-router-dom'
import { LuLogOut, LuSettings } from 'react-icons/lu'
import { useAuthStore } from '../../stores/authStore'

const clientMenu = [
  {
    label: 'Dashboard',
    path: '/cliente/dashboard',
  },
  {
    label: 'Mis Sesiones',
    path: '/cliente/dashboard',
  },
  {
    label: 'Mi Perfil',
    path: '/cliente/perfil',
  },
]

export const ClientLayout = () => {
  const { user, logout } = useAuthStore()
  const subscription = user?.subscription ?? 'free_180_days'

  const subscriptionLabel =
    subscription === 'premium_annual'
      ? 'Premium Activo'
      : subscription === 'free_180_days'
        ? 'Acceso Temporal'
        : 'Suscripción Expirada'

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Loreto Villarreal</p>
            <h1 className="text-xl font-semibold tracking-[0.5em] text-slate-900">STUDIO CLOUD</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                {user?.name ?? 'Cliente'}
              </p>
              <p
                className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${subscription === 'premium_annual' ? 'text-amber-500' : subscription === 'expired' ? 'text-rose-500' : 'text-emerald-500'}`}
              >
                {subscriptionLabel}
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 transition hover:bg-slate-100"
            >
              <LuLogOut /> Salir
            </button>
          </div>
        </div>
        <nav className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl gap-6 px-4 py-2">
            {clientMenu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-xs font-semibold uppercase tracking-[0.14em] transition ${isActive ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="ml-auto flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              <LuSettings />
              Ajustes
            </div>
          </div>
        </nav>
      </header>
      <main className="mx-auto min-h-[calc(100vh-152px)] max-w-6xl px-4 py-10">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white/70 py-6 text-center text-[10px] uppercase tracking-[0.22em] text-slate-400">
        © {new Date().getFullYear()} Loreto Villarreal Studio • Experiencia Omnicanal Demo
      </footer>
    </div>
  )
}

export default ClientLayout

