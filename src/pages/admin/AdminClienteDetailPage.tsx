import { useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { LuCalendarDays, LuMail, LuPhone, LuUser } from 'react-icons/lu'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import MetricCard from '../../components/common/MetricCard'
import { useClienteStore } from '../../stores/clienteStore'
import { useBookingStore } from '../../stores/bookingStore'

const tabs = [
  { id: 'historial', label: 'Historial de bookings' },
  { id: 'contacto', label: 'Información de contacto' },
  { id: 'actividad', label: 'Actividad reciente' },
] as const

const subscriptionBadge: Record<
  'free_180_days' | 'premium_annual' | 'expired',
  { tone: 'success' | 'primary' | 'danger'; label: string }
> = {
  free_180_days: { tone: 'success', label: 'Acceso temporal 180 días' },
  premium_annual: { tone: 'primary', label: 'Premium anual' },
  expired: { tone: 'danger', label: 'Acceso expirado' },
}

export const AdminClienteDetailPage = () => {
  const { clienteId } = useParams<{ clienteId: string }>()
  const getClienteById = useClienteStore((state) => state.getClienteById)
  const getBookingsByCliente = useBookingStore((state) => state.getBookingsByCliente)
  const cliente = clienteId ? getClienteById(clienteId) : undefined
  const bookings = useMemo(
    () => (clienteId ? getBookingsByCliente(clienteId) : []),
    [clienteId, getBookingsByCliente],
  )
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>('historial')

  const metrics = useMemo(() => {
    const totalEntregados = bookings.filter((booking) => booking.status === 'entregado').length
    const totalFotos = bookings.reduce(
      (acc, booking) => acc + booking.total_fotos_customer_facing,
      0,
    )
    const lastBooking = bookings
      .slice()
      .sort(
        (a, b) =>
          new Date(b.fecha_sesion).getTime() - new Date(a.fecha_sesion).getTime(),
      )[0]
    return {
      totalBookings: bookings.length,
      entregados: totalEntregados,
      totalFotos,
      lastBooking,
    }
  }, [bookings])

  if (!cliente) {
    return <Navigate to="/admin/clientes" replace />
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-subtle lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-900/90 text-white">
            <LuUser className="text-3xl" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.10em] text-slate-400">Cliente</p>
            <h1 className="mt-2 text-2xl font-semibold uppercase tracking-[0.10em] text-slate-900">
              {cliente.nombre_completo}
            </h1>
            <div className="mt-3 flex flex-wrap gap-3">
              <Badge tone={subscriptionBadge[cliente.status_subscription].tone}>
                {subscriptionBadge[cliente.status_subscription].label}
              </Badge>
              <Badge tone="muted">{cliente.tipo_cliente}</Badge>
            </div>
          </div>
        </div>
        <div className="grid gap-4 text-sm uppercase tracking-[0.07em] text-slate-500">
          <span className="flex items-center gap-2">
                <LuMail className="text-slate-400" /> {cliente.email}
          </span>
          <span className="flex items-center gap-2">
                <LuPhone className="text-slate-400" /> {cliente.telefono}
          </span>
          <span className="flex items-center gap-2">
                <LuCalendarDays className="text-slate-400" /> Cliente desde{' '}
            {new Date(cliente.fecha_registro).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <MetricCard
          title="Sesiones totales"
          value={metrics.totalBookings}
          subValue={`${metrics.entregados} entregadas`}
          icon={<LuCalendarDays />}
          accent="blue"
        />
        <MetricCard
          title="Fotos entregadas"
          value={metrics.totalFotos}
          subValue="Bucket INDEX"
          icon={<LuUser />}
          accent="emerald"
        />
        <MetricCard
          title="Última sesión"
          value={metrics.lastBooking ? new Date(metrics.lastBooking.fecha_sesion).toLocaleDateString() : 'Pendiente'}
          subValue={metrics.lastBooking?.nombre_sesion ?? 'Sin registro'}
          icon={<LuMail />}
          accent="primary"
        />
      </div>

      <Card>
        <div>
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.07em] transition ${activeTab === tab.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-8">
            {activeTab === 'historial' ? (
              <div className="space-y-6">
                {bookings
                  .slice()
                  .sort((a, b) => new Date(b.fecha_sesion).getTime() - new Date(a.fecha_sesion).getTime())
                  .map((booking) => (
                    <div
                      key={booking.id}
                      className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm transition hover:border-slate-900"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.10em] text-slate-400">
                            {new Date(booking.fecha_sesion).toLocaleDateString()}
                          </p>
                          <h3 className="mt-2 text-lg font-semibold uppercase tracking-[0.07em] text-slate-800">
                            {booking.nombre_sesion}
                          </h3>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge tone="muted">{booking.tipo_sesion}</Badge>
                            <Badge
                              tone={
                                booking.status === 'entregado'
                                  ? 'success'
                                  : booking.status === 'produccion' || booking.status === 'edicion_vobo'
                                    ? 'primary'
                                    : 'muted'
                              }
                            >
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid gap-2 text-right text-[10px] uppercase tracking-[0.07em] text-slate-400">
                          <p>{booking.total_fotos_customer_facing} fotos INDEX</p>
                          <p>{booking.total_fotos_procesadas} procesadas</p>
                          <p>{booking.total_fotos_capturadas} capturadas</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : null}
            {activeTab === 'contacto' ? (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-xs uppercase tracking-[0.07em] text-slate-500">
                  <p className="text-slate-400">Contacto directo</p>
                  <p className="mt-4 text-slate-700">{cliente.email}</p>
                  <p className="mt-2 text-slate-700">{cliente.telefono}</p>
                  <p className="mt-6 text-slate-400">Preferencias</p>
                  <p className="mt-2 text-slate-600">
                    {cliente.tipo_cliente === 'empresa'
                      ? 'Prefiere sesiones corporativas en estudio.'
                      : 'Prefiere comunicación por WhatsApp con recordatorios 48h antes.'}
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-xs uppercase tracking-[0.07em] text-slate-500">
                  <p className="text-slate-400">Notas internas</p>
                  <p className="mt-4 text-slate-600">
                    Programar seguimiento automático posterior a cada entrega para promover plan
                    premium anual. Cliente valora AI tagging para encontrar fotos rápidamente.
                  </p>
                </div>
              </div>
            ) : null}
            {activeTab === 'actividad' ? (
              <div className="space-y-4 text-xs uppercase tracking-[0.07em] text-slate-500">
                <p>• Login reciente en portal cliente hace 3 días.</p>
                <p>• Descargó 12 fotos destacadas de su graduación.</p>
                <p>• Solicitó upgrade a plan premium en Q1.</p>
              </div>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default AdminClienteDetailPage

