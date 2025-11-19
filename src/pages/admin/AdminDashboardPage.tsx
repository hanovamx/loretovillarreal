import { useMemo } from 'react'
import { LuCalendarDays, LuChartPie, LuImage, LuUsers } from 'react-icons/lu'
import MetricCard from '../../components/common/MetricCard'
import Card from '../../components/common/Card'
import { useBookingStore } from '../../stores/bookingStore'
import { useClienteStore } from '../../stores/clienteStore'
import { useFotoStore } from '../../stores/fotoStore'
import Badge from '../../components/common/Badge'

interface AdminDashboardPageProps {
  bannerTitle?: string
}

export const AdminDashboardPage = ({ bannerTitle }: AdminDashboardPageProps) => {
  const clientes = useClienteStore((state) => state.clientes)
  const bookings = useBookingStore((state) => state.bookings)
  const fotos = useFotoStore((state) => state.fotos)

  const dashboardMetrics = useMemo(() => {
    const totalClientes = clientes.length
    const clientesActivos = clientes.filter(
      (cliente) => cliente.status_subscription !== 'expired',
    ).length
    const premium = clientes.filter((cliente) => cliente.status_subscription === 'premium_annual')
      .length
    const entregados = bookings.filter((booking) => booking.status === 'entregado')
    const fotosIndex = fotos.filter((foto) => foto.bucket_tipo === 'index')

    return {
      totalClientes,
      clientesActivos,
      premium,
      totalBookings: bookings.length,
      entregados: entregados.length,
      fotosIndex: fotosIndex.length,
    }
  }, [clientes, bookings, fotos])

  const title = bannerTitle ?? 'Dashboard general'

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.06em] text-black/40">
            Plataforma omnicanal
          </p>
          <h1 className="mt-4 text-4xl font-normal uppercase tracking-[0.08em] text-black">
            {title}
          </h1>
        </div>
        <Badge tone="primary" className="self-start md:self-end">
          Demo Semi Funcional
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total clientes"
          value={dashboardMetrics.totalClientes}
          subValue={`${dashboardMetrics.clientesActivos} activos`}
          icon={<LuUsers />}
          accent="primary"
        />
        <MetricCard
          title="Bookings totales"
          value={dashboardMetrics.totalBookings}
          subValue={`${dashboardMetrics.entregados} entregados`}
          icon={<LuCalendarDays />}
          accent="blue"
        />
        <MetricCard
          title="Suscripciones premium"
          value={dashboardMetrics.premium}
          subValue="Plan anual activo"
          icon={<LuChartPie />}
          accent="amber"
        />
        <MetricCard
          title="Fotos entregadas"
          value={dashboardMetrics.fotosIndex}
          subValue="Bucket INDEX"
          icon={<LuImage />}
          accent="emerald"
        />
      </div>

      <Card>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.06em] text-black/40">Flujos críticos</p>
            <div className="mt-6 space-y-4 text-sm uppercase tracking-[0.06em] text-black/60">
              <p>1. Subir fotos a INDEX con AI tagging automático.</p>
              <p>2. Visualización por bucket con filtros inteligentes.</p>
              <p>3. Panel de AI insights para decisiones rápidas.</p>
              <p>4. Experiencia cliente espejo con búsqueda inteligente.</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.06em] text-black/40">Buckets activos</p>
            <div className="mt-6 grid gap-4">
              <div className="border border-black/10 bg-white p-5">
                <p className="text-[10px] uppercase tracking-[0.06em] text-black/40">
                  Capture (interno)
                </p>
                <p className="mt-3 text-2xl font-normal tracking-[0.1em] text-black">
                  {fotos.filter((foto) => foto.bucket_tipo === 'capture').length} archivos
                </p>
              </div>
              <div className="border border-black/10 bg-white p-5">
                <p className="text-[10px] uppercase tracking-[0.06em] text-black/40">
                  Index • Customer-Facing
                </p>
                <p className="mt-3 text-2xl font-normal tracking-[0.1em] text-black">
                  {fotos.filter((foto) => foto.bucket_tipo === 'index').length} fotos finales
                </p>
              </div>
              <div className="border border-black/10 bg-white p-5">
                <p className="text-[10px] uppercase tracking-[0.06em] text-black/40">
                  Selects (preselección)
                </p>
                <p className="mt-3 text-2xl font-normal tracking-[0.1em] text-black">
                  {fotos.filter((foto) => foto.bucket_tipo === 'selects').length} candidatos
                </p>
              </div>
              <div className="border border-black/10 bg-white p-5">
                <p className="text-[10px] uppercase tracking-[0.06em] text-black/40">
                  Trash (descartadas)
                </p>
                <p className="mt-3 text-2xl font-normal tracking-[0.1em] text-black">
                  {fotos.filter((foto) => foto.bucket_tipo === 'trash').length} descartadas
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default AdminDashboardPage

