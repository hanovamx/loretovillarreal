import { create } from 'zustand'
import { mockClientes } from '../data/mockData'
import type { Cliente } from '../types'

interface ClienteStoreState {
  clientes: Cliente[]
  loading: boolean
  initialized: boolean
  searchQuery: string
  fetchClientes: () => Promise<void>
  setSearchQuery: (query: string) => void
  getClienteById: (id: string) => Cliente | undefined
  searchClientes: (query: string) => Cliente[]
}

export const useClienteStore = create<ClienteStoreState>((set, get) => ({
  clientes: [],
  loading: false,
  initialized: false,
  searchQuery: '',
  fetchClientes: async () => {
    if (get().initialized) return
    set({ loading: true })
    await new Promise((resolve) => setTimeout(resolve, 350))
    set({ clientes: mockClientes, loading: false, initialized: true })
  },
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  getClienteById: (id: string) => get().clientes.find((cliente) => cliente.id === id),
  searchClientes: (query: string) => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return get().clientes
    return get().clientes.filter(
      (cliente) =>
        cliente.nombre_completo.toLowerCase().includes(normalized) ||
        cliente.email.toLowerCase().includes(normalized) ||
        cliente.telefono.toLowerCase().includes(normalized),
    )
  },
}))

