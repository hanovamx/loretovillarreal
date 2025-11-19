export type SubscriptionStatus = 'free_180_days' | 'premium_annual' | 'expired'

export type ClienteTipo = 'individual' | 'familia' | 'empresa'

export type SessionTipo =
  | 'individual'
  | 'familiar'
  | 'graduacion'
  | 'corporativo'
  | 'evento'
  | 'otro'

export type BookingStatus =
  | 'sesion_agendada'
  | 'concluyo_sesion'
  | 'index_preparado'
  | 'index_enviado'
  | 'seleccion_cliente'
  | 'fotos_extra'
  | 'produccion'
  | 'edicion_vobo'
  | 'enviado_impresion'
  | 'fotos_en_estudio'
  | 'entregado'

export type BucketType = 'capture' | 'index' | 'selects' | 'trash'

export interface Cliente {
  id: string
  nombre_completo: string
  email: string
  telefono: string
  fecha_registro: string
  tipo_cliente: ClienteTipo
  status_subscription: SubscriptionStatus
  password_temporal: string
  total_bookings: number
  total_fotos: number
  ultimo_booking: string | null
}

export interface Booking {
  id: string
  cliente_id: string
  nombre_sesion: string
  fecha_sesion: string
  tipo_sesion: SessionTipo
  ubicacion: string
  status: BookingStatus
  total_fotos_capturadas: number
  total_fotos_procesadas: number
  total_fotos_customer_facing: number
  fecha_creacion: string
  fecha_entrega: string | null
  notas_internas: string
  paquete_id: string | null
  rrss_authorized: boolean
  banco_imagenes_authorized: boolean
  fotos_extra_count: number
  costo_extra: number
}

export interface AIInsights {
  faces_count: number
  face_ids: string[]
  quality_score: number
  composition_score: number
  has_closed_eyes: boolean
  has_blur: boolean
  has_technical_issues: boolean
  is_group_photo: boolean
  dominant_colors: string[]
  scene_type: 'portrait' | 'group' | 'event' | 'product' | 'landscape'
  lighting_type: 'studio' | 'natural' | 'mixed' | 'low_light'
  suggested_category: string
  mood: string
  has_overexposure: boolean
}

export interface Foto {
  id: string
  booking_id: string
  nombre_archivo: string
  bucket_tipo: BucketType
  is_customer_facing: boolean
  url_miniatura: string
  url_medium: string
  url_original: string
  formato: string
  tamano_bytes: number
  fecha_captura: string | null
  fecha_subida: string
  ai_tags: string[]
  ai_insights: AIInsights | null
  is_favorite: boolean
  comentarios: Array<{ id: string; autor: string; texto: string; fecha: string }>
  tags_manuales: string[]
}

export interface FaceProfile {
  id: string
  nombre: string
  thumbnail: string
}

export interface UploadQueueItem {
  id: string
  fileName: string
  size: number
  bucket: BucketType
  progress: number
  status: 'pending' | 'uploading' | 'processing' | 'done'
  previewUrl?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'client'
  clienteId?: string
  subscription?: SubscriptionStatus
}

export interface PaqueteServicio {
  id: string
  nombre: string
  descripcion: string
  fotos_incluidas: number
  precio_base: number
  precio_foto_extra: number
  activo: boolean
  fecha_creacion: string
}

export interface IntegranteSesion {
  id: string
  booking_id: string
  nombre_completo: string
  relacion: string | null
  fecha_creacion: string
}

export interface CarritoSeleccion {
  id: string
  booking_id: string
  foto_id: string
  cliente_id: string
  fecha_agregado: string
}

export interface Suscripcion {
  id: string
  cliente_id: string
  tipo: 'mensual' | 'anual'
  fecha_inicio: string
  fecha_vencimiento: string
  estado: 'activa' | 'vencida' | 'cancelada'
  precio: number
}

