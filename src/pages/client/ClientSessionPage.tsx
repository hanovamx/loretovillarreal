import { useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { LuDownload, LuLayers, LuSearch } from 'react-icons/lu'
import { toast } from 'sonner'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import { PhotoModal } from '../../components/gallery/PhotoModal'
import { useAuthStore } from '../../stores/authStore'
import { useBookingStore } from '../../stores/bookingStore'
import { useFotoStore } from '../../stores/fotoStore'
import type { Foto } from '../../types'

const aiFilterGroups: Array<{ title: string; tags: string[] }> = [
  {
    title: 'Expresión',
    tags: ['smile', 'serious_expression', 'laughing'],
  },
  {
    title: 'Personas',
    tags: ['solo_photo', 'couple_photo', 'group_photo'],
  },
  {
    title: 'Calidad',
    tags: ['sharp_focus', 'slight_blur', 'well_exposed', 'overexposed'],
  },
  {
    title: 'Situación',
    tags: ['indoor', 'outdoor', 'studio_shot', 'natural_light'],
  },
  {
    title: 'Alertas',
    tags: ['closed_eyes', 'has_blur', 'has_overexposure'],
  },
]

export const ClientSessionPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>()
  const user = useAuthStore((state) => state.user)
  const getBookingById = useBookingStore((state) => state.getBookingById)
  const getFotosByBooking = useFotoStore((state) => state.getFotosByBooking)

  const missingClient = !user?.clienteId || !bookingId
  const booking = bookingId ? getBookingById(bookingId) : undefined
  const authorized =
    Boolean(user?.clienteId) && Boolean(booking) && booking?.cliente_id === user?.clienteId

  const fotosOutput = useMemo(
    () => (booking && bookingId && authorized ? getFotosByBooking(bookingId, 'output') : []),
    [booking, bookingId, authorized, getFotosByBooking],
  )
  const [search, setSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [selectedFoto, setSelectedFoto] = useState<Foto | null>(null)
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggleFilter = (tag: string) => {
    setActiveFilters((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    )
  }

  const filteredFotos = useMemo(() => {
    return fotosOutput.filter((foto) => {
      const matchesSearch =
        search.trim().length === 0 ||
        foto.nombre_archivo.toLowerCase().includes(search.toLowerCase())
      const matchesFilters =
        activeFilters.length === 0 ||
        activeFilters.every((tag) => foto.ai_tags?.includes(tag))
      return matchesSearch && matchesFilters
    })
  }, [fotosOutput, search, activeFilters])

  const toggleSelectFoto = (fotoId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(fotoId)) {
        next.delete(fotoId)
      } else {
        next.add(fotoId)
      }
      return next
    })
  }

  const selectedCount = selectedIds.size

  if (missingClient) {
    return <Navigate to="/cliente/login" replace />
  }

  if (!authorized || !booking || !bookingId) {
    return <Navigate to="/cliente/dashboard" replace />
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Mis sesiones</p>
          <h1 className="mt-3 text-3xl font-semibold uppercase tracking-[0.45em] text-slate-900">
            {booking.nombre_sesion}
          </h1>
          <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-slate-500">
            {new Date(booking.fecha_sesion).toLocaleDateString()} •{' '}
            {booking.total_fotos_customer_facing} fotografías disponibles
          </p>
        </div>
        <button
          onClick={() => setSelectionMode((prev) => !prev)}
          className={`rounded-full px-5 py-3 text-[10px] uppercase tracking-[0.14em] transition ${selectionMode ? 'bg-slate-900 text-white' : 'border border-slate-200 text-slate-500 hover:border-slate-900 hover:text-slate-900'}`}
        >
          {selectionMode ? 'Cancelar selección' : 'Seleccionar fotos'}
        </button>
      </div>

      {selectionMode && selectedCount > 0 ? (
        <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 text-[10px] uppercase tracking-[0.14em] text-slate-600">
          <span>{selectedCount} fotos seleccionadas.</span>
          <Button tone="secondary" size="sm" iconLeft={<LuDownload />} onClick={() => toast.success('Descarga simulada de seleccionadas')}>
            Descargar seleccionadas
          </Button>
        </div>
      ) : null}

      <Card>
        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6">
            <div className="relative">
              <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre"
                className="w-full rounded-full border border-slate-200 bg-white py-3 pl-10 pr-3 text-[10px] uppercase tracking-[0.16em] text-slate-600 outline-none transition focus:border-slate-900"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Filtros IA</p>
              <div className="mt-4 space-y-4">
                {aiFilterGroups.map((group) => (
                  <div key={group.title}>
                    <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
                      {group.title}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {group.tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleFilter(tag)}
                          className={`rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.14em] transition ${activeFilters.includes(tag) ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-[10px] uppercase tracking-[0.14em] text-slate-500">
              <p className="text-slate-400">Acciones rápidas</p>
              <div className="mt-3 space-y-2">
                <button
                  className="w-full rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800"
                  onClick={() => toast.success('Descarga simulada de todas las fotos')}
                >
                  Descargar todas
                </button>
                <button
                  className="w-full rounded-full border border-slate-200 px-4 py-2 transition hover:border-slate-900"
                  onClick={() => toast.info('Modo slideshow disponible en iteración futura')}
                >
                  Ver slideshow
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-slate-400">
              <span>{filteredFotos.length} resultados</span>
              <span className="inline-flex items-center gap-2">
                <LuLayers /> AI filtros activos: {activeFilters.length}
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFotos.map((foto) => {
                const selected = selectedIds.has(foto.id)
                return (
                  <div
                    key={foto.id}
                    className={`relative cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-slate-900 ${selected ? 'ring-4 ring-slate-900/60' : ''}`}
                    onClick={() =>
                      selectionMode ? toggleSelectFoto(foto.id) : setSelectedFoto(foto)
                    }
                  >
                    <img
                      src={foto.url_miniatura}
                      alt={foto.nombre_archivo}
                      className="h-56 w-full object-cover"
                    />
                    {selectionMode ? (
                      <div className="absolute left-3 top-3 h-5 w-5 rounded-full border border-white bg-black/30">
                        <div
                          className={`m-1 h-3 w-3 rounded-full ${selected ? 'bg-white' : 'border border-white'}`}
                        />
                      </div>
                    ) : (
                      <div className="absolute left-3 top-3">
                        <Badge tone="success">AI</Badge>
                      </div>
                    )}
                    <div className="space-y-2 px-4 py-3 text-[10px] uppercase tracking-[0.14em] text-slate-500">
                      <p className="text-slate-700">{foto.nombre_archivo}</p>
                      <div className="flex flex-wrap gap-1">
                        {foto.ai_tags?.slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded-full bg-slate-900 px-2 py-1 text-white">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {filteredFotos.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-12 text-center text-xs uppercase tracking-[0.14em] text-slate-400">
                No hay fotos que coincidan con tu búsqueda.
              </div>
            ) : null}
          </div>
        </div>
      </Card>

      <PhotoModal
        foto={selectedFoto}
        isOpen={Boolean(selectedFoto)}
        onClose={() => setSelectedFoto(null)}
        clientView
        allowBucketChange={false}
      />
    </div>
  )
}

export default ClientSessionPage

