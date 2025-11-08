import { create } from 'zustand'
import { mockClientes } from '../data/mockData'
import type { SubscriptionStatus, User } from '../types'

interface AuthStoreState {
  user: User | null
  userType: 'admin' | 'client' | null
  isAuthenticated: boolean
  loginAdmin: (email: string, password: string) => Promise<void>
  loginClient: (email: string, password: string) => Promise<void>
  logout: () => void
}

const ADMIN_EMAIL = 'admin@loretovillarreal.studio'
const ADMIN_PASSWORD = 'demo123'

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  userType: null,
  isAuthenticated: false,
  loginAdmin: async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const user: User = {
        id: 'admin-demo',
        name: 'Loreto Villarreal',
        email: ADMIN_EMAIL,
        role: 'admin',
      }
      set({ user, userType: 'admin', isAuthenticated: true })
      return
    }
    throw new Error('Credenciales de administrador incorrectas')
  },
  loginClient: async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    const cliente = mockClientes.find(
      (client) =>
        client.email.toLowerCase() === email.toLowerCase() && client.password_temporal === password,
    )
    if (!cliente) {
      throw new Error('No encontramos una cuenta con esas credenciales')
    }
    const user: User = {
      id: `client-${cliente.id}`,
      name: cliente.nombre_completo,
      email: cliente.email,
      role: 'client',
      clienteId: cliente.id,
      subscription: cliente.status_subscription as SubscriptionStatus,
    }
    set({ user, userType: 'client', isAuthenticated: true })
  },
  logout: () => {
    set({ user: null, userType: null, isAuthenticated: false })
  },
}))

