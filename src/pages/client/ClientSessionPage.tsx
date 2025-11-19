import { useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { LuDownload, LuHeart, LuLayers, LuSearch, LuShoppingCart, LuX } from 'react-icons/lu'
import { toast } from 'sonner'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import { PhotoModal } from '../../components/gallery/PhotoModal'
import { useAuthStore } from '../../stores/authStore'
import { useBookingStore } from '../../stores/bookingStore'
import { useFotoStore } from '../../stores/fotoStore'
import { useCarritoStore } from '../../stores/carritoStore'
import { usePaqueteStore } from '../../stores/paqueteStore'
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
  const { t } = useTranslation()
  const { bookingId } = useParams<{ bookingId: string }>()
  const user = useAuthStore((state) => state.user)
  const getBookingById = useBookingStore((state) => state.getBookingById)
  const fotos = useFotoStore((state) => state.fotos)
  const getFotosByBooking = useFotoStore((state) => state.getFotosByBooking)
  const toggleFavorite = useFotoStore((state) => state.toggleFavorite)
  const agregarComentario = useFotoStore((state) => state.agregarComentario)
  const carrito = useCarritoStore((state) => state.carrito)
  const agregarAlCarrito = useCarritoStore((state) => state.agregarAlCarrito)
  const quitarDelCarrito = useCarritoStore((state) => state.quitarDelCarrito)
  const getFotosEnCarrito = useCarritoStore((state) => state.getFotosEnCarrito)
  const estaEnCarrito = useCarritoStore((state) => state.estaEnCarrito)
  const getPaqueteById = usePaqueteStore((state) => state.getPaqueteById)

  const missingClient = !user?.clienteId || !bookingId
  const booking = bookingId ? getBookingById(bookingId) : undefined
  const authorized =
    Boolean(user?.clienteId) && Boolean(booking) && booking?.cliente_id === user?.clienteId

  const fotosIndex = useMemo(
    () => (booking && bookingId && authorized ? getFotosByBooking(bookingId, 'index') : []),
    [booking, bookingId, authorized, getFotosByBooking, fotos],
  )
  const [search, setSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [selectedFoto, setSelectedFoto] = useState<Foto | null>(null)
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const fotosEnCarrito = useMemo(
    () => (bookingId && user?.clienteId ? getFotosEnCarrito(bookingId) : []),
    [bookingId, user?.clienteId, getFotosEnCarrito, carrito],
  )

  const paquete = useMemo(
    () => (booking?.paquete_id ? getPaqueteById(booking.paquete_id) : null),
    [booking?.paquete_id, getPaqueteById],
  )

  const fotosExtra = useMemo(() => {
    if (!paquete) return 0
    return Math.max(0, fotosEnCarrito.length - paquete.fotos_incluidas)
  }, [fotosEnCarrito.length, paquete])

  const costoExtra = useMemo(() => {
    if (!paquete || fotosExtra === 0) return 0
    return fotosExtra * paquete.precio_foto_extra
  }, [fotosExtra, paquete])

  const toggleFilter = (tag: string) => {
    setActiveFilters((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    )
  }

  const filteredFotos = useMemo(() => {
    return fotosIndex.filter((foto) => {
      const matchesSearch =
        search.trim().length === 0 ||
        foto.nombre_archivo.toLowerCase().includes(search.toLowerCase())
      const matchesFilters =
        activeFilters.length === 0 ||
        activeFilters.every((tag) => foto.ai_tags?.includes(tag))
      return matchesSearch && matchesFilters
    })
  }, [fotosIndex, search, activeFilters])

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

  const handleToggleCarrito = (fotoId: string) => {
    if (!bookingId || !user?.clienteId) return
    if (estaEnCarrito(fotoId)) {
      quitarDelCarrito(fotoId)
      toast.success('Foto removida del carrito')
    } else {
      agregarAlCarrito(bookingId, fotoId, user.clienteId)
      toast.success('Foto agregada al carrito')
    }
  }

  const handleToggleFavorite = (fotoId: string) => {
    const foto = fotosIndex.find((f) => f.id === fotoId)
    const wasFavorite = foto?.is_favorite
    toggleFavorite(fotoId)
    if (wasFavorite) {
      toast.success('Removida de favoritos')
    } else {
      toast.success('Agregada a favoritos')
    }
  }

  const handleAgregarComentario = (fotoId: string, texto: string) => {
    agregarComentario(fotoId, user?.name || 'Cliente', texto)
    toast.success('Comentario agregado')
  }

  // Forzar re-render cuando cambia el carrito
  const carritoCount = useMemo(
    () => (bookingId ? carrito.filter((item) => item.booking_id === bookingId).length : 0),
    [carrito, bookingId],
  )

  const selectedCount = selectedIds.size

  const handleAgregarSeleccionadasAFavoritos = () => {
    selectedIds.forEach((fotoId) => {
      const foto = fotosIndex.find((f) => f.id === fotoId)
      if (foto && !foto.is_favorite) {
        toggleFavorite(fotoId)
      }
    })
    toast.success(`${selectedIds.size} fotos agregadas a favoritos`)
    setSelectedIds(new Set())
    setSelectionMode(false)
  }

  const handleAgregarSeleccionadasAlCarrito = () => {
    if (!bookingId || !user?.clienteId) return
    let agregadas = 0
    selectedIds.forEach((fotoId) => {
      if (!estaEnCarrito(fotoId)) {
        agregarAlCarrito(bookingId, fotoId, user.clienteId)
        agregadas++
      }
    })
    toast.success(`${agregadas} fotos agregadas al carrito`)
    setSelectedIds(new Set())
    setSelectionMode(false)
  }

  const [showCarritoModal, setShowCarritoModal] = useState(false)

  const handleVerCarrito = () => {
    if (carritoCount > 0) {
      setShowCarritoModal(true)
    } else {
      toast.info('Tu carrito está vacío')
    }
  }

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
          <p className="text-xs uppercase tracking-[0.10em] text-slate-400">Mis sesiones</p>
          <h1 className="mt-3 text-3xl font-semibold uppercase tracking-[0.18em] text-slate-900">
            {booking.nombre_sesion}
          </h1>
          <p className="mt-2 text-[10px] uppercase tracking-[0.07em] text-slate-500">
            {new Date(booking.fecha_sesion).toLocaleDateString()} •{' '}
            {booking.total_fotos_customer_facing} fotografías disponibles
            {paquete && (
              <>
                {' '}• Paquete: {paquete.nombre} ({paquete.fotos_incluidas} fotos incluidas)
              </>
            )}
          </p>
        </div>
        <div className="flex gap-3">
          {carritoCount > 0 && (
            <button
              onClick={handleVerCarrito}
              className="flex items-center gap-2 rounded-full border-2 border-emerald-500 bg-emerald-50 px-5 py-3 text-[10px] uppercase tracking-[0.07em] text-emerald-700 transition hover:border-emerald-600 hover:bg-emerald-100 shadow-md"
            >
              <LuShoppingCart className="text-emerald-600" />
              <span className="font-semibold text-emerald-700">{carritoCount} {t('cart.inCart')}</span>
              {paquete && fotosExtra > 0 && (
                <span className="rounded-full bg-rose-500 px-2 py-1 text-white text-[9px]">
                  +{fotosExtra} extras: ${costoExtra.toLocaleString('es-MX')}
                </span>
              )}
              <span className="text-emerald-600 font-semibold">→ {t('cart.viewCart')}</span>
            </button>
          )}
        <button
          onClick={() => setSelectionMode((prev) => !prev)}
          className={`rounded-full px-5 py-3 text-[10px] uppercase tracking-[0.07em] transition ${selectionMode ? 'bg-slate-900 text-white' : 'border border-slate-200 text-slate-500 hover:border-slate-900 hover:text-slate-900'}`}
        >
            {selectionMode ? t('session.cancelSelection') : t('session.selectPhotos')}
        </button>
        </div>
      </div>

      {selectionMode && selectedCount > 0 ? (
        <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 text-[10px] uppercase tracking-[0.07em] text-slate-600">
          <span>{selectedCount} {t('session.photosSelected')}.</span>
          <Button
            tone="secondary"
            size="sm"
            iconLeft={<LuHeart />}
            onClick={handleAgregarSeleccionadasAFavoritos}
          >
            {t('session.addToFavorites')}
          </Button>
          <Button
            tone="secondary"
            size="sm"
            iconLeft={<LuShoppingCart />}
            onClick={handleAgregarSeleccionadasAlCarrito}
          >
            {t('session.addToCart')}
          </Button>
          <Button
            tone="secondary"
            size="sm"
            iconLeft={<LuDownload />}
            onClick={() => toast.success(t('session.downloadSelected'))}
          >
            {t('session.downloadSelected')}
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
                className="w-full rounded-full border border-slate-200 bg-white py-3 pl-10 pr-3 text-[10px] uppercase tracking-[0.08em] text-slate-600 outline-none transition focus:border-slate-900"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.07em] text-slate-400">Filtros IA</p>
              <div className="mt-4 space-y-4">
                {aiFilterGroups.map((group) => (
                  <div key={group.title}>
                    <p className="text-[10px] uppercase tracking-[0.07em] text-slate-400">
                      {group.title}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {group.tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleFilter(tag)}
                          className={`rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.07em] transition ${activeFilters.includes(tag) ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-[10px] uppercase tracking-[0.07em] text-slate-500">
              <p className="text-slate-400">{t('session.quickActions')}</p>
              <div className="mt-3 space-y-2">
                <button
                  className="w-full rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800"
                  onClick={() => toast.success(t('session.downloadAll'))}
                >
                  {t('session.downloadAll')}
                </button>
                <button
                  className="w-full rounded-full border border-slate-200 px-4 py-2 transition hover:border-slate-900"
                  onClick={() => toast.info(t('session.viewSlideshow'))}
                >
                  {t('session.viewSlideshow')}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.07em] text-slate-400">
              <span>{filteredFotos.length} {t('session.results')}</span>
              <span className="inline-flex items-center gap-2">
                <LuLayers /> {t('session.activeFilters')}: {activeFilters.length}
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
                    <div className="absolute left-3 top-3 flex gap-2">
                    {selectionMode ? (
                        <div className="h-5 w-5 rounded-full border border-white bg-black/30">
                        <div
                          className={`m-1 h-3 w-3 rounded-full ${selected ? 'bg-white' : 'border border-white'}`}
                        />
                      </div>
                    ) : (
                        <>
                        <Badge tone="success">AI</Badge>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleFavorite(foto.id)
                            }}
                            className={`rounded-full p-1.5 transition ${
                              foto.is_favorite
                                ? 'bg-rose-500 text-white'
                                : 'bg-black/30 text-white hover:bg-black/50'
                            }`}
                          >
                            <LuHeart className={`h-3 w-3 ${foto.is_favorite ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleCarrito(foto.id)
                            }}
                            className={`rounded-full p-1.5 transition-all ${
                              estaEnCarrito(foto.id)
                                ? 'bg-emerald-500 text-white shadow-lg scale-110'
                                : 'bg-black/30 text-white hover:bg-black/50'
                            }`}
                            title={estaEnCarrito(foto.id) ? 'Quitar del carrito' : 'Agregar al carrito'}
                          >
                            <LuShoppingCart
                              className={`h-3 w-3 transition-all ${estaEnCarrito(foto.id) ? 'fill-current' : ''}`}
                            />
                          </button>
                        </>
                      )}
                      </div>
                    <div className="space-y-2 px-4 py-3 text-[10px] uppercase tracking-[0.07em] text-slate-500">
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
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-12 text-center text-xs uppercase tracking-[0.07em] text-slate-400">
                {t('session.noResults')}
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
        onToggleFavorite={selectedFoto ? () => handleToggleFavorite(selectedFoto.id) : undefined}
        onToggleCarrito={
          selectedFoto && bookingId && user?.clienteId
            ? () => handleToggleCarrito(selectedFoto.id)
            : undefined
        }
        estaEnCarrito={selectedFoto ? estaEnCarrito(selectedFoto.id) : false}
        carrito={carrito}
        onAgregarComentario={
          selectedFoto ? (texto: string) => handleAgregarComentario(selectedFoto.id, texto) : undefined
        }
      />

      {/* Modal del Carrito */}
      <AnimatePresence>
        {showCarritoModal && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCarritoModal(false)}
          >
            <motion.div
              className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-b border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold uppercase tracking-[0.07em] text-slate-900">
                      {t('cart.title')}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                      <span className="font-semibold">{carritoCount}</span>{' '}
                      {carritoCount === 1 ? t('cart.photos').slice(0, -1) : t('cart.photos')} {t('cart.photosSelected')}
                      {paquete && (
                        <>
                          {' '}• <span className="font-semibold">{paquete.fotos_incluidas}</span>{' '}
                          {t('cart.includedInPackage')}
                          {fotosExtra > 0 && (
                            <span className="ml-2 rounded-full bg-rose-500 px-3 py-1 text-white">
                              {fotosExtra} {t('cart.extras')}: ${costoExtra.toLocaleString('es-MX')}
                            </span>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCarritoModal(false)}
                    className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-slate-900 hover:text-slate-900"
                  >
                    <LuX className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-6">
                {carritoCount === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <LuShoppingCart className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p className="text-sm uppercase tracking-[0.07em]">{t('cart.empty')}</p>
                    <p className="mt-2 text-xs text-slate-500">{t('cart.addPhotos')}</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {fotosEnCarrito.map((fotoId) => {
                      const foto = fotosIndex.find((f) => f.id === fotoId)
                      if (!foto) return null
                      return (
                        <div
                          key={foto.id}
                          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-slate-900"
                        >
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={foto.url_miniatura}
                              alt={foto.nombre_archivo}
                              className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                            />
                            <button
                              onClick={() => {
                                quitarDelCarrito(fotoId)
                                toast.success(t('cart.removedFromCart'))
                              }}
                              className="absolute right-3 top-3 rounded-full bg-rose-500 p-2 text-white opacity-0 transition group-hover:opacity-100"
                            >
                              <LuX className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="p-4 text-[10px] uppercase tracking-[0.07em] text-slate-600">
                            <p className="text-slate-700">{foto.nombre_archivo}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
              {carritoCount > 0 && (
                <div className="border-t border-slate-200 bg-slate-50 p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">
                        {t('cart.total')}: {carritoCount} {carritoCount === 1 ? t('cart.photos').slice(0, -1) : t('cart.photos')}
                      </p>
                      {paquete && (
                        <p className="mt-1 text-sm text-slate-600">
                          {carritoCount <= paquete.fotos_incluidas ? (
                            <span className="text-emerald-600">
                              ✓ {t('cart.includedInPackage')} ({paquete.fotos_incluidas} {t('session.photosIncluded')})
                            </span>
                          ) : (
                            <span className="text-rose-500">
                              {fotosExtra} {t('cart.extras')}: ${costoExtra.toLocaleString('es-MX')}
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <Button
                        tone="secondary"
                        size="sm"
                        onClick={() => {
                          fotosEnCarrito.forEach((fotoId) => quitarDelCarrito(fotoId))
                          toast.success(t('cart.cartEmptied'))
                          setShowCarritoModal(false)
                        }}
                      >
                        {t('cart.emptyCart')}
                      </Button>
                      <Button
                        tone="primary"
                        size="sm"
                        onClick={() => {
                          if (paquete && fotosExtra > 0) {
                            toast.success(
                              `${t('cart.selectionFinalized')} ${fotosExtra} ${t('cart.extras')}: $${costoExtra.toLocaleString('es-MX')}`,
                            )
                          } else {
                            toast.success(t('cart.selectionFinalized'))
                          }
                          setShowCarritoModal(false)
                        }}
                      >
                        {t('cart.finalizeSelection')}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ClientSessionPage

