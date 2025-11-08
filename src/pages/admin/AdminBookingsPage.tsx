import type { ChangeEvent } from 'react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LuCalendarDays,
  LuFilter,
  LuImage,
  LuLayoutGrid,
  LuList,
  LuMapPin,
  LuSearch,
  LuUser,
} from 'react-icons/lu'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isToday,
  parseISO,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from 'date-fns'
import { es } from 'date-fns/locale'
import MetricCard from '../../components/common/MetricCard'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import { useBookingStore } from '../../stores/bookingStore'
import { useFotoStore } from '../../stores/fotoStore'
import type { BookingStatus, BucketType, Foto, SessionTipo } from '../../types'
import { BRANDING_PORTRAIT_IMAGES, getBrandingImage } from '../../constants/branding'

const statusLabels: Record<BookingStatus, { label: string; tone: 'success' | 'primary' | 'muted' | 'warning' }> = {
  programado: { label: 'Programado', tone: 'warning' },
  completado: { label: 'Completado', tone: 'primary' },
  procesando: { label: 'Procesando', tone: 'primary' },
  entregado: { label: 'Entregado', tone: 'success' },
}

const tipoLabels: Record<SessionTipo, string> = {
  individual: 'Individual',
  familiar: 'Familiar',
  graduacion: 'Graduación',
  corporativo: 'Corporativo',
  evento: 'Evento',
  otro: 'Otro',
}

const getBookingCover = (
  bookingId: string,
  getFotosByBooking: (bookingId: string, bucket?: BucketType) => Foto[],
) => {
  const fotos = getFotosByBooking(bookingId, 'output')
  return fotos[0]?.url_miniatura ?? null
}

