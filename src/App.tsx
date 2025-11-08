import type { ReactElement } from 'react'
import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AdminLayout } from './components/layout/AdminLayout'
import { ClientLayout } from './components/layout/ClientLayout'
import { useAuthStore } from './stores/authStore'
import { useBookingStore } from './stores/bookingStore'
import { useClienteStore } from './stores/clienteStore'
import { useFotoStore } from './stores/fotoStore'
import { AdminClientesPage } from './pages/admin/AdminClientesPage'
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage'
import { AdminFotosPage } from './pages/admin/AdminFotosPage'
import { AdminBookingDetailPage } from './pages/admin/AdminBookingDetailPage'
import { AdminClienteDetailPage } from './pages/admin/AdminClienteDetailPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { ClientLoginPage } from './pages/client/ClientLoginPage'
import { ClientDashboardPage } from './pages/client/ClientDashboardPage'
import { ClientSessionPage } from './pages/client/ClientSessionPage'
import { ClientProfilePage } from './pages/client/ClientProfilePage'

const RequireAdmin = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated, userType } = useAuthStore()
  if (!isAuthenticated || userType !== 'admin') {
    return <Navigate to="/admin/login" replace />
  }
  return children
}

const RequireClient = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated, userType } = useAuthStore()
  if (!isAuthenticated || userType !== 'client') {
    return <Navigate to="/cliente/login" replace />
  }
  return children
}

export const App = () => {
  const fetchClientes = useClienteStore((state) => state.fetchClientes)
  const fetchBookings = useBookingStore((state) => state.fetchBookings)
  const fetchFotos = useFotoStore((state) => state.fetchFotos)

  useEffect(() => {
    fetchClientes()
    fetchBookings()
    fetchFotos()
  }, [fetchClientes, fetchBookings, fetchFotos])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<Navigate to="clientes" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="clientes" element={<AdminClientesPage />} />
          <Route path="clientes/:clienteId" element={<AdminClienteDetailPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
          <Route path="bookings/:bookingId" element={<AdminBookingDetailPage />} />
          <Route path="fotos" element={<AdminFotosPage />} />
          <Route
            path="configuracion"
            element={<AdminDashboardPage bannerTitle="Configuración" />}
          />
          <Route path="ayuda" element={<AdminDashboardPage bannerTitle="Ayuda y soporte" />} />
        </Route>
        <Route path="/cliente/login" element={<ClientLoginPage />} />
        <Route
          path="/cliente"
          element={
            <RequireClient>
              <ClientLayout />
            </RequireClient>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ClientDashboardPage />} />
          <Route path="sesion/:bookingId" element={<ClientSessionPage />} />
          <Route path="perfil" element={<ClientProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
      <Toaster richColors toastOptions={{ className: 'tracking-[0.14em] uppercase text-xs' }} />
    </BrowserRouter>
  )
}

export default App
