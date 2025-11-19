import { faker } from '@faker-js/faker'
import { differenceInDays, formatISO, subDays } from 'date-fns'
import type {
  Booking,
  BucketType,
  Cliente,
  FaceProfile,
  Foto,
  PaqueteServicio,
  SessionTipo,
  SubscriptionStatus,
} from '../types'
import { generateAITagsSync } from '../utils/ai'
import { randomBool, randomInt, randomItem, sampleSize } from '../utils/random'

faker.seed(2025)

const CLIENT_COUNT = 50
const BOOKING_COUNT = 80
const MIN_INDEX_PHOTOS = 14
const MAX_INDEX_PHOTOS = 28

const estados = ['Nuevo León', 'Ciudad de México', 'Jalisco', 'Querétaro', 'Coahuila'] as const
const ubicaciones = [
  'Estudio Principal',
  'Estudio Norte',
  'Estudio Centro',
  'Locación Exterior',
  'Oficinas Corporativas',
  'Hotel Galerías',
] as const

const sessionTitles: Record<SessionTipo, () => string> = {
  individual: () => `${faker.person.firstName()} ${faker.word.adjective()} Portrait`,
  familiar: () => `${faker.person.lastName()} Family Session`,
  graduacion: () => `${faker.person.firstName()} Graduation Memories`,
  corporativo: () => `${faker.company.name()} Corporate Portraits`,
  evento: () => `${faker.company.buzzAdjective()} Event Coverage`,
  otro: () => `${faker.word.noun()} Creative Session`,
}

const subscriptionDistribution: SubscriptionStatus[] = [
  ...Array(35).fill('free_180_days'),
  ...Array(12).fill('premium_annual'),
  ...Array(3).fill('expired'),
]

const clientTypes: Array<'individual' | 'familia' | 'empresa'> = [
  ...Array(30).fill('individual'),
  ...Array(15).fill('familia'),
  ...Array(5).fill('empresa'),
]

const bookingStatusDistribution: Booking['status'][] = [
  ...Array(50).fill('entregado'),
  ...Array(15).fill('seleccion_cliente'),
  ...Array(10).fill('sesion_agendada'),
  ...Array(5).fill('index_preparado'),
]

const bookingTypeDistribution: SessionTipo[] = [
  ...Array(40).fill('individual'),
  ...Array(20).fill('familiar'),
  ...Array(10).fill('graduacion'),
  ...Array(5).fill('corporativo'),
  ...Array(5).fill('evento'),
]

const faceProfiles: FaceProfile[] = Array.from({ length: 8 }).map((_, idx) => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  return {
    id: `face_${idx + 1}`,
    nombre: `${firstName} ${lastName}`,
    thumbnail: `https://i.pravatar.cc/96?img=${idx + 10}`,
  }
})

const generateCliente = (idx: number): Cliente => {
  const subscription = subscriptionDistribution[idx]
  const tipo = clientTypes[idx]
  const totalBookings = randomInt(1, 5)
  const totalFotos = totalBookings * randomInt(45, 120)
  const lastBookingDate = randomBool(0.85) ? subDays(new Date(), randomInt(5, 220)) : null

  return {
    id: `c${idx + 1}`,
    nombre_completo: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    telefono: faker.helpers.replaceSymbols('+52 (81) ####-####'),
    fecha_registro: formatISO(subDays(new Date(), randomInt(40, 400))),
    tipo_cliente: tipo,
    status_subscription: subscription,
    password_temporal: faker.internet.password({ length: 10 }),
    total_bookings: totalBookings,
    total_fotos: totalFotos,
    ultimo_booking: lastBookingDate ? formatISO(lastBookingDate) : null,
  }
}

const clientes: Cliente[] = Array.from({ length: CLIENT_COUNT }).map((_, idx) => generateCliente(idx))

clientes[0] = {
  ...clientes[0],
  nombre_completo: 'Demo Cliente',
  email: 'cliente.demo@loretovillarreal.studio',
  password_temporal: 'demo123',
  status_subscription: 'free_180_days',
  tipo_cliente: 'individual',
}

const demoCliente = clientes[0]

interface DemoBookingTemplate {
  nombre_sesion: string
  tipo_sesion: SessionTipo
  ubicacion: string
  daysAgo: number
  notas: string
}

