import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { LuDownload, LuHeart, LuMessageSquare, LuMoveRight, LuShoppingCart, LuTrash2, LuX } from 'react-icons/lu'
import Badge from '../common/Badge'
import Button from '../common/Button'
import type { BucketType, Foto } from '../../types'

interface PhotoModalProps {
  foto: Foto | null
  isOpen: boolean
  onClose: () => void
  onMoveBucket?: (bucket: BucketType) => void
  onDelete?: () => void
  allowBucketChange?: boolean
  buckets?: BucketType[]
  clientView?: boolean
  onToggleFavorite?: () => void
  onToggleCarrito?: () => void
  estaEnCarrito?: boolean
  onAgregarComentario?: (texto: string) => void
  carrito?: unknown[]
}

const bucketLabels: Record<
  BucketType,
  { label: string; description: string; tone: 'muted' | 'success' | 'blue' | 'danger' }
> = {
  capture: {
    label: 'Capture',
    description: 'Originales RAW • Visibilidad interna',
    tone: 'muted',
  },
  index: {
    label: 'Index',
    description: 'Fotos finales • Customer-facing',
    tone: 'success',
  },
  selects: {
    label: 'Selects',
    description: 'Preselección antes del retoque',
    tone: 'blue',
  },
  trash: {
    label: 'Trash',
    description: 'Descartadas o con problemas',
    tone: 'danger',
  },
}

