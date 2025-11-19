import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LuCloudUpload, LuFilter, LuImage, LuLayers, LuSearch, LuUser } from 'react-icons/lu'
import Card from '../../components/common/Card'
import MetricCard from '../../components/common/MetricCard'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import { PhotoModal } from '../../components/gallery/PhotoModal'
import { useFotoStore } from '../../stores/fotoStore'
import { useClienteStore } from '../../stores/clienteStore'
import { useBookingStore } from '../../stores/bookingStore'
import type { BucketType, Foto } from '../../types'

const bucketDetails: Record<
  BucketType,
  { title: string; description: string; helper?: string; badge?: string }
> = {
  capture: {
    title: 'Capture',
    description: 'Originales RAW de cámara',
  },
  index: {
    title: 'Index',
    description: 'Fotos finales para cliente',
    helper: 'AI tagging activado automáticamente',
    badge: 'AI',
  },
  selects: {
    title: 'Selects',
    description: 'Preselección para edición',
  },
  trash: {
    title: 'Trash',
    description: 'Fotos descartadas',
  },
}

const bucketOrder: BucketType[] = ['capture', 'index', 'selects', 'trash']

export const AdminFotosPage = () => {
  const navigate = useNavigate()
  const fotos = useFotoStore((state) => state.fotos)
  const uploadQueue = useFotoStore((state) => state.uploadQueue)
  const uploadFotos = useFotoStore((state) => state.uploadFotos)
  const getBucketMetrics = useFotoStore((state) => state.getBucketMetrics)
  const clientes = useClienteStore((state) => state.clientes)
  const bookings = useBookingStore((state) => state.bookings)
  const [selectedCliente, setSelectedCliente] = useState<'todos' | string>('todos')
  const [selectedBooking, setSelectedBooking] = useState<'todos' | string>('todos')
  const [search, setSearch] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedFoto, setSelectedFoto] = useState<Foto | null>(null)

  const fileInputsRef = useRef<Record<BucketType, HTMLInputElement | null>>({
    capture: null,
    index: null,
    selects: null,
    trash: null,
  })

  const indexFotos = fotos.filter((foto) => foto.bucket_tipo === 'index')

  const tagsAvailable = useMemo(() => {
    const tags = new Set<string>()
    indexFotos.forEach((foto) => foto.ai_tags?.forEach((tag) => tags.add(tag)))
    return Array.from(tags).sort()
  }, [indexFotos])

  const filteredFotos = useMemo(() => {
    return indexFotos.filter((foto) => {
      const bookingMatch = selectedBooking === 'todos' || foto.booking_id === selectedBooking
      const bookingEntity = bookings.find((booking) => booking.id === foto.booking_id)
      const clienteMatch =
        selectedCliente === 'todos' ||
        (bookingEntity && bookingEntity.cliente_id === selectedCliente)
      const searchMatch =
        search.trim().length === 0 ||
        foto.nombre_archivo.toLowerCase().includes(search.toLowerCase()) ||
        foto.ai_tags?.some((tag) => tag.toLowerCase().includes(search.toLowerCase())) ||
        foto.tags_manuales?.some((tag) => tag.toLowerCase().includes(search.toLowerCase())) ||
        (bookingEntity && bookingEntity.nombre_sesion.toLowerCase().includes(search.toLowerCase()))
      const tagsMatch =
        selectedTags.length === 0 || selectedTags.every((tag) => foto.ai_tags?.includes(tag))
      return bookingMatch && clienteMatch && searchMatch && tagsMatch
    })
  }, [indexFotos, selectedBooking, selectedCliente, bookings, search, selectedTags])

  const selectedBookingEntity = useMemo(
    () =>
      selectedBooking === 'todos'
        ? undefined
        : bookings.find((booking) => booking.id === selectedBooking),
    [selectedBooking, bookings],
  )

  const selectedClienteEntity = useMemo(
    () =>
      selectedBookingEntity
        ? clientes.find((cliente) => cliente.id === selectedBookingEntity.cliente_id)
        : undefined,
    [clientes, selectedBookingEntity],
  )

  const bookingBucketMetrics = useMemo(() => {
    if (selectedBooking === 'todos') return null
    return getBucketMetrics(selectedBooking)
  }, [selectedBooking, getBucketMetrics])

  const bookingsSorted = useMemo(
    () =>
      [...bookings].sort(
        (a, b) =>
          new Date(b.fecha_sesion).getTime() - new Date(a.fecha_sesion).getTime(),
      ),
    [bookings],
  )

  const bookingDateLabel = selectedBookingEntity
    ? new Date(selectedBookingEntity.fecha_sesion).toLocaleDateString()
    : ''

  const handleUploadTrigger = (bucket: BucketType) => {
    if (selectedBooking === 'todos') return
    const input = fileInputsRef.current[bucket]
    if (input) {
      input.value = ''
      input.click()
    }
  }

  const handleFileSelection = async (bucket: BucketType, files: FileList | null) => {
    if (!files || files.length === 0 || selectedBooking === 'todos') return
    await uploadFotos(Array.from(files), selectedBooking, bucket)
    const input = fileInputsRef.current[bucket]
    if (input) {
      input.value = ''
    }
  }

  const metrics = useMemo(() => {
    const totalBookings = new Set(indexFotos.map((foto) => foto.booking_id)).size
    const totalClientes = new Set(
      indexFotos
        .map((foto) => bookings.find((booking) => booking.id === foto.booking_id)?.cliente_id)
        .filter(Boolean),
    ).size
    const personasDetectadas = indexFotos.reduce(
      (acc, foto) => acc + (foto.ai_insights?.faces_count ?? 0),
      0,
    )
    return {
      totalFotos: indexFotos.length,
      totalBookings,
      totalClientes,
      personasDetectadas,
    }
  }, [indexFotos, bookings])

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]))
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.06em] text-black/40">Biblioteca global INDEX</p>
          <h1 className="mt-4 text-4xl font-normal uppercase tracking-[0.08em] text-black">Fotos</h1>
        </div>
        <Button
          tone="secondary"
          size="md"
          className="self-start md:self-end"
          onClick={() => navigate('/admin/bookings')}
        >
          Ir a bookings
        </Button>
      </header>

      <Card>
        <div className="space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.06em] text-black/40">Gestión de buckets</p>
              <h2 className="mt-2 text-2xl font-normal uppercase tracking-[0.06em] text-black">
                {selectedBookingEntity ? selectedBookingEntity.nombre_sesion : 'Selecciona un booking'}
              </h2>
              {selectedBookingEntity ? (
                <p className="mt-2 text-[11px] uppercase tracking-[0.06em] text-black/40">
                  {bookingDateLabel} • {selectedClienteEntity?.nombre_completo ?? 'Cliente por confirmar'}
                </p>
              ) : (
                <p className="mt-2 text-[11px] uppercase tracking-[0.06em] text-black/40">
                  Elige un booking para habilitar la subida a cada bucket.
                </p>
              )}
            </div>
            <div className="w-full max-w-md">
              <label className="text-[11px] uppercase tracking-[0.06em] text-black/40">
                Seleccionar booking
              </label>
              <select
                value={selectedBooking}
                onChange={(event) => setSelectedBooking(event.target.value as typeof selectedBooking)}
                className="mt-2 w-full border border-black/10 bg-white px-4 py-3 text-[11px] uppercase tracking-[0.06em] text-black outline-none transition hover:border-black focus:border-black"
              >
                <option value="todos">Selecciona un booking…</option>
                {bookingsSorted.map((booking) => (
                  <option key={booking.id} value={booking.id}>
                    {booking.nombre_sesion} • {new Date(booking.fecha_sesion).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {bucketOrder.map((bucket) => {
              const info = bucketDetails[bucket]
              const bucketCount = bookingBucketMetrics ? bookingBucketMetrics[bucket] : '—'
              return (
                <div key={bucket} className="flex h-full flex-col border border-black/10 bg-white p-6">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.06em] text-black/40">
                    <span>{info.title}</span>
                    {info.badge ? (
                      <Badge tone="primary" uppercase={false} className="!px-2 !py-0.5">
                        {info.badge}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-4 text-3xl font-normal tracking-[0.08em] text-black">
                    {selectedBookingEntity ? bucketCount : '—'}
                  </p>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.06em] text-black/50">
                    {info.description}
                  </p>
                  {info.helper ? (
                    <p className="mt-2 text-[10px] uppercase tracking-[0.06em] text-black/40">
                      {info.helper}
                    </p>
                  ) : null}
                  <div className="mt-6">
                    <input
                      ref={(node) => {
                        fileInputsRef.current[bucket] = node
                      }}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(event) => handleFileSelection(bucket, event.target.files)}
                    />
                    {selectedBookingEntity ? (
                      <Button
                        tone="secondary"
                        size="md"
                        className="w-full"
                        iconLeft={<LuCloudUpload />}
                        onClick={() => handleUploadTrigger(bucket)}
                      >
                        Subir o arrastrar
                      </Button>
                    ) : (
                      <p className="text-[11px] uppercase tracking-[0.06em] text-black/30">
                        Selecciona un booking primero
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="border border-black/10 bg-white p-6">
            <p className="text-xs uppercase tracking-[0.06em] text-black/40">Cola de subida</p>
            <div className="mt-5 space-y-4">
              {uploadQueue.length === 0 ? (
                <div className="border border-dashed border-black/20 bg-black/5 px-5 py-6 text-center text-[11px] uppercase tracking-[0.06em] text-black/40">
                  Selecciona archivos para comenzar la subida al bucket elegido.
                </div>
              ) : null}
              {uploadQueue.map((item) => (
                <div
                  key={item.id}
                  className="space-y-3 border border-black/10 bg-white px-4 py-4 text-[11px] uppercase tracking-[0.06em] text-black/60 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate">{item.fileName}</span>
                    <Badge tone="muted">{item.bucket}</Badge>
                  </div>
                  <div className="h-1.5 bg-black/10">
                    <div
                      className="h-full bg-black transition-all"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.06em] text-black/40">
                    {item.status === 'uploading'
                      ? 'Subiendo…'
                      : item.status === 'processing'
                        ? 'Aplicando AI…'
                        : item.status === 'done'
                          ? 'Completado'
                          : 'Pendiente'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total fotos disponibles"
          value={metrics.totalFotos}
          subValue="Bucket INDEX con AI"
          icon={<LuImage />}
          accent="primary"
        />
        <MetricCard
          title="Clientes con entregas"
          value={metrics.totalClientes}
          subValue="Acceso omnicanal"
          icon={<LuUser />}
          accent="blue"
        />
        <MetricCard
          title="Sesiones con entregas"
          value={metrics.totalBookings}
          subValue="AI tagging activo"
          icon={<LuLayers />}
          accent="amber"
        />
        <MetricCard
          title="Caras detectadas"
          value={metrics.personasDetectadas}
          subValue="Reconocimiento facial"
          icon={<LuFilter />}
          accent="emerald"
        />
      </section>

      <Card>
        <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
          <div className="space-y-6 border border-black/10 bg-white p-6">
            <p className="text-xs uppercase tracking-[0.06em] text-black/40">Filtros</p>
            <div className="space-y-3">
              <label className="block text-[11px] uppercase tracking-[0.06em] text-black/40">
                Cliente
              </label>
              <select
                value={selectedCliente}
                onChange={(event) => {
                  setSelectedCliente(event.target.value as typeof selectedCliente)
                  setSelectedBooking('todos')
                }}
                className="w-full border border-black/10 bg-white px-4 py-3 text-[11px] uppercase tracking-[0.06em] text-black outline-none transition hover:border-black focus:border-black"
              >
                <option value="todos">Todos los clientes</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre_completo}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              <label className="block text-[11px] uppercase tracking-[0.06em] text-black/40">
                Booking
              </label>
              <select
                value={selectedBooking}
                onChange={(event) => setSelectedBooking(event.target.value as typeof selectedBooking)}
                className="w-full border border-black/10 bg-white px-4 py-3 text-[11px] uppercase tracking-[0.06em] text-black outline-none transition hover:border-black focus:border-black"
              >
                <option value="todos">Todos los bookings</option>
                {bookings
                  .filter((booking) => selectedCliente === 'todos' || booking.cliente_id === selectedCliente)
                  .map((booking) => (
                    <option key={booking.id} value={booking.id}>
                      {booking.nombre_sesion}
                    </option>
                  ))}
              </select>
            </div>
            <div className="space-y-3">
              <label className="block text-[11px] uppercase tracking-[0.06em] text-black/40">
                Buscar
              </label>
              <div className="relative">
                <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full border border-black/10 bg-white py-3 pl-9 pr-3 text-[11px] uppercase tracking-[0.06em] text-black outline-none transition hover:border-black focus:border-black"
                  placeholder="Archivo, tags o sesión"
                />
              </div>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.06em] text-black/40">AI Tags</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {tagsAvailable.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleToggleTag(tag)}
                    className={`border px-3 py-2 text-[11px] uppercase tracking-[0.06em] transition ${
                      selectedTags.includes(tag)
                        ? 'border-black bg-black text-white'
                        : 'border-black/10 bg-white text-black hover:border-black'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="text-xs uppercase tracking-[0.06em] text-black/40">
              {filteredFotos.length} fotos con los filtros seleccionados
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredFotos.map((foto) => (
                <div
                  key={foto.id}
                  className="cursor-pointer border border-black/10 bg-white transition hover:-translate-y-1 hover:border-black"
                  onClick={() => setSelectedFoto(foto)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={foto.url_miniatura}
                      alt={foto.nombre_archivo}
                      className="h-full w-full object-cover transition duration-700 hover:scale-110"
                    />
                    <div className="absolute left-3 top-3">
                      <Badge tone="success">Index</Badge>
                    </div>
                  </div>
                  <div className="space-y-3 px-4 py-3 text-[11px] uppercase tracking-[0.06em] text-black/60">
                    <p className="text-black">{foto.nombre_archivo}</p>
                    <p>
                      {new Date(foto.fecha_subida).toLocaleDateString()} •{' '}
                      {(foto.tamano_bytes / 1_000_000).toFixed(1)} MB
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {foto.ai_tags?.slice(0, 3).map((tag) => (
                        <span key={tag} className="border border-black bg-black px-2 py-1 text-white">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredFotos.length === 0 ? (
              <div className="border border-black/10 bg-black/5 p-10 text-center text-xs uppercase tracking-[0.06em] text-black/40">
                No hay fotos que coincidan con los filtros activos.
              </div>
            ) : null}
          </div>
        </div>
      </Card>

      <PhotoModal
        foto={selectedFoto}
        isOpen={Boolean(selectedFoto)}
        onClose={() => setSelectedFoto(null)}
        allowBucketChange={false}
        clientView
      />
    </div>
  )
}

export default AdminFotosPage