const demoBookingTemplates: DemoBookingTemplate[] = [
  {
    nombre_sesion: 'Loreto Villarreal - Colección Fine Art',
    tipo_sesion: 'individual',
    ubicacion: 'Estudio Principal, Monterrey',
    daysAgo: 32,
    notas: 'Selección final aprobada por cliente con énfasis en retratos.',
  },
  {
    nombre_sesion: 'Familia Hernández - Álbum Premium',
    tipo_sesion: 'familiar',
    ubicacion: 'Estudio Norte, San Pedro',
    daysAgo: 76,
    notas: 'Solicitar retoques adicionales en 5 fotografías.',
  },
  {
    nombre_sesion: 'Graduación Tec 2025 - Grupo 12',
    tipo_sesion: 'graduacion',
    ubicacion: 'Campus Monterrey',
    daysAgo: 118,
    notas: 'Pendiente enviar preview para redes sociales.',
  },
]

const generateBooking = (idx: number, cliente: Cliente): Booking => {
  const status = bookingStatusDistribution[idx]
  const tipo = bookingTypeDistribution[idx % bookingTypeDistribution.length]
  const fechaSesion = subDays(new Date(), randomInt(5, 400))
  const delivered = status === 'entregado'
  const totalFotosCapturadas = randomInt(80, 180)
  const totalFotosProcesadas = delivered
    ? randomInt(Math.floor(totalFotosCapturadas * 0.6), totalFotosCapturadas)
    : randomInt(20, 60)
  const totalFotosCustomerFacing = delivered ? randomInt(35, 90) : 0

  return {
    id: `b${idx + 1}`,
    cliente_id: cliente.id,
    nombre_sesion: sessionTitles[tipo](),
    fecha_sesion: formatISO(fechaSesion),
    tipo_sesion: tipo,
    ubicacion: `${randomItem(ubicaciones)}, ${randomItem(estados)}`,
    status,
    total_fotos_capturadas: totalFotosCapturadas,
    total_fotos_procesadas: totalFotosProcesadas,
    total_fotos_customer_facing: totalFotosCustomerFacing,
    fecha_creacion: formatISO(subDays(fechaSesion, randomInt(10, 30))),
    fecha_entrega: delivered ? formatISO(subDays(new Date(), randomInt(2, 60))) : null,
    notas_internas: faker.lorem.sentence(),
    paquete_id: randomBool(0.7) ? `paq_${randomInt(1, 3)}` : null,
    rrss_authorized: randomBool(0.6),
    banco_imagenes_authorized: randomBool(0.4),
    fotos_extra_count: 0,
    costo_extra: 0,
  }
}

const bookings: Booking[] = []
let bookingIndex = 0

demoBookingTemplates.forEach((template) => {
  const idx = bookingIndex++
  const sessionDate = subDays(new Date(), template.daysAgo)
  bookings.push({
    id: `b${idx + 1}`,
    cliente_id: demoCliente.id,
    nombre_sesion: template.nombre_sesion,
    fecha_sesion: formatISO(sessionDate),
    tipo_sesion: template.tipo_sesion,
    ubicacion: template.ubicacion,
    status: 'entregado',
    total_fotos_capturadas: 160,
    total_fotos_procesadas: 120,
    total_fotos_customer_facing: 48,
    fecha_creacion: formatISO(subDays(sessionDate, 14)),
    fecha_entrega: formatISO(subDays(sessionDate, -3)),
    notas_internas: template.notas,
    paquete_id: idx === 0 ? 'paq_2' : idx === 1 ? 'paq_3' : 'paq_1',
    rrss_authorized: true,
    banco_imagenes_authorized: idx === 0,
    fotos_extra_count: 0,
    costo_extra: 0,
  })
})

while (bookingIndex < BOOKING_COUNT) {
  const cliente = randomItem(clientes)
  bookings.push(generateBooking(bookingIndex, cliente))
  bookingIndex += 1
}

const generatePhotoUrlSet = (seed: string) => ({
  thumb: `https://picsum.photos/seed/${seed}/200/200`,
  medium: `https://picsum.photos/seed/${seed}/800/600`,
  full: `https://picsum.photos/seed/${seed}/1920/1080`,
})

