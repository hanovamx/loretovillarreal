import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  LuCalendarDays,
  LuLifeBuoy,
  LuImage,
  LuLayoutDashboard,
  LuLogOut,
  LuSettings,
  LuUsers,
} from 'react-icons/lu'
import { useAuthStore } from '../../stores/authStore'

const adminMenu = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: LuLayoutDashboard,
  },
  {
    label: 'Clientes',
    path: '/admin/clientes',
    icon: LuUsers,
  },
  {
    label: 'Bookings',
    path: '/admin/bookings',
    icon: LuCalendarDays,
  },
  {
    label: 'Fotos',
    path: '/admin/fotos',
    icon: LuImage,
  },
]

const secondaryMenu = [
  {
    label: 'Configuración',
    path: '/admin/configuracion',
    icon: LuSettings,
  },
  {
    label: 'Ayuda',
    path: '/admin/ayuda',
    icon: LuLifeBuoy,
  },
]

const Sidebar = ({ collapsed, onClose }: { collapsed: boolean; onClose: () => void }) => {
  return (
    <aside
      className={`fixed z-30 flex h-screen w-72 flex-col border-r border-black/10 bg-white text-black transition-all duration-300 ${collapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}`}
    >
      <div className="flex items-center justify-between border-b border-black/10 px-6 py-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-black/50">Loreto Villarreal</p>
          <h1 className="text-lg font-normal tracking-[0.12em]">Studio</h1>
        </div>
        <button
          className="p-2 text-black/50 hover:bg-black/10 lg:hidden"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <div className="px-3 py-6">
          <ul className="space-y-2">
            {adminMenu.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 text-sm font-medium uppercase tracking-[0.14em] transition ${
                      isActive
                        ? 'bg-black text-white'
                        : 'text-black/60 hover:bg-black/5'
                    }`
                  }
                  onClick={onClose}
                >
                  <item.icon className="text-lg" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="px-3">
          <div className="h-px bg-black/10" />
        </div>
        <div className="px-3 py-6">
          <ul className="space-y-2">
            {secondaryMenu.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 text-sm font-medium uppercase tracking-[0.14em] transition ${
                      isActive
                        ? 'bg-black text-white'
                        : 'text-black/60 hover:bg-black/5'
                    }`
                  }
                  onClick={onClose}
                >
                  <item.icon className="text-lg" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="border-t border-black/10 px-6 py-6 text-[11px] uppercase tracking-[0.14em] text-black/40">
        © {new Date().getFullYear()} Loreto Villarreal
      </div>
    </aside>
  )
}

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()

  return (
    <div className="flex bg-background text-text">
      <Sidebar collapsed={!sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen w-full flex-col lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-black/10 bg-white/95 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button
              className="border border-black px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-black transition hover:bg-black hover:text-white lg:hidden"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              Menú
            </button>
            <span className="hidden text-[11px] font-medium uppercase tracking-[0.14em] text-black/40 md:inline">
              Omnicanal • Dashboard Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-black/50">
                {user?.name ?? 'Administrador'}
              </p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-black/40">Studio Manager</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 border border-black px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-black transition hover:bg-black hover:text-white"
            >
              <LuLogOut /> Salir
            </button>
          </div>
        </header>
        <main className="flex-1 bg-background px-4 py-10 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