export const AdminBookingsPage = () => {
  const navigate = useNavigate()
  const { bookings, viewMode, setViewMode } = useBookingStore()
  const getFotosByBooking = useFotoStore((state) => state.getFotosByBooking)
  const [statusFilter, setStatusFilter] = useState<'todos' | BookingStatus>('todos')
  const [tipoFilter, setTipoFilter] = useState<'todos' | SessionTipo>('todos')
  const [search, setSearch] = useState('')
  const [calendarMonth, setCalendarMonth] = useState(() => startOfMonth(new Date()))
  const [selectedDay, setSelectedDay] = useState<Date | null>(startOfToday())
  const today = startOfToday()

  const enhancedBookings = useMemo(
    () =>
      bookings.map((booking) => ({
        ...booking,
        fechaSesionDate: parseISO(booking.fecha_sesion),
      })),
    [bookings],
  )

  const metrics = useMemo(() => {
    const entregados = enhancedBookings.filter((booking) => booking.status === 'entregado').length
    const proximos = enhancedBookings.filter((booking) => booking.status === 'programado').length
    const procesando = enhancedBookings.filter((booking) => booking.status === 'procesando').length
    return {
      total: enhancedBookings.length,
      entregados,
      proximos,
      procesando,
    }
  }, [enhancedBookings])

  const filteredBookings = useMemo(() => {
    return enhancedBookings.filter((booking) => {
      const statusOk = statusFilter === 'todos' || booking.status === statusFilter
      const tipoOk = tipoFilter === 'todos' || booking.tipo_sesion === tipoFilter
      const searchOk =
        search.trim().length === 0 ||
        booking.nombre_sesion.toLowerCase().includes(search.toLowerCase()) ||
        booking.ubicacion.toLowerCase().includes(search.toLowerCase())
      return statusOk && tipoOk && searchOk
    })
  }, [enhancedBookings, statusFilter, tipoFilter, search])

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(calendarMonth), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(calendarMonth), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [calendarMonth])

  const bookingsByDay = useMemo(() => {
    const map = new Map<string, typeof enhancedBookings>()
    enhancedBookings.forEach((booking) => {
      const key = format(booking.fechaSesionDate, 'yyyy-MM-dd')
      const list = map.get(key)
      if (list) {
        list.push(booking)
      } else {
        map.set(key, [booking])
      }
    })
    return map
  }, [enhancedBookings])

  const selectedDayBookings =
    selectedDay === null
      ? []
      : bookingsByDay.get(format(selectedDay, 'yyyy-MM-dd')) ?? []

  const upcomingBookings = useMemo(
    () =>
      enhancedBookings
        .filter((booking) => !isBefore(booking.fechaSesionDate, today))
        .sort((a, b) => a.fechaSesionDate.getTime() - b.fechaSesionDate.getTime())
        .slice(0, 4),
    [enhancedBookings, today],
  )

  const recentBookings = useMemo(
    () =>
      enhancedBookings
        .filter((booking) => isBefore(booking.fechaSesionDate, today))
        .sort((a, b) => b.fechaSesionDate.getTime() - a.fechaSesionDate.getTime())
        .slice(0, 4),
    [enhancedBookings, today],
  )

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Agenda de sesiones</p>
          <h1 className="mt-2 text-3xl font-heading font-semibold tracking-[0.28em] text-slate-900">
            Bookings
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-600">
            Consulta rápidamente el calendario de sesiones, identifica próximas entregas y navega al
            detalle de cada booking con un solo clic.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 rounded-full border px-5 py-3 text-xs font-semibold tracking-[0.08em] transition ${viewMode === 'grid' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-500'}`}
          >
            <LuLayoutGrid /> Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 rounded-full border px-5 py-3 text-xs font-semibold tracking-[0.08em] transition ${viewMode === 'list' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-500'}`}
          >
            <LuList /> Lista
          </button>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total sesiones"
          value={metrics.total}
          subValue={`${metrics.entregados} entregadas`}
          icon={<LuCalendarDays />}
          accent="primary"
        />
        <MetricCard
          title="En proceso"
          value={metrics.procesando}
          subValue="AI tagging pendiente"
          icon={<LuImage />}
          accent="blue"
        />
        <MetricCard
          title="Próximas sesiones"
          value={metrics.proximos}
          subValue="Confirmadas"
          icon={<LuCalendarDays />}
          accent="amber"
        />
        <MetricCard
          title="Filtro activo"
          value={`${filteredBookings.length}/${metrics.total}`}
          subValue="Resultados"
          icon={<LuFilter />}
          accent="emerald"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[2.2fr,1fr]">
        <Card className="border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Calendario mensual</p>
              <p className="text-lg font-heading tracking-[0.18em] text-slate-900">
                {format(calendarMonth, "MMMM yyyy", { locale: es }).toUpperCase()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCalendarMonth((prev) => addMonths(prev, -1))}
                className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:border-slate-900 hover:text-slate-900"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => {
                  setCalendarMonth(startOfMonth(today))
                  setSelectedDay(today)
                }}
                className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:border-slate-900 hover:text-slate-900"
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={() => setCalendarMonth((prev) => addMonths(prev, 1))}
                className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:border-slate-900 hover:text-slate-900"
              >
                →
              </button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-7 gap-2">
            {calendarDays.map((day) => {
              const key = format(day, 'yyyy-MM-dd')
              const dayBookings = bookingsByDay.get(key) ?? []
              const isCurrentMonth = day.getMonth() === calendarMonth.getMonth()
              const isSelected = selectedDay ? isSameDay(day, selectedDay) : false
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`relative flex min-h-[90px] flex-col rounded-2xl border p-2 text-left transition ${isCurrentMonth ? 'border-slate-200 bg-white hover:border-slate-900' : 'border-transparent bg-slate-50 text-slate-400 hover:border-slate-200'} ${isToday(day) ? 'ring-2 ring-primary/40' : ''} ${isSelected ? 'border-primary text-primary' : ''}`}
                >
                  <span className="text-sm font-semibold">
                    {format(day, 'd')}
                  </span>
                  <div className="mt-1 flex flex-col gap-1">
                    {dayBookings.slice(0, 2).map((booking) => (
                      <div
                        key={booking.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-600"
                      >
                        <p className="font-medium text-slate-700">{booking.nombre_sesion}</p>
                        <p className="text-[10px] text-slate-500">{booking.ubicacion}</p>
                      </div>
                    ))}
                    {dayBookings.length > 2 ? (
                      <span className="text-[10px] text-slate-400">+{dayBookings.length - 2} más</span>
                    ) : null}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-600">
              {selectedDay
                ? `Sesiones para el ${format(selectedDay, "d 'de' MMMM yyyy", { locale: es })}`
                : 'Selecciona un día del calendario para ver sus sesiones'}
            </p>
            <ul className="mt-3 space-y-2">
              {selectedDayBookings.length === 0 ? (
                <li className="text-sm text-slate-500">
                  No hay bookings registrados en esta fecha.
                </li>
              ) : (
                selectedDayBookings.map((booking) => (
                  <li key={booking.id}>
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                    >
                      <span className="font-semibold text-slate-800">{booking.nombre_sesion}</span>
                      <p className="text-xs text-slate-500">{booking.ubicacion}</p>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </Card>
        <div className="grid gap-6">
          <Card className="border border-slate-200">
            <p className="text-sm font-medium text-slate-500">Sesiones próximas</p>
            <ul className="mt-4 space-y-3">
              {upcomingBookings.length === 0 ? (
                <li className="text-sm text-slate-400">No hay sesiones confirmadas en el futuro cercano.</li>
              ) : (
                upcomingBookings.map((booking) => (
                  <li key={booking.id}>
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-600 transition hover:border-slate-900 hover:text-slate-900"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800">{booking.nombre_sesion}</span>
                        <span className="text-xs text-slate-500">
                          {format(booking.fechaSesionDate, 'd MMM', { locale: es })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{booking.ubicacion}</p>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </Card>
          <Card className="border border-slate-200">
            <p className="text-sm font-medium text-slate-500">Sesiones recientes</p>
            <ul className="mt-4 space-y-3">
              {recentBookings.length === 0 ? (
                <li className="text-sm text-slate-400">Aún no se registran sesiones pasadas.</li>
              ) : (
                recentBookings.map((booking) => (
                  <li key={booking.id}>
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-600 transition hover:border-slate-900 hover:text-slate-900"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800">{booking.nombre_sesion}</span>
                        <span className="text-xs text-slate-500">
                          {format(booking.fechaSesionDate, 'd MMM', { locale: es })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{booking.ubicacion}</p>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </Card>
        </div>
      </div>

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={handleSearchChange}
              placeholder="Buscar por nombre de sesión o locación"
              className="w-full rounded-full border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-600 outline-none transition focus:border-slate-900"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
              className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm text-slate-600 outline-none transition hover:border-slate-900 focus:border-slate-900"
            >
              <option value="todos">Status: Todos</option>
              <option value="entregado">Entregados</option>
              <option value="procesando">Procesando</option>
              <option value="completado">Completados</option>
              <option value="programado">Programados</option>
            </select>
            <select
              value={tipoFilter}
              onChange={(event) => setTipoFilter(event.target.value as typeof tipoFilter)}
              className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm text-slate-600 outline-none transition hover:border-slate-900 focus:border-slate-900"
            >
              <option value="todos">Tipo: Todos</option>
              <option value="individual">Individual</option>
              <option value="familiar">Familiar</option>
              <option value="graduacion">Graduación</option>
              <option value="corporativo">Corporativo</option>
              <option value="evento">Evento</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                className="group cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-subtle transition hover:-translate-y-1 hover:border-slate-900"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      getBookingCover(booking.id, getFotosByBooking) ??
                      getBrandingImage(BRANDING_PORTRAIT_IMAGES, booking.id)
                    }
                    alt={booking.nombre_sesion}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute left-4 top-4">
                    <Badge tone="muted">{tipoLabels[booking.tipo_sesion]}</Badge>
                  </div>
                  <div className="absolute right-4 top-4">
                    <Badge tone={statusLabels[booking.status].tone}>
                      {statusLabels[booking.status].label}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-4 px-6 py-5">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">
                      {format(booking.fechaSesionDate, "EEEE d 'de' MMMM yyyy", { locale: es })}
                    </p>
                    <h3 className="mt-2 text-xl font-heading font-semibold tracking-[0.18em] text-slate-800">
                      {booking.nombre_sesion}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    {booking.notas_internas || 'Sesión sin notas internas registradas.'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-2">
                      <LuMapPin className="text-slate-400" /> {booking.ubicacion}
                    </span>
                    <span className="flex items-center gap-2">
                      <LuImage className="text-slate-400" /> {booking.total_fotos_customer_facing} fotos
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-400">
                <tr>
                  <th className="px-6 py-4 text-left">Sesión</th>
                  <th className="px-6 py-4 text-left">Fecha</th>
                  <th className="px-6 py-4 text-left">Tipo</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Cliente</th>
                  <th className="px-6 py-4 text-left">Fotos OUTPUT</th>
                  <th className="px-6 py-4 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-600">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="cursor-pointer transition hover:bg-slate-50"
                    onClick={() => navigate(`/admin/bookings/${booking.id}`)}
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{booking.nombre_sesion}</p>
                      <p className="mt-1 text-xs text-slate-500">{booking.ubicacion}</p>
                    </td>
                    <td className="px-6 py-4">
                      {format(booking.fechaSesionDate, 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <Badge tone="muted">{tipoLabels[booking.tipo_sesion]}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge tone={statusLabels[booking.status].tone}>
                        {statusLabels[booking.status].label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-slate-500">
                        <LuUser className="text-slate-400" /> {booking.cliente_id.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {booking.total_fotos_customer_facing}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-400">Ver →</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredBookings.length === 0 ? (
          <div className="mt-10 text-center text-sm text-slate-400">
            No encontramos bookings que coincidan con los filtros seleccionados.
          </div>
        ) : null}
      </Card>
    </div>
  )
}

export default AdminBookingsPage

