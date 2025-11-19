import { create } from 'zustand'
import { formatISO } from 'date-fns'
import { mockFotos } from '../data/mockData'
import type { BucketType, Foto, UploadQueueItem } from '../types'
import { generateAITags } from '../utils/ai'
import { useBookingStore } from './bookingStore'

interface FotoStoreState {
  fotos: Foto[]
  loading: boolean
  initialized: boolean
  uploadQueue: UploadQueueItem[]
  fetchFotos: () => Promise<void>
  clearQueue: () => void
  getFotosByBooking: (bookingId: string, bucket?: BucketType) => Foto[]
  getFotosByBucket: (bucket: BucketType) => Foto[]
  getIndexFotos: () => Foto[]
  getBucketMetrics: (bookingId: string) => Record<BucketType, number>
  uploadFotos: (files: File[], bookingId: string, bucket: BucketType) => Promise<number>
  moveFoto: (fotoId: string, targetBucket: BucketType) => Promise<void>
  deleteFoto: (fotoId: string) => void
  toggleFavorite: (fotoId: string) => void
  agregarComentario: (fotoId: string, autor: string, texto: string) => void
  agregarTagManual: (fotoId: string, tag: string) => void
  quitarTagManual: (fotoId: string, tag: string) => void
}

const generateSeededUrls = (seed: string) => ({
  thumb: `https://picsum.photos/seed/${seed}/200/200`,
  medium: `https://picsum.photos/seed/${seed}/800/600`,
  full: `https://picsum.photos/seed/${seed}/1920/1080`,
})

const createFotoFromFile = async (params: {
  fileName: string
  size: number
  bookingId: string
  bucket: BucketType
  seed: string
}): Promise<Foto> => {
  const { fileName, size, bookingId, bucket, seed } = params
  const urls = generateSeededUrls(seed)
  const baseFoto: Foto = {
    id: `upload_${seed}`,
    booking_id: bookingId,
    nombre_archivo: fileName,
    bucket_tipo: bucket,
    is_customer_facing: bucket === 'index',
    url_miniatura: urls.thumb,
    url_medium: urls.medium,
    url_original: urls.full,
    formato: fileName.toLowerCase().endsWith('.png') ? 'png' : 'jpg',
    tamano_bytes: size,
    fecha_captura: null,
    fecha_subida: formatISO(new Date()),
    ai_tags: [],
    ai_insights: null,
    is_favorite: false,
    comentarios: [],
    tags_manuales: [],
  }

  if (bucket !== 'index') {
    return baseFoto
  }

  const { tags, insights } = await generateAITags(seed)

  return {
    ...baseFoto,
    ai_tags: tags,
    ai_insights: insights,
  }
}

