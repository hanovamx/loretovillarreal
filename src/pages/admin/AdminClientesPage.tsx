import type { ChangeEvent, ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LuSearch, LuUsers, LuBuilding, LuUserRound, LuUser, LuShieldCheck } from 'react-icons/lu'
import MetricCard from '../../components/common/MetricCard'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import { useClienteStore } from '../../stores/clienteStore'
import type { Cliente } from '../../types'

const tipoLabels: Record<Cliente['tipo_cliente'], string> = {
  individual: 'Individual',
  familia: 'Familia',
  empresa: 'Empresa',
}

const subscriptionLabels: Record<Cliente['status_subscription'], { label: string; tone: string }> = {
  free_180_days: { label: 'Free 180 días', tone: 'emerald' },
  premium_annual: { label: 'Premium', tone: 'amber' },
  expired: { label: 'Expirada', tone: 'danger' },
}

const typeIcons: Record<Cliente['tipo_cliente'], ReactNode> = {
  individual: <LuUser />,
  familia: <LuUserRound />,
  empresa: <LuBuilding />,
}

export const AdminClientesPage = () => {
  const navigate = useNavigate()
  const { clientes, searchClientes, setSearchQuery } = useClienteStore()
  const [tipoFilter, setTipoFilter] = useState<'todos' | Cliente['tipo_cliente']>('todos')
  const [subscriptionFilter, setSubscriptionFilter] = useState<
    'todas' | Cliente['status_subscription']
  >('todas')
  const [query, setQuery] = useState('')

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setQuery(value)
    setSearchQuery(value)
  }

  const filteredClientes = useMemo(() => {
    const list = searchClientes(query)
    return list.filter((cliente) => {
      const tipoOk = tipoFilter === 'todos' || cliente.tipo_cliente === tipoFilter
      const subOk =
        subscriptionFilter === 'todas' || cliente.status_subscription === subscriptionFilter
      return tipoOk && subOk
    })
  }, [searchClientes, query, tipoFilter, subscriptionFilter])

  const metrics = useMemo(() => {
    const activos = clientes.filter((cliente) => cliente.status_subscription !== 'expired')
    const premium = clientes.filter((cliente) => cliente.status_subscription === 'premium_annual')
    const totalFotos = clientes.reduce((acc, cliente) => acc + cliente.total_fotos, 0)
    return {
      total: clientes.length,
      activos: activos.length,
      premium: premium.length,
      totalFotos,
    }
  }, [clientes])

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.06em] text-black/40">
            Vista maestra de clientes
          </p>
          <h1 className="mt-4 text-4xl font-normal uppercase tracking-[0.08em] text-black">
            Clientes
          </h1>
        </div>
        <Button tone="secondary" size="md" className="self-start md:self-end">
          + Nuevo cliente
        </Button>
      </header>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total clientes"
          value={metrics.total}
          subValue={`${metrics.activos} activos`}
          icon={<LuUsers />}
          accent="primary"
        />
        <MetricCard
          title="Plan premium"
          value={metrics.premium}
          subValue="Suscripciones anuales"
          icon={<LuShieldCheck />}
          accent="amber"
        />
        <MetricCard
          title="Total fotografías"
          value={metrics.totalFotos}
          subValue="AI tagging activado"
          icon={<LuSearch />}
          accent="blue"
        />
        <MetricCard
          title="Filtros activos"
          value={`${filteredClientes.length}/${metrics.total}`}
          subValue="Resultados actuales"
          icon={<LuUserRound />}
          accent="emerald"
        />
      </section>

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" />
            <input
              value={query}
              onChange={handleSearch}
              placeholder="Buscar por nombre, email o teléfono"
              className="w-full border border-black/10 bg-white py-3 pl-12 pr-4 text-xs uppercase tracking-[0.06em] text-black outline-none transition focus:border-black"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={tipoFilter}
              onChange={(event) => setTipoFilter(event.target.value as typeof tipoFilter)}
              className="border border-black/10 bg-white px-6 py-3 text-xs uppercase tracking-[0.06em] text-black outline-none transition hover:border-black focus:border-black"
            >
              <option value="todos">Tipo: Todos</option>
              <option value="individual">Individual</option>
              <option value="familia">Familia</option>
              <option value="empresa">Empresa</option>
            </select>
            <select
              value={subscriptionFilter}
              onChange={(event) =>
                setSubscriptionFilter(event.target.value as typeof subscriptionFilter)
              }
              className="border border-black/10 bg-white px-6 py-3 text-xs uppercase tracking-[0.06em] text-black outline-none transition hover:border-black focus:border-black"
            >
              <option value="todas">Suscripción: Todas</option>
              <option value="free_180_days">Free 180</option>
              <option value="premium_annual">Premium</option>
              <option value="expired">Expirada</option>
            </select>
          </div>
        </div>

        <div className="mt-8 overflow-hidden border border-black/10">
          <table className="min-w-full divide-y divide-black/10">
            <thead className="bg-black/5">
              <tr className="text-[10px] uppercase tracking-[0.06em] text-black/40">
                <th className="px-6 py-4 text-left">Cliente</th>
                <th className="px-6 py-4 text-left">Teléfono</th>
                <th className="px-6 py-4 text-left">Tipo</th>
                <th className="px-6 py-4 text-left">Suscripción</th>
                <th className="px-6 py-4 text-left">Bookings</th>
                <th className="px-6 py-4 text-left">Fotos</th>
                <th className="px-6 py-4 text-left">Última sesión</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 bg-white text-xs uppercase tracking-[0.06em] text-black/60">
              {filteredClientes.map((cliente) => {
                const subscription = subscriptionLabels[cliente.status_subscription]
                return (
                  <tr
                    key={cliente.id}
                    className="cursor-pointer transition hover:bg-black/5"
                    onClick={() => navigate(`/admin/clientes/${cliente.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium tracking-[0.06em] text-black">
                          {cliente.nombre_completo}
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.06em] text-black/40">
                          {cliente.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-black/60">{cliente.telefono}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg text-black/30">{typeIcons[cliente.tipo_cliente]}</span>
                        <span>{tipoLabels[cliente.tipo_cliente]}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        tone={
                          cliente.status_subscription === 'premium_annual'
                            ? 'primary'
                            : cliente.status_subscription === 'free_180_days'
                              ? 'success'
                              : 'danger'
                        }
                      >
                        {subscription.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-black">{cliente.total_bookings}</td>
                    <td className="px-6 py-4 text-black">{cliente.total_fotos}</td>
                    <td className="px-6 py-4">
                      {cliente.ultimo_booking ? (
                        <span>{new Date(cliente.ultimo_booking).toLocaleDateString()}</span>
                      ) : (
                        <span className="text-black/40">Sin sesiones</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-black/40 transition hover:text-black">Ver →</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filteredClientes.length === 0 ? (
            <div className="p-10 text-center text-xs uppercase tracking-[0.06em] text-black/40">
              No encontramos clientes con esos filtros
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  )
}

export default AdminClientesPage

