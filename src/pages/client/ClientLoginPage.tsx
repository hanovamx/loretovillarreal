import type { FormEvent } from 'react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { useAuthStore } from '../../stores/authStore'
import { BRANDING_HERO_IMAGES, getBrandingImage } from '../../constants/branding'

export const ClientLoginPage = () => {
  const { loginClient, isAuthenticated, userType } = useAuthStore()
  const [email, setEmail] = useState('cliente.demo@loretovillarreal.studio')
  const [password, setPassword] = useState('demo123')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated && userType === 'client') {
    return <Navigate to="/cliente/dashboard" replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    try {
      await loginClient(email, password)
      toast.success('¡Bienvenido! Tus fotos están listas.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No fue posible iniciar sesión'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        <div className="relative hidden md:block">
          <img
            src={getBrandingImage(BRANDING_HERO_IMAGES, 'client-hero')}
            alt="Loreto Villarreal Studio"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 to-black/35" />
          <div className="absolute bottom-12 left-12 text-white">
            <p className="text-xs uppercase tracking-[0.22em] text-white/70">Loreto Villarreal</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[0.5em]">STUDIO CLOUD</h1>
            <p className="mt-6 max-w-sm text-xs uppercase tracking-[0.14em] text-white/80">
              Tu galería personal con AI insights. Visualiza, filtra y descarga tus fotografías en
              cualquier momento.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center bg-background px-6 py-10 md:px-12">
          <div className="w-full max-w-lg space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                Accede a tus fotografías
              </p>
              <h2 className="mt-3 text-2xl font-semibold uppercase tracking-[0.22em] text-slate-900">
                Experiencia omnicanal
              </h2>
            </div>

            <Card className="border border-slate-200">
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
                    Acceso temporal (180 días)
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-slate-500">
                    Visualiza y descarga todas tus fotos entregadas.
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="mt-2 w-full rounded-full border border-slate-200 bg-white px-6 py-3 text-xs uppercase tracking-[0.16em] text-slate-600 outline-none transition focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Contraseña temporal
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="mt-2 w-full rounded-full border border-slate-200 bg-white px-6 py-3 text-xs uppercase tracking-[0.16em] text-slate-600 outline-none transition focus:border-slate-900"
                  />
                </div>
                <Button type="submit" tone="secondary" className="w-full" disabled={loading}>
                  {loading ? 'Ingresando…' : 'Acceder a mis fotos'}
                </Button>
                <p className="text-[10px] uppercase tracking-[0.14em] text-emerald-500">
                  ✓ Acceso vigente durante 180 días
                </p>
              </form>
            </Card>

            <Card className="border border-amber-300 bg-amber-50/80">
              <p className="inline-flex items-center rounded-full bg-amber-500 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white">
                Premium
              </p>
              <h3 className="mt-4 text-xl font-semibold uppercase tracking-[0.22em] text-amber-600">
                Plan Premium Anual
              </h3>
              <p className="mt-3 text-xs uppercase tracking-[0.16em] text-amber-600">
                $5,000 MXN al año • Almacenamiento permanente • Descargas ilimitadas • IA avanzada •
                Compartir álbumes
              </p>
              <Button tone="ghost" className="mt-5 w-full text-amber-600 hover:text-amber-700">
                Obtener Plan Premium
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientLoginPage

