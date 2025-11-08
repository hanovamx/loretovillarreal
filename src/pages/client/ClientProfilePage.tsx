import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { LuShieldCheck, LuUser } from 'react-icons/lu'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import { useAuthStore } from '../../stores/authStore'
import { useClienteStore } from '../../stores/clienteStore'
import { getDaysLeftForCliente } from '../../data/mockData'

const tabs = [
  { id: 'info', label: 'Mi información' },
  { id: 'subscription', label: 'Mi suscripción' },
  { id: 'privacy', label: 'Privacidad' },
] as const

export const ClientProfilePage = () => {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>('info')
  const user = useAuthStore((state) => state.user)
  const getClienteById = useClienteStore((state) => state.getClienteById)
  const cliente = user?.clienteId ? getClienteById(user.clienteId) : undefined

  if (!cliente) {
    return <Navigate to="/cliente/login" replace />
  }

  const daysLeft = getDaysLeftForCliente(cliente)

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Perfil</p>
          <h1 className="mt-3 text-3xl font-semibold uppercase tracking-[0.45em] text-slate-900">
            Mis preferencias
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Badge
            tone={
              cliente.status_subscription === 'premium_annual'
                ? 'primary'
                : cliente.status_subscription === 'free_180_days'
                  ? 'success'
                  : 'danger'
            }
          >
            {cliente.status_subscription}
          </Badge>
          <div className="rounded-full border border-slate-200 px-5 py-3 text-[10px] uppercase tracking-[0.14em] text-slate-500">
            Cliente desde {new Date(cliente.fecha_registro).toLocaleDateString()}
          </div>
        </div>
      </div>

      <Card>
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] transition ${activeTab === tab.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-8">
          {activeTab === 'info' ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
                  Datos personales
                </p>
                <div className="mt-4 space-y-4 text-xs uppercase tracking-[0.16em] text-slate-500">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
                      Nombre
                    </span>
                    <input
                      className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-slate-600 outline-none transition focus:border-slate-900"
                      defaultValue={cliente.nombre_completo}
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
                      Email
                    </span>
                    <input
                      className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-slate-600 outline-none transition focus:border-slate-900"
                      defaultValue={cliente.email}
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
                      Teléfono
                    </span>
                    <input
                      className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-slate-600 outline-none transition focus:border-slate-900"
                      defaultValue={cliente.telefono}
                    />
                  </label>
                  <Button tone="ghost" size="sm" iconLeft={<LuUser />}>
                    Actualizar información
                  </Button>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
                  Preferencias
                </p>
                <div className="mt-4 space-y-2 text-xs uppercase tracking-[0.16em] text-slate-500">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked />
                    Recordatorios de sesión por correo
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked />
                    Notificaciones de nuevas entregas
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" />
                    Compartir álbumes automáticamente
                  </label>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === 'subscription' ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
                <p className="text-xs uppercase tracking-[0.14em] text-emerald-500">
                  Estado de suscripción
                </p>
                <h2 className="mt-3 text-2xl font-semibold uppercase tracking-[0.22em] text-emerald-600">
                  {cliente.status_subscription === 'premium_annual'
                    ? 'Plan Premium Activo'
                    : cliente.status_subscription === 'free_180_days'
                      ? 'Acceso temporal'
                      : 'Acceso expirado'}
                </h2>
                {cliente.status_subscription === 'free_180_days' && daysLeft !== null ? (
                  <p className="mt-4 text-[10px] uppercase tracking-[0.14em] text-emerald-600">
                    Te quedan {daysLeft} días de acceso ilimitado.
                  </p>
                ) : null}
                <Button tone="secondary" size="sm" className="mt-6" iconLeft={<LuShieldCheck />}>
                  {cliente.status_subscription === 'premium_annual'
                    ? 'Gestionar renovación'
                    : 'Upgrade a Premium'}
                </Button>
              </div>
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-xs uppercase tracking-[0.14em] text-amber-600">
                <p>Beneficios premium</p>
                <ul className="mt-4 space-y-2">
                  <li>• Nube permanente sin límite de tiempo.</li>
                  <li>• Descargas ilimitadas con máxima calidad.</li>
                  <li>• Búsqueda inteligente avanzada por IA.</li>
                  <li>• Compartir álbumes privados.</li>
                  <li>• Soporte prioritario.</li>
                </ul>
              </div>
            </div>
          ) : null}

          {activeTab === 'privacy' ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-xs uppercase tracking-[0.14em] text-slate-500">
                <p className="text-slate-400">Configuraciones de privacidad</p>
                <div className="mt-4 space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked />
                    Permitir compartir álbumes con enlace protegido.
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" />
                    Solicitar autorización antes de publicar ejemplos.
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked />
                    Notificar descargas en tiempo real.
                  </label>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-xs uppercase tracking-[0.14em] text-slate-500">
                <p className="text-slate-400">Control de datos</p>
                <div className="mt-4 space-y-3">
                  <Button tone="ghost" size="sm">
                    Solicitar exportación de datos
                  </Button>
                  <Button tone="ghost" size="sm">
                    Eliminar cuenta
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  )
}

export default ClientProfilePage