export const useFotoStore = create<FotoStoreState>((set, get) => ({
  fotos: [],
  loading: false,
  initialized: false,
  uploadQueue: [],
  fetchFotos: async () => {
    if (get().initialized) return
    set({ loading: true })
    await new Promise((resolve) => setTimeout(resolve, 450))
    set({ fotos: mockFotos, loading: false, initialized: true })
  },
  clearQueue: () =>
    set((state) => {
      state.uploadQueue.forEach((queueItem) => {
        if (queueItem.previewUrl) URL.revokeObjectURL(queueItem.previewUrl)
      })
      return { uploadQueue: [] }
    }),
  getFotosByBooking: (bookingId, bucket) =>
    get().fotos.filter(
      (foto) => foto.booking_id === bookingId && (!bucket || foto.bucket_tipo === bucket),
    ),
  getFotosByBucket: (bucket) => get().fotos.filter((foto) => foto.bucket_tipo === bucket),
  getIndexFotos: () => get().fotos.filter((foto) => foto.bucket_tipo === 'index'),
  getBucketMetrics: (bookingId) => {
    const metrics: Record<BucketType, number> = {
      capture: 0,
      index: 0,
      selects: 0,
      trash: 0,
    }
    get()
      .fotos.filter((foto) => foto.booking_id === bookingId)
      .forEach((foto) => {
        metrics[foto.bucket_tipo] += 1
      })
    return metrics
  },
  uploadFotos: async (files, bookingId, bucket) => {
    if (!files.length) return 0
    const queueItems: UploadQueueItem[] = files.map((file, idx) => ({
      id: `${bookingId}_${Date.now()}_${idx}`,
      fileName: file.name,
      size: file.size,
      bucket,
      progress: 0,
      status: 'pending',
      previewUrl: URL.createObjectURL(file),
    }))

    set((state) => ({ uploadQueue: [...state.uploadQueue, ...queueItems] }))

    const updatedFotos: Foto[] = []

    await Promise.all(
      queueItems.map(
        (item, idx) =>
          new Promise<void>((resolve) => {
            const file = files[idx]
            const duration = Math.max(600, Math.min(2200, file.size / 400))
            const startTime = Date.now()
            set((state) => ({
              uploadQueue: state.uploadQueue.map((queueItem) =>
                queueItem.id === item.id ? { ...queueItem, status: 'uploading' } : queueItem,
              ),
            }))

            const tick = () => {
              const elapsed = Date.now() - startTime
              const progress = Math.min(100, Math.round((elapsed / duration) * 100))
              set((state) => ({
                uploadQueue: state.uploadQueue.map((queueItem) =>
                  queueItem.id === item.id ? { ...queueItem, progress } : queueItem,
                ),
              }))

              if (progress >= 100) {
                set((state) => ({
                  uploadQueue: state.uploadQueue.map((queueItem) =>
                    queueItem.id === item.id ? { ...queueItem, status: 'processing' } : queueItem,
                  ),
                }))

                createFotoFromFile({
                  fileName: file.name,
                  size: file.size,
                  bookingId,
                  bucket,
                  seed: item.id,
                }).then((foto) => {
                  updatedFotos.push(foto)
                  set((state) => ({
                    fotos: [...state.fotos, foto],
                    uploadQueue: state.uploadQueue.map((queueItem) =>
                      queueItem.id === item.id
                        ? { ...queueItem, status: 'done', progress: 100 }
                        : queueItem,
                    ),
                  }))

                  const bookingStore = useBookingStore.getState()
                  const booking = bookingStore.getBookingById(bookingId)
                  if (booking) {
                    const bookingFotos = get().fotos.filter((f) => f.booking_id === bookingId)
                    const indexCount = bookingFotos.filter((f) => f.bucket_tipo === 'index').length
                    const processedCount = bookingFotos.filter((f) => f.bucket_tipo !== 'trash').length
                    bookingStore.updateBookingCounts(bookingId, {
                      total_fotos_customer_facing:
                        bucket === 'index' ? indexCount : booking.total_fotos_customer_facing,
                      total_fotos_procesadas: processedCount,
                    })
                  }

                  resolve()
                })
              } else {
                requestAnimationFrame(tick)
              }
            }

            requestAnimationFrame(tick)
          }),
      ),
    )

    set((state) => {
      state.uploadQueue
        .filter((queueItem) => queueItem.status === 'done')
        .forEach((queueItem) => {
          if (queueItem.previewUrl) URL.revokeObjectURL(queueItem.previewUrl)
        })
      return {
        uploadQueue: state.uploadQueue.filter((queueItem) => queueItem.status !== 'done'),
      }
    })

    return updatedFotos.length
  },
  moveFoto: async (fotoId, targetBucket) => {
    const currentFoto = get().fotos.find((foto) => foto.id === fotoId)
    if (!currentFoto || currentFoto.bucket_tipo === targetBucket) return

    let updatedFoto: Foto = {
      ...currentFoto,
      bucket_tipo: targetBucket,
      is_customer_facing: targetBucket === 'index',
      ai_tags: targetBucket === 'index' ? currentFoto.ai_tags : [],
      ai_insights: targetBucket === 'index' ? currentFoto.ai_insights : null,
    }

    if (targetBucket === 'index' && !currentFoto.ai_insights) {
      const { tags, insights } = await generateAITags(`${fotoId}_${Date.now()}`)
      updatedFoto = {
        ...updatedFoto,
        ai_tags: tags,
        ai_insights: insights,
      }
    }

    if (targetBucket !== 'index') {
      updatedFoto = {
        ...updatedFoto,
        ai_tags: [],
        ai_insights: null,
      }
    }

    set((state) => ({
      fotos: state.fotos.map((foto) => (foto.id === fotoId ? updatedFoto : foto)),
    }))
  },
  deleteFoto: (fotoId) => {
    set((state) => ({
      fotos: state.fotos.filter((foto) => foto.id !== fotoId),
    }))
  },
  toggleFavorite: (fotoId) => {
    set((state) => ({
      fotos: state.fotos.map((foto) =>
        foto.id === fotoId ? { ...foto, is_favorite: !foto.is_favorite } : foto,
      ),
    }))
  },
  agregarComentario: (fotoId, autor, texto) => {
    const nuevoComentario = {
      id: `com_${Date.now()}`,
      autor,
      texto,
      fecha: formatISO(new Date()),
    }
    set((state) => ({
      fotos: state.fotos.map((foto) =>
        foto.id === fotoId
          ? { ...foto, comentarios: [...foto.comentarios, nuevoComentario] }
          : foto,
      ),
    }))
  },
  agregarTagManual: (fotoId, tag) => {
    set((state) => ({
      fotos: state.fotos.map((foto) =>
        foto.id === fotoId && !foto.tags_manuales.includes(tag)
          ? { ...foto, tags_manuales: [...foto.tags_manuales, tag] }
          : foto,
      ),
    }))
  },
  quitarTagManual: (fotoId, tag) => {
    set((state) => ({
      fotos: state.fotos.map((foto) =>
        foto.id === fotoId
          ? { ...foto, tags_manuales: foto.tags_manuales.filter((t) => t !== tag) }
          : foto,
      ),
    }))
  },
}))

