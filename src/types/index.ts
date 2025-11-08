export type SubscriptionStatus = 'free_180_days' | 'premium_annual' | 'expired'

export type ClienteTipo = 'individual' | 'familia' | 'empresa'

export type SessionTipo =
  | 'individual'
  | 'familiar'
  | 'graduacion'
  | 'corporativo'
  | 'evento'
  | 'otro'

export type BookingStatus = 'programado' | 'completado' | 'procesando' | 'entregado'

export type BucketType = 'capture' | 'output' | 'selects' | 'trash'

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

