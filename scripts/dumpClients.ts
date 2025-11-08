import { mockClientes } from '../src/data/mockData'

console.log(
  mockClientes.slice(0, 3).map(({ nombre_completo, email, password_temporal, status_subscription }) => ({
    nombre_completo,
    email,
    password_temporal,
    status_subscription,
  })),
)

