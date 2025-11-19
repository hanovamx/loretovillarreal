import { create } from 'zustand'
import { formatISO } from 'date-fns'
import type { CarritoSeleccion } from '../types'

interface CarritoStoreState {
  carrito: CarritoSeleccion[]
  initialized: boolean
  fetchCarrito: (bookingId: string, clienteId: string) => Promise<void>
  agregarAlCarrito: (bookingId: string, fotoId: string, clienteId: string) => void
  quitarDelCarrito: (fotoId: string) => void
  getCarritoPorBooking: (bookingId: string) => CarritoSeleccion[]
  getFotosEnCarrito: (bookingId: string) => string[]
  limpiarCarrito: (bookingId: string) => void
  estaEnCarrito: (fotoId: string) => boolean
}

export const useCarritoStore = create<CarritoStoreState>((set, get) => ({
  carrito: [],
  initialized: false,
  fetchCarrito: async (bookingId, clienteId) => {
    // Mock: simular carga de carrito
    await new Promise((resolve) => setTimeout(resolve, 200))
    // En producción, esto vendría de Supabase
    set({ initialized: true })
  },
  agregarAlCarrito: (bookingId, fotoId, clienteId) => {
    const existe = get().carrito.some((item) => item.foto_id === fotoId)
    if (existe) return

    const nuevoItem: CarritoSeleccion = {
      id: `carrito_${Date.now()}_${fotoId}`,
      booking_id: bookingId,
      foto_id: fotoId,
      cliente_id: clienteId,
      fecha_agregado: formatISO(new Date()),
    }
    set((state) => ({ carrito: [...state.carrito, nuevoItem] }))
  },
  quitarDelCarrito: (fotoId) => {
    set((state) => ({
      carrito: state.carrito.filter((item) => item.foto_id !== fotoId),
    }))
  },
  getCarritoPorBooking: (bookingId) => {
    return get().carrito.filter((item) => item.booking_id === bookingId)
  },
  getFotosEnCarrito: (bookingId) => {
    return get()
      .carrito.filter((item) => item.booking_id === bookingId)
      .map((item) => item.foto_id)
  },
  limpiarCarrito: (bookingId) => {
    set((state) => ({
      carrito: state.carrito.filter((item) => item.booking_id !== bookingId),
    }))
  },
  estaEnCarrito: (fotoId) => {
    return get().carrito.some((item) => item.foto_id === fotoId)
  },
}))