export const PhotoModal = ({
  foto,
  isOpen,
  onClose,
  onMoveBucket,
  onDelete,
  allowBucketChange = true,
  buckets = ['index', 'capture', 'selects', 'trash'],
  clientView = false,
  onToggleFavorite,
  onToggleCarrito,
  estaEnCarrito = false,
  onAgregarComentario,
}: PhotoModalProps) => {
  const [targetBucket, setTargetBucket] = useState<BucketType>(foto?.bucket_tipo ?? 'index')
  const [nuevoComentario, setNuevoComentario] = useState('')

  useEffect(() => {
    if (foto) {
      setTargetBucket(foto.bucket_tipo)
    }
  }, [foto])

  if (!foto) return null

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = foto.url_original
    link.download = foto.nombre_archivo
    link.click()
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="grid max-h-[90vh] w-full max-w-6xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-[2fr,1fr]">
            <div className="relative flex items-center justify-center bg-slate-950">
              <button
                onClick={onClose}
                className="absolute left-4 top-4 inline-flex items-center rounded-full border border-white/20 px-3 py-2 text-xs uppercase tracking-[0.08em] text-white transition hover:bg-white/10"
              >
                <LuX /> Cerrar
              </button>
              <img src={foto.url_original} alt={foto.nombre_archivo} className="max-h-full max-w-full object-contain" />
              <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-full border border-white/20 bg-black/50 px-5 py-3 text-[10px] uppercase tracking-[0.07em] text-white">
                {BucketBadge(foto.bucket_tipo)}
                {foto.formato.toUpperCase()} • {(foto.tamano_bytes / 1_000_000).toFixed(1)} MB
              </div>
            </div>
            <div className="flex h-full flex-col overflow-y-auto bg-white">
              <div className="border-b border-slate-200 p-6">
                <p className="text-[10px] uppercase tracking-[0.07em] text-slate-400">
                  {foto.nombre_archivo}
                </p>
                <h2 className="mt-3 text-xl font-semibold uppercase tracking-[0.07em] text-slate-900">
                  Información detallada
                </h2>
                <p className="mt-2 text-xs uppercase tracking-[0.08em] text-slate-500">
                  Subida {new Date(foto.fecha_subida).toLocaleDateString()}
                </p>
              </div>
              <div className="flex-1 space-y-6 overflow-y-auto p-6">
                {foto.ai_insights ? (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.07em] text-slate-400">
                      AI Insights
                    </p>
                    <div className="mt-4 grid gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs uppercase tracking-[0.08em] text-emerald-600">
                      <span>Caras detectadas: {foto.ai_insights.faces_count}</span>
                      <span>Quality score: {foto.ai_insights.quality_score}/10</span>
                      <span>Composition score: {foto.ai_insights.composition_score}/10</span>
                      <span>Escena: {foto.ai_insights.scene_type}</span>
                      <span>Iluminación: {foto.ai_insights.lighting_type}</span>
                      <span>Categoria sugerida: {foto.ai_insights.suggested_category}</span>
                      <span>Mood: {foto.ai_insights.mood}</span>
                      {foto.ai_insights.has_closed_eyes ? (
                        <span className="text-rose-500">⚠ Ojos cerrados detectados</span>
                      ) : null}
                      {foto.ai_insights.has_blur ? (
                        <span className="text-rose-500">⚠ Posible desenfoque</span>
                      ) : null}
                      {foto.ai_insights.has_overexposure ? (
                        <span className="text-rose-500">⚠ Sobreexposición detectada</span>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs uppercase tracking-[0.08em] text-slate-500">
                    AI insights no disponibles para este bucket. Solo INDEX ejecuta etiquetado automático.
                  </div>
                )}
                {foto.ai_tags?.length ? (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.07em] text-slate-400">
                      AI tags automáticos
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {foto.ai_tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-slate-900 px-4 py-2 text-[10px] uppercase tracking-[0.07em] text-white"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {foto.ai_insights?.dominant_colors?.length ? (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.07em] text-slate-400">
                      Colores dominantes
                    </p>
                    <div className="mt-4 flex gap-2">
                      {foto.ai_insights.dominant_colors.map((color) => (
                        <div key={color} className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.08em] text-slate-500">
                          <span
                            className="h-10 w-10 rounded-full border border-slate-200"
                            style={{ backgroundColor: color }}
                          />
                          {color}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                {clientView ? (
                  <div className="border-t border-slate-200 pt-6">
                    <div className="mb-4 flex items-center gap-2">
                      <LuMessageSquare className="h-4 w-4 text-slate-400" />
                      <p className="text-[10px] font-semibold uppercase tracking-[0.07em] text-slate-400">
                        Comentarios {foto.comentarios && foto.comentarios.length > 0 ? `(${foto.comentarios.length})` : ''}
                      </p>
                    </div>
                    <div className="max-h-64 space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      {foto.comentarios && foto.comentarios.length > 0 ? (
                        foto.comentarios.map((comentario) => (
                          <div
                            key={comentario.id}
                            className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-slate-800">{comentario.autor}</span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(comentario.fecha).toLocaleDateString('es-MX', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed">{comentario.texto}</p>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center text-xs text-slate-400">
                          <LuMessageSquare className="mx-auto h-8 w-8 mb-2 opacity-50" />
                          <p>No hay comentarios aún</p>
                          <p className="mt-1 text-[10px]">Sé el primero en comentar</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
                {clientView && onAgregarComentario ? (
                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={nuevoComentario}
                        onChange={(e) => setNuevoComentario(e.target.value)}
                        placeholder="Escribe un comentario..."
                        className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-xs text-slate-700 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && nuevoComentario.trim()) {
                            onAgregarComentario(nuevoComentario.trim())
                            setNuevoComentario('')
                          }
                        }}
                      />
                      <Button
                        tone="primary"
                        size="sm"
                        iconLeft={<LuMessageSquare />}
                        onClick={() => {
                          if (nuevoComentario.trim()) {
                            onAgregarComentario(nuevoComentario.trim())
                            setNuevoComentario('')
                          }
                        }}
                        disabled={!nuevoComentario.trim()}
                      >
                        Enviar
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="flex gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5">
                {clientView && onToggleFavorite ? (
                  <Button
                    tone={foto.is_favorite ? 'danger' : 'secondary'}
                    size="sm"
                    iconLeft={<LuHeart className={foto.is_favorite ? 'fill-current' : ''} />}
                    onClick={onToggleFavorite}
                  >
                    {foto.is_favorite ? 'Quitar favorito' : 'Marcar favorito'}
                  </Button>
                ) : null}
                {clientView && onToggleCarrito ? (
                  <Button
                    tone={estaEnCarrito ? 'primary' : 'secondary'}
                    size="sm"
                    iconLeft={<LuShoppingCart />}
                    onClick={onToggleCarrito}
                  >
                    {estaEnCarrito ? 'Quitar del carrito' : 'Agregar al carrito'}
                  </Button>
                ) : null}
                <Button
                  tone="secondary"
                  size="sm"
                  iconLeft={<LuDownload />}
                  onClick={handleDownload}
                >
                  Descargar
                </Button>
                {!clientView && allowBucketChange ? (
                  <div className="flex flex-1 items-center gap-3">
                    <select
                      className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-[10px] uppercase tracking-[0.08em] text-slate-500 outline-none transition hover:border-slate-900 focus:border-slate-900"
                      value={targetBucket}
                      onChange={(event) => setTargetBucket(event.target.value as BucketType)}
                    >
                      {buckets.map((bucket) => (
                        <option key={bucket} value={bucket}>
                          {bucketLabels[bucket].label}
                        </option>
                      ))}
                    </select>
                    <Button
                      tone="ghost"
                      size="sm"
                      iconLeft={<LuMoveRight />}
                      onClick={() => onMoveBucket?.(targetBucket)}
                    >
                      Mover
                    </Button>
                  </div>
                ) : null}
                {!clientView && onDelete ? (
                  <Button tone="danger" size="sm" iconLeft={<LuTrash2 />} onClick={onDelete}>
                    Eliminar
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

const BucketBadge = (bucket: BucketType) => (
  <Badge
    tone={
      bucket === 'index'
        ? 'success'
        : bucket === 'capture'
          ? 'muted'
          : bucket === 'selects'
            ? 'primary'
            : 'danger'
    }
  >
    {bucketLabels[bucket].label}
  </Badge>
)

export default PhotoModal

