import { Navigate, useNavigate } from 'react-router-dom'
import { LuCalendarDays, LuImage, LuMapPin, LuSparkles } from 'react-icons/lu'
import { format, isBefore, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import MetricCard from '../../components/common/MetricCard'
import { useAuthStore } from '../../stores/authStore'
import { useClienteStore } from '../../stores/clienteStore'
import { useBookingStore } from '../../stores/bookingStore'
import { useFotoStore } from '../../stores/fotoStore'
import { getDaysLeftForCliente } from '../../data/mockData'
import { BRANDING_PORTRAIT_IMAGES, getBrandingImage } from '../../constants/branding'

export const ClientDashboardPage = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const getClienteById = useClienteStore((state) => state.getClienteById)
  const getBookingsByCliente = useBookingStore((state) => state.getBookingsByCliente)
  const getFotosByBooking = useFotoStore((state) => state.getFotosByBooking)

  if (!user?.clienteId) {
    return <Navigate to="/cliente/login" replace />
  }

  const cliente = getClienteById(user.clienteId)
  const bookings = getBookingsByCliente(user.clienteId)
  const totalFotos = bookings.reduce((acc, booking) => acc + booking.total_fotos_customer_facing, 0)
  const accessDays = cliente ? getDaysLeftForCliente(cliente) : null

  const upcomingBookings = bookings
    .filter((booking) => !isBefore(parseISO(booking.fecha_sesion), new Date()))
    .sort((a, b) => new Date(a.fecha_sesion).getTime() - new Date(b.fecha_sesion).getTime())
    .slice(0, 3)

  const recentBookings = bookings
    .filter((booking) => isBefore(parseISO(booking.fecha_sesion), new Date()))
    .sort((a, b) => new Date(b.fecha_sesion).getTime() - new Date(a.fecha_sesion).getTime())
    .slice(0, 3)

  return (
    <div className="space-y-10">
      <Card className="border border-slate-200 bg-white/90 p-8 backdrop-blur">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Hola, {cliente?.nombre_completo?.split(' ')[0]}
            </p>
            <h1 className="mt-2 text-3xl font-heading font-semibold tracking-[0.32em] text-slate-900">
              Tus recuerdos están listos
            </h1>
            <p className="mt-3 max-w-xl text-sm text-slate-600">
              Explora tus sesiones con filtros inteligentes de IA, descarga tus favoritos y comparte
              los momentos especiales con quien tú quieras.
            </p>
          </div>
          {user.subscription === 'free_180_days' && accessDays !== null ? (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-600">
              <p className="font-medium">Tu acceso expira en</p>
              <p className="mt-2 text-3xl font-heading font-semibold tracking-[0.18em]">
                {accessDays} días
              </p>
              <button className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-400 px-4 py-2 text-xs uppercase tracking-[0.1em] transition hover:bg-amber-100">
                <LuSparkles /> Upgrade a Premium
              </button>
            </div>
          ) : null}
        </div>
      </Card>

      <section className="grid gap-6 md:grid-cols-3">
        <MetricCard
          title="Mis sesiones"
          value={bookings.length}
          subValue="Historial completo"
          icon={<LuCalendarDays />}
          accent="primary"
        />
        <MetricCard
          title="Fotografías disponibles"
          value={totalFotos}
          subValue="Con AI tagging"
          icon={<LuImage />}
          accent="blue"
        />
        <MetricCard
          title="Descargas sugeridas"
          value={Math.floor(totalFotos * 0.25)}
          subValue="Recomendadas por IA"
          icon={<LuSparkles />}
          accent="emerald"
        />
      </section>

      <section>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Mis sesiones</p>
            <p className="text-xs text-slate-400">
              Accede a cualquier sesión para explorar filtros inteligentes, insights y descargas.
            </p>
          </div>
          <button
            onClick={() => navigate('/cliente/perfil')}
            className="rounded-full border border-slate-200 px-5 py-2 text-xs text-slate-500 transition hover:border-slate-900 hover:text-slate-900"
          >
            Administrar perfil
          </button>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr,1fr]">
          <div className="grid gap-6 sm:grid-cols-2">
            {bookings.map((booking) => {
              const cover = getFotosByBooking(booking.id, 'output')[0]
              const bookingDate = format(new Date(booking.fecha_sesion), "d 'de' MMMM yyyy", { locale: es })
              return (
                <div
                  key={booking.id}
                  className="cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-slate-900"
                  onClick={() => navigate(`/cliente/sesion/${booking.id}`)}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={
                        cover?.url_miniatura ??
                        getBrandingImage(BRANDING_PORTRAIT_IMAGES, booking.id)
                      }
                      alt={booking.nombre_sesion}
                      className="h-full w-full object-cover transition duration-700 hover:scale-110"
                    />
                    <div className="absolute left-4 top-4">
                      <Badge tone="muted">{booking.tipo_sesion}</Badge>
                    </div>
                  </div>
                  <div className="space-y-3 px-6 py-5 text-sm text-slate-600">
                    <p className="text-xs font-semibold text-slate-500">{bookingDate}</p>
                    <h3 className="text-xl font-heading font-semibold tracking-[0.18em] text-slate-900">
                      {booking.nombre_sesion}
                    </h3>
                    <p className="flex items-center gap-2 text-xs text-slate-500">
                      <LuMapPin className="text-slate-400" /> {booking.ubicacion}
                    </p>
                    <p>{booking.total_fotos_customer_facing} fotografías listas para descargar.</p>
                    <button className="rounded-full bg-slate-900 px-4 py-2 text-xs uppercase tracking-[0.1em] text-white">
                      Ver fotos →
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          <Card className="border border-slate-200">
            <p className="text-sm font-medium text-slate-500">Agenda personalizada</p>
            <p className="text-xs text-slate-400">
              Consulta lo que viene y revive tus entregas más recientes.
            </p>
            <div className="mt-4 space-y-5">
              <div>
                <h4 className="text-xs uppercase tracking-[0.1em] text-slate-500">Próximas sesiones</h4>
                <ul className="mt-2 space-y-2">
                  {upcomingBookings.length === 0 ? (
                    <li className="text-xs text-slate-400">
                      No tienes sesiones programadas próximamente.
                    </li>
                  ) : (
                    upcomingBookings.map((booking) => (
                      <li key={booking.id}>
                        <button
                          onClick={() => navigate(`/cliente/sesion/${booking.id}`)}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left text-xs text-slate-600 transition hover:border-slate-900 hover:text-slate-900"
                          type="button"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800">{booking.nombre_sesion}</span>
                            <span className="text-[11px] text-slate-500">
                              {format(new Date(booking.fecha_sesion), 'd MMM', { locale: es })}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">{booking.ubicacion}</p>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-[0.1em] text-slate-500">Sesiones recientes</h4>
                <ul className="mt-2 space-y-2">
                  {recentBookings.length === 0 ? (
                    <li className="text-xs text-slate-400">Aún no registramos sesiones anteriores.</li>
                  ) : (
                    recentBookings.map((booking) => (
                      <li key={booking.id}>
                        <button
                          onClick={() => navigate(`/cliente/sesion/${booking.id}`)}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left text-xs text-slate-600 transition hover:border-slate-900 hover:text-slate-900"
                          type="button"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800">{booking.nombre_sesion}</span>
                            <span className="text-[11px] text-slate-500">
                              {format(new Date(booking.fecha_sesion), 'd MMM', { locale: es })}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {booking.total_fotos_customer_facing} fotografías disponibles
                          </p>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default ClientDashboardPage

