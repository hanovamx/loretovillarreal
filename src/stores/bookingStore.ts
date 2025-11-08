import { create } from 'zustand'
import { mockBookings } from '../data/mockData'
import type { Booking, BookingStatus, SessionTipo } from '../types'

interface BookingStoreState {
  bookings: Booking[]
  loading: boolean
  initialized: boolean
  viewMode: 'grid' | 'list'
  fetchBookings: () => Promise<void>
  setViewMode: (mode: 'grid' | 'list') => void
  getBookingById: (id: string) => Booking | undefined
  getBookingsByCliente: (clienteId: string) => Booking[]
  getBookingsByStatus: (status: BookingStatus) => Booking[]
  getBookingsByTipo: (tipo: SessionTipo) => Booking[]
  updateBookingCounts: (
    bookingId: string,
    counts: Partial<Pick<Booking, 'total_fotos_customer_facing' | 'total_fotos_procesadas'>>,
  ) => void
}

export const useBookingStore = create<BookingStoreState>((set, get) => ({
  bookings: [],
  loading: false,
  initialized: false,
  viewMode: 'grid',
  fetchBookings: async () => {
    if (get().initialized) return
    set({ loading: true })
    await new Promise((resolve) => setTimeout(resolve, 400))
    set({ bookings: mockBookings, loading: false, initialized: true })
  },
  setViewMode: (mode) => set({ viewMode: mode }),
  getBookingById: (id: string) => get().bookings.find((booking) => booking.id === id),
  getBookingsByCliente: (clienteId: string) =>
    get().bookings.filter((booking) => booking.cliente_id === clienteId),
  getBookingsByStatus: (status: BookingStatus) =>
    get().bookings.filter((booking) => booking.status === status),
  getBookingsByTipo: (tipo: SessionTipo) =>
    get().bookings.filter((booking) => booking.tipo_sesion === tipo),
  updateBookingCounts: (bookingId, counts) =>
    set({
      bookings: get().bookings.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              ...counts,
            }
          : booking,
      ),
    }),
}))

