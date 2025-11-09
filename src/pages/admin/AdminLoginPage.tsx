import type { FormEvent } from 'react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'
import Button from '../../components/common/Button'
import { BRANDING_HERO_IMAGES, getBrandingImage } from '../../constants/branding'
import Card from '../../components/common/Card'
import { useAuthStore } from '../../stores/authStore'

export const AdminLoginPage = () => {
  const { loginAdmin, isAuthenticated, userType } = useAuthStore()
  const [email, setEmail] = useState('admin@loretovillarreal.studio')
  const [password, setPassword] = useState('demo123')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated && userType === 'admin') {
    return <Navigate to="/admin/clientes" replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    try {
      await loginAdmin(email, password)
      toast.success('Bienvenida de nuevo, Loreto')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ocurrió un error'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="relative w-full max-w-4xl overflow-hidden border border-slate-200 p-0 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative hidden bg-slate-900 md:block">
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/40" />
            <img
              src={getBrandingImage(BRANDING_HERO_IMAGES, 'admin-hero')}
              alt="Loreto Villarreal Studio"
              className="h-full w-full object-cover opacity-75"
            />
            <div className="absolute inset-0 flex flex-col justify-between p-10 text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                  Loreto Villarreal
                </p>
                <h1 className="mt-6 text-3xl font-heading tracking-[0.42em] text-white">STUDIO</h1>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                  Plataforma omnicanal
                </p>
                <p className="mt-4 text-sm uppercase tracking-[0.14em] text-white/70">
                  Gestión de clientes • AI tagging automático • 4 buckets
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center px-6 py-10 md:px-10">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Acceso restringido</p>
            <h2 className="mt-6 text-2xl font-semibold uppercase tracking-[0.22em] text-slate-900">
              Dashboard de fotógrafa
            </h2>
            <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Correo
                </span>
                <input
                  type="email"
                  className="mt-2 w-full rounded-full border border-slate-200 bg-white px-6 py-3 text-sm uppercase tracking-[0.14em] text-slate-700 outline-none transition focus:border-slate-900"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Contraseña
                </span>
                <input
                  type="password"
                  className="mt-2 w-full rounded-full border border-slate-200 bg-white px-6 py-3 text-sm uppercase tracking-[0.14em] text-slate-700 outline-none transition focus:border-slate-900"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </label>

              <Button type="submit" tone="secondary" disabled={loading} className="w-full">
                {loading ? 'Ingresando…' : 'Entrar'}
              </Button>
            </form>
            <div className="mt-10 space-y-3 text-sm text-slate-500">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                Demo interno • Fotos simuladas • AI tagging automático
              </p>
              <button
                onClick={() => (window.location.href = '/cliente/login')}
                className="text-sm font-semibold text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline"
                type="button"
              >
                Ir al portal del cliente →
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default AdminLoginPage