const createPhoto = (
  params: {
    bookingId: string
    bucket: BucketType
    index: number
    deliveredIdx: number
    createdAt: string
  },
  withAI = false,
): Foto => {
  const { bookingId, bucket, index, deliveredIdx, createdAt } = params
  const seed = `${bookingId}-${bucket}-${index}-${deliveredIdx}`
  const urls = generatePhotoUrlSet(seed)
  const fileName = `${bookingId}-${bucket}-${String(index).padStart(3, '0')}.jpg`
  const baseFoto: Foto = {
    id: `f_${bookingId}_${bucket}_${index}`,
    booking_id: bookingId,
    nombre_archivo: fileName,
    bucket_tipo: bucket,
    is_customer_facing: bucket === 'index',
    url_miniatura: urls.thumb,
    url_medium: urls.medium,
    url_original: urls.full,
    formato: 'jpg',
    tamano_bytes: randomInt(1_200_000, 4_500_000),
    fecha_captura: randomBool(0.9) ? createdAt : null,
    fecha_subida: formatISO(subDays(new Date(), randomInt(1, 180))),
    ai_tags: [],
    ai_insights: null,
    is_favorite: randomBool(0.1),
    comentarios: randomBool(0.15)
      ? [
          {
            id: `com_${Date.now()}_${index}`,
            autor: 'Cliente Demo',
            texto: 'Me encanta esta foto, ¿pueden retocar el fondo?',
            fecha: formatISO(subDays(new Date(), randomInt(1, 30))),
          },
        ]
      : [],
    tags_manuales: randomBool(0.2) ? [faker.person.firstName()] : [],
  }

  if (!withAI) {
    return baseFoto
  }

  const faceSample = sampleSize(faceProfiles, randomInt(1, Math.min(3, faceProfiles.length)))
  const { tags, insights } = generateAITagsSync(seed)
  insights.face_ids = faceSample.map((face) => face.id)

  return {
    ...baseFoto,
    ai_tags: tags,
    ai_insights: insights,
  }
}

const deliveredBookings = bookings.filter((booking) => booking.status === 'entregado')
const otherBookings = bookings.filter((booking) => booking.status !== 'entregado')

const photos: Foto[] = []

deliveredBookings.forEach((booking, deliveredIdx) => {
  const indexCount = randomInt(MIN_INDEX_PHOTOS, MAX_INDEX_PHOTOS)
  const captureCount = indexCount + randomInt(10, 45)
  const selectsCount = Math.max(0, indexCount - randomInt(4, 12))
  const trashCount = randomInt(2, 8)

  for (let i = 0; i < indexCount; i += 1) {
    photos.push(
      createPhoto(
        {
          bookingId: booking.id,
          bucket: 'index',
          index: i,
          deliveredIdx,
          createdAt: booking.fecha_sesion,
        },
        true,
      ),
    )
  }

  for (let i = 0; i < captureCount; i += 1) {
    photos.push(
      createPhoto({
        bookingId: booking.id,
        bucket: 'capture',
        index: i,
        deliveredIdx,
        createdAt: booking.fecha_sesion,
      }),
    )
  }

  for (let i = 0; i < selectsCount; i += 1) {
    photos.push(
      createPhoto({
        bookingId: booking.id,
        bucket: 'selects',
        index: i,
        deliveredIdx,
        createdAt: booking.fecha_sesion,
      }),
    )
  }

  for (let i = 0; i < trashCount; i += 1) {
    photos.push(
      createPhoto({
        bookingId: booking.id,
        bucket: 'trash',
        index: i,
        deliveredIdx,
        createdAt: booking.fecha_sesion,
      }),
    )
  }
})

otherBookings.forEach((booking, idx) => {
  const captureCount = randomInt(20, 45)
  const selectsCount = randomInt(5, 18)
  for (let i = 0; i < captureCount; i += 1) {
    photos.push(
      createPhoto({
        bookingId: booking.id,
        bucket: 'capture',
        index: i,
        deliveredIdx: deliveredBookings.length + idx,
        createdAt: booking.fecha_sesion,
      }),
    )
  }
  for (let i = 0; i < selectsCount; i += 1) {
    photos.push(
      createPhoto({
        bookingId: booking.id,
        bucket: 'selects',
        index: i,
        deliveredIdx: deliveredBookings.length + idx,
        createdAt: booking.fecha_sesion,
      }),
    )
  }
})

const totalIndexFotos = photos.filter((photo) => photo.bucket_tipo === 'index').length

if (totalIndexFotos < 800) {
  const deficit = 800 - totalIndexFotos
  for (let i = 0; i < deficit; i += 1) {
    const booking = deliveredBookings[i % deliveredBookings.length]
    photos.push(
      createPhoto(
        {
          bookingId: booking.id,
          bucket: 'index',
          index: MAX_INDEX_PHOTOS + i,
          deliveredIdx: i,
          createdAt: booking.fecha_sesion,
        },
        true,
      ),
    )
  }
}

