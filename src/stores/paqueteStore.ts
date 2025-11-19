import { create } from 'zustand'
import { formatISO } from 'date-fns'
import { mockPaquetes } from '../data/mockData'
import type { PaqueteServicio } from '../types'

interface PaqueteStoreState {
  paquetes: PaqueteServicio[]
  loading: boolean
  initialized: boolean
  fetchPaquetes: () => Promise<void>
  getPaqueteById: (id: string) => PaqueteServicio | undefined
  crearPaquete: (paquete: Omit<PaqueteServicio, 'id' | 'fecha_creacion'>) => void
  actualizarPaquete: (id: string, updates: Partial<PaqueteServicio>) => void
  eliminarPaquete: (id: string) => void
  getPaquetesActivos: () => PaqueteServicio[]
}

export const usePaqueteStore = create<PaqueteStoreState>((set, get) => ({
  paquetes: [],
  loading: false,
  initialized: false,
  fetchPaquetes: async () => {
    if (get().initialized) return
    set({ loading: true })
    await new Promise((resolve) => setTimeout(resolve, 300))
    set({ paquetes: mockPaquetes, loading: false, initialized: true })
  },
  getPaqueteById: (id) => get().paquetes.find((paquete) => paquete.id === id),
  crearPaquete: (paquete) => {
    const nuevoPaquete: PaqueteServicio = {
      ...paquete,
      id: `paq_${Date.now()}`,
      fecha_creacion: formatISO(new Date()),
    }
    set((state) => ({ paquetes: [...state.paquetes, nuevoPaquete] }))
  },
  actualizarPaquete: (id, updates) => {
    set((state) => ({
      paquetes: state.paquetes.map((paquete) =>
        paquete.id === id ? { ...paquete, ...updates } : paquete,
      ),
    }))
  },
  eliminarPaquete: (id) => {
    set((state) => ({
      paquetes: state.paquetes.filter((paquete) => paquete.id !== id),
    }))
  },
  getPaquetesActivos: () => {
    return get().paquetes.filter((paquete) => paquete.activo)
  },
}))

