import { useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import {
  LuArrowLeft,
  LuCalendarDays,
  LuCloudUpload,
  LuLoader,
  LuMapPin,
  LuSettings2,
} from 'react-icons/lu'
import { toast } from 'sonner'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import { PhotoModal } from '../../components/gallery/PhotoModal'
import { useBookingStore } from '../../stores/bookingStore'
import { useFotoStore } from '../../stores/fotoStore'
import { usePaqueteStore } from '../../stores/paqueteStore'
import type { BucketType, Foto } from '../../types'

const bucketDetails: Record<
  BucketType,
  { title: string; description: string; color: string; badge?: string }
> = {
  capture: {
    title: 'Capture',
    description: 'Originales RAW • Visibilidad interna',
    color: 'border-bucket-capture',
  },
  index: {
    title: 'Index',
    description: 'Fotos finales para cliente • AI tagging automático',
    color: 'border-bucket-index',
    badge: 'Customer-Facing',
  },
  selects: {
    title: 'Selects',
    description: 'Preselección editorial interna',
    color: 'border-bucket-selects',
  },
  trash: {
    title: 'Trash',
    description: 'Descartadas o con problemas técnicos',
    color: 'border-bucket-trash',
  },
}

const tabs = [
  { id: 'upload', label: 'Subir fotos' },
  { id: 'gallery', label: 'Ver fotos por bucket' },
  { id: 'insights', label: 'AI Insights Dashboard' },
  { id: 'info', label: 'Información de la sesión' },
] as const

export const AdminBookingDetailPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>()
  const getBookingById = useBookingStore((state) => state.getBookingById)
  const getFotosByBooking = useFotoStore((state) => state.getFotosByBooking)
  const getBucketMetrics = useFotoStore((state) => state.getBucketMetrics)
  const uploadFotos = useFotoStore((state) => state.uploadFotos)
  const moveFoto = useFotoStore((state) => state.moveFoto)
  const deleteFoto = useFotoStore((state) => state.deleteFoto)
  const uploadQueue = useFotoStore((state) => state.uploadQueue)
  const agregarTagManual = useFotoStore((state) => state.agregarTagManual)
  const quitarTagManual = useFotoStore((state) => state.quitarTagManual)
  const { paquetes } = usePaqueteStore()

  const booking = bookingId ? getBookingById(bookingId) : undefined

  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>('upload')
  const [uploadBucket, setUploadBucket] = useState<BucketType>('index')
  const [galleryBucket, setGalleryBucket] = useState<BucketType>('index')
  const [selectedFoto, setSelectedFoto] = useState<Foto | null>(null)
  const [aiFilters, setAiFilters] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [processingUpload, setProcessingUpload] = useState(false)
  const [manualTagInput, setManualTagInput] = useState<Record<string, string>>({})
  const [integrantes, setIntegrantes] = useState<string[]>([])
  const [nuevoIntegrante, setNuevoIntegrante] = useState('')

  const hasBooking = Boolean(booking && bookingId)

  const bucketMetrics = useMemo(
    () =>
      hasBooking && bookingId
        ? getBucketMetrics(bookingId)
        : { capture: 0, index: 0, selects: 0, trash: 0 },
    [hasBooking, bookingId, getBucketMetrics],
  )

  const fotosBucket = useMemo(
    () =>
      hasBooking && bookingId ? getFotosByBooking(bookingId, galleryBucket) : [],
    [hasBooking, bookingId, galleryBucket, getFotosByBooking],
  )

  const indexFotos = useMemo(
    () => (hasBooking && bookingId ? getFotosByBooking(bookingId, 'index') : []),
    [hasBooking, bookingId, getFotosByBooking],
  )

  const aiTagsAvailable = useMemo(() => {
    const tags = new Set<string>()
    indexFotos.forEach((foto) => {
      foto.ai_tags?.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [indexFotos])

  const filteredFotos = useMemo(() => {
    if (galleryBucket !== 'index' || aiFilters.length === 0) return fotosBucket
    return fotosBucket.filter((foto) =>
      aiFilters.every((tag) => foto.ai_tags?.includes(tag)),
    )
  }, [fotosBucket, galleryBucket, aiFilters])

  const aiSummary = useMemo(() => {
    if (!indexFotos.length) {
      return null
    }
    const total = indexFotos.length
    const avgQuality =
      indexFotos.reduce((acc, foto) => acc + (foto.ai_insights?.quality_score ?? 0), 0) / total
    const avgComposition =
      indexFotos.reduce((acc, foto) => acc + (foto.ai_insights?.composition_score ?? 0), 0) / total
    const closedEyes = indexFotos.filter((foto) => foto.ai_insights?.has_closed_eyes).length
    const blur = indexFotos.filter((foto) => foto.ai_insights?.has_blur).length
    const overExposure = indexFotos.filter((foto) => foto.ai_insights?.has_overexposure).length
    const groupPhotos = indexFotos.filter((foto) => foto.ai_insights?.is_group_photo).length
    return {
      total,
      avgQuality: avgQuality.toFixed(1),
      avgComposition: avgComposition.toFixed(1),
      closedEyes,
      blur,
      overExposure,
      groupPhotos,
    }
  }, [indexFotos])

  const onDrop = async (files: File[]) => {
    if (!files.length || !bookingId) return
    setProcessingUpload(true)
    const uploaded = await uploadFotos(files, bookingId, uploadBucket)
    if (uploadBucket === 'index') {
      toast.success(`Aplicando AI Tagging a ${uploaded} fotos nuevas`)
    } else {
      toast.success(`${uploaded} fotos enviadas a ${uploadBucket.toUpperCase()}`)
    }
    setProcessingUpload(false)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/*': [],
    },
    maxFiles: 100,
  })

  const handleToggleFilter = (tag: string) => {
    setAiFilters((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]))
  }

  const handleMoveFoto = async (targetBucket: BucketType) => {
    if (!selectedFoto || targetBucket === selectedFoto.bucket_tipo) return
    await moveFoto(selectedFoto.id, targetBucket)
    toast.success(`Foto movida a ${targetBucket.toUpperCase()}`)
  }

  const handleDeleteFoto = () => {
    if (!selectedFoto) return
    deleteFoto(selectedFoto.id)
    toast.success('Foto eliminada del bucket')
    setSelectedFoto(null)
  }

  if (!booking || !bookingId) {
    return <Navigate to="/admin/bookings" replace />
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-subtle">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-[10px] uppercase tracking-[0.07em] text-slate-500 transition hover:border-slate-900 hover:text-slate-900"
            >
              <LuArrowLeft /> Volver
            </button>
            <p className="mt-4 text-xs uppercase tracking-[0.10em] text-slate-400">Booking</p>
            <h1 className="mt-2 text-2xl font-semibold uppercase tracking-[0.10em] text-slate-900">
              {booking.nombre_sesion}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="muted">{booking.tipo_sesion}</Badge>
            <Badge tone="primary">{booking.status}</Badge>
            <Badge tone="muted">
              <LuCalendarDays className="mr-2" /> {new Date(booking.fecha_sesion).toLocaleDateString()}
            </Badge>
            <Badge tone="muted">
              <LuMapPin className="mr-2" /> {booking.ubicacion}
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {(['index', 'capture', 'selects', 'trash'] as BucketType[]).map((bucket) => (
            <div
              key={bucket}
              className={`rounded-3xl border-2 bg-white p-5 shadow-sm ${bucketDetails[bucket].color} ${bucket === 'index' ? 'bg-emerald-50/50' : 'border-slate-200'}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.07em] text-slate-400">
                  {bucketDetails[bucket].title}
                </p>
                {bucketDetails[bucket].badge ? <Badge tone="success">{bucketDetails[bucket].badge}</Badge> : null}
              </div>
              <p className="mt-4 text-3xl font-semibold tracking-[0.07em] text-slate-900">
                {bucketMetrics[bucket]}
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.07em] text-slate-400">
                {bucketDetails[bucket].description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Card>
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

        {activeTab === 'upload' ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-6">
              <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6">
                <p className="text-xs uppercase tracking-[0.07em] text-slate-400">
                  Selecciona bucket destino
                </p>
                <div className="grid gap-3">
                  {(['index', 'capture', 'selects', 'trash'] as BucketType[]).map((bucket) => (
                    <label
                      key={bucket}
                      className={`flex cursor-pointer items-start gap-4 rounded-2xl border px-5 py-4 transition ${uploadBucket === bucket ? 'border-slate-900 bg-slate-900/5' : 'border-slate-200 hover:border-slate-900/60'}`}
                    >
                      <input
                        type="radio"
                        className="mt-1"
                        checked={uploadBucket === bucket}
                        onChange={() => setUploadBucket(bucket)}
                      />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.07em] text-slate-800">
                          {bucketDetails[bucket].title}{' '}
                          {bucketDetails[bucket].badge ? (
                            <span className="ml-2 rounded-full bg-emerald-500 px-2 py-1 text-[10px] uppercase tracking-[0.07em] text-white">
                              {bucketDetails[bucket].badge}
                            </span>
                          ) : null}
                        </p>
                        <p className="mt-2 text-[11px] uppercase tracking-[0.08em] text-slate-500">
                          {bucketDetails[bucket].description}
                        </p>
                        {bucket === 'index' ? (
                          <p className="mt-2 text-[10px] uppercase tracking-[0.08em] text-emerald-500">
                            ✓ AI Tagging automático • ✓ Visible para cliente • ✓ Descargable
                          </p>
                        ) : null}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div
                {...getRootProps()}
                className={`flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed ${isDragActive ? 'border-slate-900 bg-slate-100' : 'border-slate-300 bg-slate-50'} px-6 text-center transition hover:border-slate-900 hover:bg-slate-100`}
              >
                <input {...getInputProps()} />
                <LuCloudUpload className="text-3xl text-slate-400" />
                <p className="mt-4 text-xs uppercase tracking-[0.07em] text-slate-500">
                  Arrastra archivos aquí o haz click para seleccionar
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.08em] text-slate-400">
                  Formatos: JPG, PNG, RAW • Máximo 100 archivos
                </p>
                {uploadBucket === 'index' ? (
                  <p className="mt-3 text-[10px] uppercase tracking-[0.08em] text-emerald-500">
                    Aplicaremos AI Tagging inteligente al finalizar la subida
                  </p>
                ) : null}
                {processingUpload ? (
                  <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-[10px] uppercase tracking-[0.07em] text-white">
                    <LuLoader className="animate-spin" /> Procesando archivos…
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.07em] text-slate-400">
                Cola de subida
              </p>
              <div className="mt-6 space-y-4">
                {uploadQueue.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-[10px] uppercase tracking-[0.07em] text-slate-400">
                    Selecciona archivos para comenzar la simulación de subida.
                  </div>
                ) : null}
                {uploadQueue.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs uppercase tracking-[0.08em] text-slate-500"
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.fileName}</span>
                      <Badge tone="muted">{item.bucket}</Badge>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-slate-900 transition-all"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.08em] text-slate-400">
                      {item.status === 'uploading'
                        ? 'Subiendo…'
                        : item.status === 'processing'
                          ? 'Aplicando AI...'
                          : item.status === 'done'
                            ? 'Completado'
                            : 'Pendiente'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === 'gallery' ? (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-3">
                {(['index', 'capture', 'selects', 'trash'] as BucketType[]).map((bucket) => (
                  <button
                    key={bucket}
                    onClick={() => {
                      setGalleryBucket(bucket)
                      setAiFilters([])
                    }}
                    className={`rounded-full px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.07em] transition ${galleryBucket === bucket ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}
                  >
                    {bucketDetails[bucket].title}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.08em] ${viewMode === 'grid' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-500'}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.08em] ${viewMode === 'list' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-500'}`}
                >
                  Lista
                </button>
              </div>
            </div>

            {galleryBucket === 'index' ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <p className="text-xs uppercase tracking-[0.07em] text-slate-400">
                  Filtros inteligentes AI
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {aiTagsAvailable.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleToggleFilter(tag)}
                      className={`rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.07em] transition ${aiFilters.includes(tag) ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {viewMode === 'grid' ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredFotos.map((foto) => (
                  <div
                    key={foto.id}
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-slate-900"
                    onClick={() => {
                      setSelectedFoto(foto)
                    }}
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={foto.url_miniatura}
                        alt={foto.nombre_archivo}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                      <div className="absolute left-3 top-3">
                        <Badge tone={foto.bucket_tipo === 'index' ? 'success' : 'muted'}>
                          {foto.bucket_tipo}
                        </Badge>
                      </div>
                      {foto.ai_insights?.has_closed_eyes || foto.ai_insights?.has_blur ? (
                        <div className="absolute bottom-3 left-3 rounded-full bg-rose-500 px-3 py-1 text-[10px] uppercase tracking-[0.07em] text-white">
                          {foto.ai_insights?.has_closed_eyes ? 'Ojos cerrados' : 'Revisar'}
                        </div>
                      ) : null}
                    </div>
                    <div className="space-y-3 px-4 py-3 text-[10px] uppercase tracking-[0.07em] text-slate-500">
                      <p className="text-slate-700">{foto.nombre_archivo}</p>
                      {foto.ai_tags?.length ? (
                        <div className="flex flex-wrap gap-1">
                          {foto.ai_tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="rounded-full bg-slate-900 px-2 py-1 text-white">
                              #{tag}
                            </span>
                          ))}
                          {foto.ai_tags.length > 4 ? <span>+{foto.ai_tags.length - 4}</span> : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-3xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50 text-[10px] uppercase tracking-[0.07em] text-slate-400">
                    <tr>
                      <th className="px-4 py-4 text-left">Foto</th>
                      <th className="px-4 py-4 text-left">Bucket</th>
                      <th className="px-4 py-4 text-left">Quality</th>
                      <th className="px-4 py-4 text-left">Tags</th>
                      <th className="px-4 py-4 text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-xs uppercase tracking-[0.08em] text-slate-600">
                    {filteredFotos.map((foto) => (
                      <tr key={foto.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={foto.url_miniatura}
                              alt={foto.nombre_archivo}
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-semibold tracking-[0.07em] text-slate-800">
                                {foto.nombre_archivo}
                              </p>
                              <p className="text-[10px] uppercase tracking-[0.08em] text-slate-400">
                                {(foto.tamano_bytes / 1_000_000).toFixed(1)} MB
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge tone={foto.bucket_tipo === 'index' ? 'success' : 'muted'}>
                            {foto.bucket_tipo}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          {foto.ai_insights
                            ? `${foto.ai_insights.quality_score}/10`
                            : 'N/A'}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1">
                            {foto.ai_tags?.slice(0, 3).map((tag) => (
                              <span key={tag} className="rounded-full bg-slate-900 px-2 py-1 text-white">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            onClick={() => setSelectedFoto(foto)}
                            className="rounded-full bg-slate-900 px-4 py-2 text-[10px] uppercase tracking-[0.07em] text-white"
                          >
                            Ver detalles
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filteredFotos.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-xs uppercase tracking-[0.07em] text-slate-400">
                No hay fotos en este bucket con los filtros seleccionados.
              </div>
            ) : null}
          </div>
        ) : null}

        {activeTab === 'insights' ? (
          <div className="mt-8 space-y-6">
            {aiSummary ? (
              <>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  <div className="rounded-3xl border border-slate-200 bg-white p-6">
                    <p className="text-xs uppercase tracking-[0.07em] text-slate-400">
                      Total fotos analizadas
                    </p>
                    <p className="mt-3 text-3xl font-semibold tracking-[0.07em] text-slate-900">
                      {aiSummary.total}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-6">
                    <p className="text-xs uppercase tracking-[0.07em] text-slate-400">
                      Promedio quality score
                    </p>
                    <p className="mt-3 text-3xl font-semibold tracking-[0.07em] text-emerald-600">
                      {aiSummary.avgQuality}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-6">
                    <p className="text-xs uppercase tracking-[0.07em] text-slate-400">
                      Promedio composition score
                    </p>
                    <p className="mt-3 text-3xl font-semibold tracking-[0.07em] text-emerald-600">
                      {aiSummary.avgComposition}
                    </p>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-emerald-50 p-6">
                    <p className="text-xs uppercase tracking-[0.07em] text-emerald-500">
                      Problemas detectados
                    </p>
                    <ul className="mt-4 space-y-2 text-xs uppercase tracking-[0.08em] text-emerald-700">
                      <li>• {aiSummary.closedEyes} fotos con ojos cerrados</li>
                      <li>• {aiSummary.blur} fotos con posible blur</li>
                      <li>• {aiSummary.overExposure} fotos con sobreexposición</li>
                    </ul>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <p className="text-xs uppercase tracking-[0.07em] text-slate-500">
                      Composición del set
                    </p>
                    <ul className="mt-4 space-y-2 text-xs uppercase tracking-[0.08em] text-slate-600">
                      <li>• {aiSummary.groupPhotos} fotos de grupo</li>
                      <li>• {aiSummary.total - aiSummary.groupPhotos} fotos individuales</li>
                      <li>• {aiSummary.total} fotos disponibles para cliente</li>
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-xs uppercase tracking-[0.07em] text-slate-400">
                Este booking aún no tiene fotos en INDEX analizadas por IA.
              </div>
            )}
          </div>
        ) : null}

        {activeTab === 'info' ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-xs uppercase tracking-[0.08em] text-slate-500">
                <p className="text-slate-400">Resumen de sesión</p>
                <div className="mt-4 space-y-3 text-slate-600">
                  <p>Creada: {new Date(booking.fecha_creacion).toLocaleDateString()}</p>
                  <p>
                    Entrega:{' '}
                    {booking.fecha_entrega ? new Date(booking.fecha_entrega).toLocaleDateString() : 'Pendiente'}
                  </p>
                  <p>Fotos capturadas: {booking.total_fotos_capturadas}</p>
                  <p>Fotos procesadas: {booking.total_fotos_procesadas}</p>
                  <p>Fotos customer-facing: {booking.total_fotos_customer_facing}</p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <p className="text-xs uppercase tracking-[0.07em] text-slate-400">Paquete de servicio</p>
                <select
                  className="mt-4 w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.07em] text-slate-600 outline-none transition focus:border-slate-900"
                  value={booking.paquete_id || ''}
                  onChange={(e) => {
                    // TODO: Implementar actualización de paquete en booking
                    toast.info('Actualización de paquete pendiente de implementación')
                  }}
                >
                  <option value="">Sin paquete asignado</option>
                  {paquetes
                    .filter((p) => p.activo)
                    .map((paquete) => (
                      <option key={paquete.id} value={paquete.id}>
                        {paquete.nombre} ({paquete.fotos_incluidas} fotos)
                      </option>
                    ))}
                </select>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <p className="text-xs uppercase tracking-[0.07em] text-slate-400">Autorizaciones</p>
                <div className="mt-4 space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={booking.rrss_authorized}
                      onChange={(e) => {
                        // TODO: Implementar actualización de autorización
                        toast.info('Actualización de autorización pendiente de implementación')
                      }}
                      className="h-4 w-4 rounded border-slate-200"
                    />
                    <span className="text-xs uppercase tracking-[0.07em] text-slate-600">
                      Autorizado para Redes Sociales
                    </span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={booking.banco_imagenes_authorized}
                      onChange={(e) => {
                        // TODO: Implementar actualización de autorización
                        toast.info('Actualización de autorización pendiente de implementación')
                      }}
                      className="h-4 w-4 rounded border-slate-200"
                    />
                    <span className="text-xs uppercase tracking-[0.07em] text-slate-600">
                      Autorizado para Banco de Imágenes
                    </span>
                  </label>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <p className="text-xs uppercase tracking-[0.07em] text-slate-400">Integrantes de sesión</p>
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={nuevoIntegrante}
                    onChange={(e) => setNuevoIntegrante(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && nuevoIntegrante.trim()) {
                        setIntegrantes([...integrantes, nuevoIntegrante.trim()])
                        setNuevoIntegrante('')
                      }
                    }}
                    placeholder="Nombre del integrante"
                    className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.07em] text-slate-600 outline-none transition focus:border-slate-900"
                  />
                  <Button
                    tone="secondary"
                    size="sm"
                    onClick={() => {
                      if (nuevoIntegrante.trim()) {
                        setIntegrantes([...integrantes, nuevoIntegrante.trim()])
                        setNuevoIntegrante('')
                      }
                    }}
                  >
                    Agregar
                  </Button>
                </div>
                {integrantes.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {integrantes.map((integrante, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.07em] text-slate-700"
                      >
                        {integrante}
                        <button
                          onClick={() => setIntegrantes(integrantes.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <p className="text-xs uppercase tracking-[0.07em] text-slate-400">Notas internas</p>
                <textarea
                  className="mt-4 h-40 w-full rounded-3xl border border-slate-200 bg-slate-50 p-5 text-xs uppercase tracking-[0.08em] text-slate-600 outline-none transition focus:border-slate-900"
                  defaultValue={booking.notas_internas}
                />
                <Button
                  tone="ghost"
                  size="sm"
                  className="mt-4"
                  iconLeft={<LuSettings2 />}
                >
                  Guardar ajustes
                </Button>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <p className="text-xs uppercase tracking-[0.07em] text-slate-400">Tags manuales en fotos</p>
                <p className="mt-2 text-[10px] text-slate-500">
                  Agrega tags manuales a las fotos seleccionadas desde la galería
                </p>
                <div className="mt-4 space-y-2">
                  {indexFotos.slice(0, 5).map((foto) => (
                    <div key={foto.id} className="flex items-center gap-2">
                      <span className="flex-1 truncate text-xs text-slate-600">{foto.nombre_archivo}</span>
                      <input
                        type="text"
                        value={manualTagInput[foto.id] || ''}
                        onChange={(e) => setManualTagInput({ ...manualTagInput, [foto.id]: e.target.value })}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && manualTagInput[foto.id]?.trim()) {
                            agregarTagManual(foto.id, manualTagInput[foto.id].trim())
                            setManualTagInput({ ...manualTagInput, [foto.id]: '' })
                            toast.success('Tag agregado')
                          }
                        }}
                        placeholder="Tag manual"
                        className="w-32 rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.07em] text-slate-600 outline-none transition focus:border-slate-900"
                      />
                    </div>
                  ))}
                </div>
                {indexFotos.length > 5 && (
                  <p className="mt-2 text-[10px] text-slate-400">
                    Mostrando 5 de {indexFotos.length} fotos. Selecciona una foto en la galería para agregar tags.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </Card>

      <PhotoModal
        foto={selectedFoto}
        isOpen={Boolean(selectedFoto)}
        onClose={() => setSelectedFoto(null)}
        onMoveBucket={handleMoveFoto}
        onDelete={handleDeleteFoto}
      />
    </div>
  )
}

export default AdminBookingDetailPage