const fotosPorBooking = new Map<string, Foto[]>()
photos.forEach((foto) => {
  const list = fotosPorBooking.get(foto.booking_id)
  if (list) {
    list.push(foto)
  } else {
    fotosPorBooking.set(foto.booking_id, [foto])
  }
})

bookings.forEach((booking) => {
  const fotos = fotosPorBooking.get(booking.id) ?? []
  const indexCount = fotos.filter((foto) => foto.bucket_tipo === 'index').length
  const selectsCount = fotos.filter((foto) => foto.bucket_tipo === 'selects').length
  const captureCount = fotos.filter((foto) => foto.bucket_tipo === 'capture').length
  const trashCount = fotos.filter((foto) => foto.bucket_tipo === 'trash').length

  booking.total_fotos_customer_facing = indexCount
  booking.total_fotos_procesadas = indexCount + selectsCount
  booking.total_fotos_capturadas = captureCount + booking.total_fotos_procesadas + trashCount
})

const bookingsPorCliente = new Map<string, Booking[]>()
bookings.forEach((booking) => {
  const list = bookingsPorCliente.get(booking.cliente_id)
  if (list) {
    list.push(booking)
  } else {
    bookingsPorCliente.set(booking.cliente_id, [booking])
  }
})

clientes.forEach((cliente) => {
  const clienteBookings = bookingsPorCliente.get(cliente.id) ?? []
  cliente.total_bookings = clienteBookings.length
  cliente.total_fotos = clienteBookings.reduce(
    (acc, booking) => acc + booking.total_fotos_customer_facing,
    0,
  )
  if (clienteBookings.length) {
    const lastBooking = clienteBookings
      .slice()
      .sort(
        (a, b) => new Date(b.fecha_sesion).getTime() - new Date(a.fecha_sesion).getTime(),
      )[0]
    cliente.ultimo_booking = lastBooking ? lastBooking.fecha_sesion : null
  } else {
    cliente.ultimo_booking = null
  }
})

export const mockClientes = clientes
export const mockBookings = bookings
export const mockFotos = photos
export const mockFaceProfiles = faceProfiles

export const getClienteById = (id: string) => mockClientes.find((cliente) => cliente.id === id)
export const getBookingById = (id: string) => mockBookings.find((booking) => booking.id === id)
export const getFotosByBooking = (bookingId: string, bucket?: BucketType) =>
  mockFotos.filter(
    (foto) => foto.booking_id === bookingId && (!bucket || foto.bucket_tipo === bucket),
  )

export const getDaysLeftForCliente = (cliente: Cliente) => {
  if (cliente.status_subscription !== 'free_180_days' || !cliente.ultimo_booking) return null
  const dias = 180 - differenceInDays(new Date(), new Date(cliente.ultimo_booking))
  return dias > 0 ? dias : 0
}

export const mockPaquetes: PaqueteServicio[] = [
  {
    id: 'paq_1',
    nombre: 'Paquete Básico',
    descripcion: 'Ideal para sesiones individuales',
    fotos_incluidas: 5,
    precio_base: 2500,
    precio_foto_extra: 150,
    activo: true,
    fecha_creacion: formatISO(subDays(new Date(), 180)),
  },
  {
    id: 'paq_2',
    nombre: 'Paquete Estándar',
    descripcion: 'Perfecto para familias pequeñas',
    fotos_incluidas: 10,
    precio_base: 4500,
    precio_foto_extra: 120,
    activo: true,
    fecha_creacion: formatISO(subDays(new Date(), 150)),
  },
  {
    id: 'paq_3',
    nombre: 'Paquete Premium',
    descripcion: 'Para eventos y sesiones grandes',
    fotos_incluidas: 25,
    precio_base: 9500,
    precio_foto_extra: 100,
    activo: true,
    fecha_creacion: formatISO(subDays(new Date(), 120)),
  },
]

export const mockSummary = {
  totalClientes: mockClientes.length,
  clientesActivos: mockClientes.filter(
    (cliente) => cliente.status_subscription === 'free_180_days' || cliente.status_subscription === 'premium_annual',
  ).length,
  suscripcionesPremium: mockClientes.filter((cliente) => cliente.status_subscription === 'premium_annual')
    .length,
  totalFotos: mockFotos.filter((foto) => foto.bucket_tipo === 'index').length,
  totalBookings: mockBookings.length,
}

