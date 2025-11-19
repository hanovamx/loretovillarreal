import { NavLink, Outlet } from 'react-router-dom'
import { LuLogOut, LuSettings, LuGlobe } from 'react-icons/lu'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../stores/authStore'

// clientMenu will be translated in component

export const ClientLayout = () => {
  const { user, logout } = useAuthStore()
  const { t, i18n } = useTranslation()
  const subscription = user?.subscription ?? 'free_180_days'

  const subscriptionLabel =
    subscription === 'premium_annual'
      ? t('profile.active')
      : subscription === 'free_180_days'
        ? t('profile.temporary')
        : t('profile.expired')

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('client-language', lng)
  }

  const languages = [
    { code: 'es', label: 'ES' },
    { code: 'en', label: 'EN' },
    { code: 'ko', label: '한' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Loreto Villarreal</p>
            <h1 className="text-xl font-semibold tracking-[0.20em] text-slate-900">STUDIO CLOUD</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="appearance-none rounded-full border border-slate-200 bg-white px-4 py-2 pr-8 text-xs font-semibold uppercase tracking-[0.07em] text-slate-600 outline-none transition hover:bg-slate-50 focus:border-slate-900"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <LuGlobe className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">
                {user?.name ?? 'Cliente'}
              </p>
              <p
                className={`text-[10px] font-semibold uppercase tracking-[0.08em] ${subscription === 'premium_annual' ? 'text-amber-500' : subscription === 'expired' ? 'text-rose-500' : 'text-emerald-500'}`}
              >
                {subscriptionLabel}
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.07em] text-slate-600 transition hover:bg-slate-100"
            >
              <LuLogOut /> {t('auth.logout')}
            </button>
          </div>
        </div>
        <nav className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl gap-6 px-4 py-2">
            <NavLink
              to="/cliente/dashboard"
              className={({ isActive }) =>
                `text-xs font-semibold uppercase tracking-[0.07em] transition ${isActive ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`
              }
            >
              {t('dashboard.mySessions')}
            </NavLink>
            <NavLink
              to="/cliente/perfil"
              className={({ isActive }) =>
                `text-xs font-semibold uppercase tracking-[0.07em] transition ${isActive ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`
              }
            >
              {t('dashboard.myProfile')}
            </NavLink>
            <div className="ml-auto flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
              <LuSettings />
              {t('dashboard.settings')}
            </div>
          </div>
        </nav>
      </header>
      <main className="mx-auto min-h-[calc(100vh-152px)] max-w-6xl px-4 py-10">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white/70 py-6 text-center text-[10px] uppercase tracking-[0.10em] text-slate-400">
        © {new Date().getFullYear()} Loreto Villarreal Studio • Experiencia Omnicanal Demo
      </footer>
    </div>
  )
}

export default ClientLayout

