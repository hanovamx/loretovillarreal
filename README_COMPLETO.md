# Loreto Villarreal - MVP (Minimum Viable Product)

Aplicación web moderna para gestión de sesiones fotográficas, bookings de clientes y galerías de fotos con análisis de IA integrado.

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Scripts Disponibles](#scripts-disponibles)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Dependencias Principales](#dependencias-principales)
- [Dependencias de Desarrollo](#dependencias-de-desarrollo)
- [Configuración](#configuración)
- [Funcionalidades Principales](#funcionalidades-principales)
- [Rutas de la Aplicación](#rutas-de-la-aplicación)
- [Estado Global (Zustand Stores)](#estado-global-zustand-stores)
- [Tipos de Datos](#tipos-de-datos)
- [Componentes Principales](#componentes-principales)
- [Desarrollo](#desarrollo)
- [Compilación](#compilación)

---

## Descripción General

**Loreto Villarreal MVP** es una aplicación web full-stack desarrollada con React, TypeScript y Vite. Funciona como una plataforma para:

- **Administradores**: Gestión de clientes, bookings de sesiones fotográficas, galerías de fotos y análisis de imágenes con IA
- **Clientes**: Acceso a sus sesiones fotográficas, descarga de fotos y gestión de perfil

La aplicación implementa un sistema de autenticación dual (admin/cliente), manejo de estado global con Zustand, y estilos modernos con Tailwind CSS.

---

## Estructura del Proyecto

```
loretovillarreal_mvp/
├── webapp/                          # Aplicación React principal
│   ├── src/                         # Código fuente TypeScript/React
│   │   ├── components/              # Componentes React reutilizables
│   │   ├── pages/                   # Páginas de la aplicación
│   │   ├── stores/                  # Estado global con Zustand
│   │   ├── types/                   # Definiciones de tipos TypeScript
│   │   ├── utils/                   # Funciones utilitarias
│   │   ├── constants/               # Constantes de la aplicación
│   │   ├── data/                    # Datos mock para desarrollo
│   │   ├── assets/                  # Activos estáticos
│   │   ├── App.tsx                  # Componente raíz y enrutamiento
│   │   ├── main.tsx                 # Punto de entrada
│   │   ├── index.css                # Estilos globales
│   │   └── App.css                  # Estilos del componente App
│   │
│   ├── public/                      # Archivos estáticos públicos
│   ├── dist/                        # Código compilado para producción
│   ├── scripts/                     # Scripts de utilidad
│   │   └── dumpClients.ts           # Script para volcado de datos
│   │
│   ├── Configuration files
│   ├── package.json                 # Dependencias y scripts npm
│   ├── tsconfig.json                # Configuración TypeScript base
│   ├── tsconfig.app.json            # Configuración TypeScript app
│   ├── tsconfig.node.json           # Configuración TypeScript node
│   ├── vite.config.ts               # Configuración Vite
│   ├── tailwind.config.js           # Configuración Tailwind CSS
│   ├── postcss.config.js            # Configuración PostCSS
│   ├── eslint.config.js             # Configuración ESLint
│   ├── index.html                   # HTML principal
│   ├── .gitignore                   # Archivos ignorados por git
│   └── README.md                    # README original (template)
```

---

## Tecnologías Utilizadas

### Framework y Build Tools

| Tecnología | Versión | Descripción |
|-----------|---------|-------------|
| **React** | ^19.1.1 | Framework UI moderno con hooks |
| **TypeScript** | ~5.9.3 | Tipado estático para JavaScript |
| **Vite** | ^7.1.7 | Build tool ultra rápido |
| **Vite React Plugin** | ^5.0.4 | Soporte React en Vite con HMR |

### Routing y Estado

| Tecnología | Versión | Descripción |
|-----------|---------|-------------|
| **React Router DOM** | ^7.9.5 | Sistema de enrutamiento SPA |
| **Zustand** | ^5.0.8 | Gestor de estado global ligero |

### UI y Estilos

| Tecnología | Versión | Descripción |
|-----------|---------|-------------|
| **Tailwind CSS** | ^3.4.14 | Framework CSS utility-first |
| **PostCSS** | ^8.5.6 | Herramienta para transformar CSS |
| **Autoprefixer** | ^10.4.21 | Plugin PostCSS para prefijos de vendedor |
| **clsx** | ^2.1.1 | Utility para condicionales en className |

### Animaciones y Movimiento

| Tecnología | Versión | Descripción |
|-----------|---------|-------------|
| **Framer Motion** | ^12.23.24 | Librería de animaciones declarativas |

### Iconos y UI

| Tecnología | Versión | Descripción |
|-----------|---------|-------------|
| **React Icons** | ^5.5.0 | Iconos como componentes React |
| **Sonner** | ^2.0.7 | Sistema de notificaciones tipo toast |

### Utilidades

| Tecnología | Versión | Descripción |
|-----------|---------|-------------|
| **date-fns** | ^4.1.0 | Utilidades de fecha/hora modernas |
| **react-dropzone** | ^14.3.8 | Componente drag-and-drop para archivos |
| **@faker-js/faker** | ^10.1.0 | Generación de datos mock realistas |

### Herramientas de Desarrollo

| Tecnología | Versión | Descripción |
|-----------|---------|-------------|
| **ESLint** | ^9.36.0 | Linter estático para JavaScript |
| **TypeScript ESLint** | ^8.45.0 | Plugin ESLint para TypeScript |
| **ESLint Plugin React Hooks** | ^5.2.0 | Reglas ESLint para React Hooks |
| **ESLint Plugin React Refresh** | ^0.4.22 | Reglas para React Refresh en Vite |
| **ts-node** | ^10.9.2 | Ejecución de TypeScript directamente |

---

## Requisitos Previos

Antes de empezar, asegúrate de tener instalado:

- **Node.js**: v18.0 o superior
- **npm**: v9.0 o superior (incluido con Node.js)
- **git**: Para control de versiones

### Verificar versiones:

```bash
node --version    # v18.x.x o superior
npm --version     # v9.x.x o superior
```

---

## Instalación

### 1. Clonar el repositorio

```bash
cd /Users/josegonzalez/Desktop/Programación/loretovillarreal_mvp
```

### 2. Instalar dependencias

```bash
cd webapp
npm install
```

Esto instalará todas las dependencias definidas en `package.json`.

### 3. Verificar instalación

```bash
npm run lint  # Ejecuta ESLint para verificar la configuración
```

---

## Scripts Disponibles

El proyecto incluye los siguientes scripts npm:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

### Detalles de cada script:

| Script | Comando | Descripción |
|--------|---------|-------------|
| **dev** | `npm run dev` | Inicia servidor de desarrollo con HMR (Hot Module Replacement) en http://localhost:5173 |
| **build** | `npm run build` | Compila TypeScript y empaqueta la aplicación para producción |
| **lint** | `npm run lint` | Ejecuta ESLint para verificar la calidad del código |
| **preview** | `npm run preview` | Previsualiza la build de producción localmente |

### Ejemplos de uso:

```bash
# Iniciar desarrollo
npm run dev

# Compilar para producción
npm run build

# Ver problemas de linting
npm run lint

# Previsualizar build
npm run preview
```

---

## Estructura de Carpetas

### `/src/components`

Componentes React reutilizables organizados por tipo:

```
components/
├── common/              # Componentes genéricos
│   ├── Button.tsx       # Componente botón personalizado
│   ├── Card.tsx         # Contenedor de tarjeta
│   ├── Badge.tsx        # Etiqueta/badge
│   └── MetricCard.tsx   # Tarjeta para métricas
├── gallery/             # Componentes relacionados con galería
│   └── PhotoModal.tsx   # Modal para visualización de fotos
└── layout/              # Componentes de estructura
    ├── AdminLayout.tsx  # Layout para área de admin
    └── ClientLayout.tsx # Layout para área de cliente
```

**Total de componentes**: 7 archivos

### `/src/pages`

Páginas completas de la aplicación:

```
pages/
├── admin/                           # Páginas de administrador
│   ├── AdminLoginPage.tsx           # Página de login admin
│   ├── AdminDashboardPage.tsx       # Dashboard principal
│   ├── AdminClientesPage.tsx        # Listado de clientes
│   ├── AdminClienteDetailPage.tsx   # Detalle de cliente individual
│   ├── AdminBookingsPage.tsx        # Listado de bookings
│   ├── AdminBookingDetailPage.tsx   # Detalle de booking
│   └── AdminFotosPage.tsx           # Galería y gestión de fotos
└── client/                          # Páginas de cliente
    ├── ClientLoginPage.tsx          # Página de login cliente
    ├── ClientDashboardPage.tsx      # Dashboard cliente
    ├── ClientSessionPage.tsx        # Página de sesión fotográfica
    └── ClientProfilePage.tsx        # Perfil del cliente
```

**Total de páginas**: 11 archivos

### `/src/stores`

Gestión de estado global con Zustand:

```
stores/
├── authStore.ts         # Autenticación y sesión de usuario
├── clienteStore.ts      # Datos de clientes
├── bookingStore.ts      # Información de bookings/sesiones
└── fotoStore.ts         # Gestión de fotos e IA insights
```

### `/src/types`

Definiciones TypeScript centralizadas:

```
types/
└── index.ts             # Todos los tipos e interfaces de la app
```

### `/src/utils`

Funciones utilitarias reutilizables:

```
utils/
├── ai.ts                # Funciones para análisis de IA
└── random.ts            # Utilidades de aleatoriedad
```

### `/src/constants`

Constantes y configuraciones:

```
constants/
└── branding.ts          # Imágenes y configuración de marca
```

### `/src/data`

Datos mock para desarrollo:

```
data/
└── mockData.ts          # Datos de ejemplo para testing
```

### `/src/assets`

Archivos estáticos (imágenes, íconos):

```
assets/
└── vite.svg             # Logo de Vite
```

---

## Dependencias Principales

### Dependencias de Producción

```json
{
  "dependencies": {
    "@faker-js/faker": "^10.1.0",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "framer-motion": "^12.23.24",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-dropzone": "^14.3.8",
    "react-icons": "^5.5.0",
    "react-router-dom": "^7.9.5",
    "sonner": "^2.0.7",
    "zustand": "^5.0.8"
  }
}
```

### Descripción de dependencias principales:

| Paquete | Propósito |
|---------|-----------|
| `react` & `react-dom` | Framework UI |
| `react-router-dom` | Enrutamiento SPA |
| `zustand` | Gestor de estado ligero |
| `framer-motion` | Animaciones suaves |
| `tailwindcss` | Estilos CSS utility-first |
| `date-fns` | Manipulación de fechas |
| `react-dropzone` | Carga de archivos drag-drop |
| `react-icons` | Librería de iconos |
| `sonner` | Notificaciones toast |
| `@faker-js/faker` | Datos mock aleatorios |

---

## Dependencias de Desarrollo

```json
{
  "devDependencies": {
    "@eslint/js": "^9.36.0",
    "@types/node": "^24.6.0",
    "@types/react": "^19.1.16",
    "@types/react-dom": "^19.1.9",
    "@vitejs/plugin-react": "^5.0.4",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.36.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.22",
    "globals": "^16.4.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.14",
    "ts-node": "^10.9.2",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.45.0",
    "vite": "^7.1.7"
  }
}
```

---

## Configuración

### TypeScript (`tsconfig.json` y variantes)

**Archivo: `tsconfig.json`**
- Base que referencia `tsconfig.app.json` y `tsconfig.node.json`

**Archivo: `tsconfig.app.json`**
- Target: ES2022
- Module: ESNext
- JSX: react-jsx
- Modo estricto: Activado
- Verificación de tipos: Habilitada

**Archivo: `tsconfig.node.json`**
- Configuración para archivos de herramientas (Vite, ESLint)

### Vite (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- Plugin React habilitado con Fast Refresh
- Hot Module Replacement (HMR) automático
- Compilación rápida

### Tailwind CSS (`tailwind.config.js`)

**Configuración personalizada:**

- **Fuentes**: 
  - `sans`: Arimo, Helvetica Neue
  - `heading`: Imperial Urw, Times New Roman

- **Colores personalizados**:
  - `primary`: #0f0f0f (Negro)
  - `background`: #FFFFFF
  - Estados de booking: programado, completado, procesando, entregado
  - Buckets de fotos: capture, output, selects, trash

- **Efectos**:
  - Shadow sutil para profundidad

### PostCSS (`postcss.config.js`)

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- Procesa Tailwind CSS
- Añade prefijos de vendedor automáticamente

### ESLint (`eslint.config.js`)

**Reglas habilitadas:**
- JavaScript recomendado
- TypeScript recomendado
- React Hooks recomendado
- React Refresh (Vite)

---

## Funcionalidades Principales

### Para Administradores

1. **Gestión de Clientes**
   - Listado completo de clientes
   - Crear, editar y eliminar clientes
   - Ver detalle de cada cliente
   - Historial de bookings por cliente
   - Estados de suscripción

2. **Gestión de Bookings (Sesiones Fotográficas)**
   - Crear nuevas sesiones
   - Actualizar estado (Programado, Completado, Procesando, Entregado)
   - Asignar fechas y ubicaciones
   - Ver detalles por booking
   - Notas internas

3. **Galería y Gestión de Fotos**
   - Subir fotos (drag-drop)
   - Clasificar en buckets (capture, output, selects, trash)
   - Análisis de IA automático
   - Etiquetado con IA
   - Visualización por booking

4. **Dashboard**
   - Métricas principales
   - Estado general del negocio
   - Configuración
   - Ayuda y soporte

### Para Clientes

1. **Acceso a Sesiones**
   - Ver todas sus sesiones fotográficas
   - Detalles de cada sesión
   - Fotos capturadas

2. **Visualización de Fotos**
   - Galería de fotos de su sesión
   - Descargar fotos
   - Filtros y búsqueda

3. **Gestión de Perfil**
   - Ver información personal
   - Actualizar datos
   - Ver estado de suscripción
   - Historial de sesiones

---

## Rutas de la Aplicación

### Rutas Públicas (Sin autenticación)

```
/admin/login           → AdminLoginPage (Acceso admin)
/cliente/login         → ClientLoginPage (Acceso cliente)
```

### Rutas Protegidas - Admin

```
/admin                           → Redirige a /admin/clientes
/admin/dashboard                 → AdminDashboardPage (Dashboard)
/admin/clientes                  → AdminClientesPage (Listado)
/admin/clientes/:clienteId       → AdminClienteDetailPage (Detalle)
/admin/bookings                  → AdminBookingsPage (Listado)
/admin/bookings/:bookingId       → AdminBookingDetailPage (Detalle)
/admin/fotos                     → AdminFotosPage (Galería)
/admin/configuracion             → AdminDashboardPage (Config)
/admin/ayuda                     → AdminDashboardPage (Help)
```

### Rutas Protegidas - Cliente

```
/cliente                         → Redirige a /cliente/dashboard
/cliente/dashboard               → ClientDashboardPage (Dashboard)
/cliente/sesion/:bookingId       → ClientSessionPage (Sesión)
/cliente/perfil                  → ClientProfilePage (Perfil)
```

### Ruta por defecto

```
/                                → Redirige a /admin/login
/*                               → Redirige a /admin/login (404)
```

---

## Estado Global (Zustand Stores)

### 1. `authStore.ts` - Autenticación

**Estado:**
- `user`: Usuario autenticado (User | null)
- `userType`: Tipo de usuario ('admin' | 'client' | null)
- `isAuthenticated`: Boolean de autenticación

**Acciones:**
- `loginAdmin(email, password)`: Login de administrador
- `loginClient(email, password)`: Login de cliente
- `logout()`: Cerrar sesión

**Credenciales Demo:**
- Admin: `admin@loretovillarreal.studio` / `demo123`

### 2. `clienteStore.ts` - Gestión de Clientes

**Estado:**
- `clientes`: Array de clientes
- `filteredClientes`: Clientes filtrados
- `selectedCliente`: Cliente seleccionado

**Acciones:**
- `fetchClientes()`: Obtener lista de clientes
- `addCliente(cliente)`: Crear cliente
- `updateCliente(id, data)`: Actualizar cliente
- `deleteCliente(id)`: Eliminar cliente
- `searchClientes(query)`: Buscar clientes

### 3. `bookingStore.ts` - Gestión de Bookings

**Estado:**
- `bookings`: Array de bookings
- `filteredBookings`: Bookings filtrados

**Acciones:**
- `fetchBookings()`: Obtener lista de bookings
- `addBooking(booking)`: Crear booking
- `updateBooking(id, data)`: Actualizar booking
- `deleteBooking(id)`: Eliminar booking
- `filterByStatus(status)`: Filtrar por estado

### 4. `fotoStore.ts` - Gestión de Fotos e IA

**Estado:**
- `fotos`: Array de fotos
- `uploadQueue`: Cola de carga
- `selectedPhoto`: Foto seleccionada
- `aiTagging`: Estado de análisis IA

**Acciones:**
- `fetchFotos()`: Obtener lista de fotos
- `addFoto(foto)`: Agregar foto
- `updateFoto(id, data)`: Actualizar foto
- `deleteFoto(id)`: Eliminar foto
- `uploadPhoto(file)`: Subir foto
- `analyzePhotoAI(fotoId)`: Analizar foto con IA
- `updateBucket(fotoId, bucket)`: Cambiar bucket
- `generateThumbnail(fotoId)`: Generar miniatura

---

## Tipos de Datos

### Tipos Principales

```typescript
// Usuario
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'client'
  clienteId?: string
  subscription?: SubscriptionStatus
}

// Cliente
interface Cliente {
  id: string
  nombre_completo: string
  email: string
  telefono: string
  fecha_registro: string
  tipo_cliente: ClienteTipo                    // 'individual' | 'familia' | 'empresa'
  status_subscription: SubscriptionStatus      // 'free_180_days' | 'premium_annual' | 'expired'
  password_temporal: string
  total_bookings: number
  total_fotos: number
  ultimo_booking: string | null
}

// Booking (Sesión fotográfica)
interface Booking {
  id: string
  cliente_id: string
  nombre_sesion: string
  fecha_sesion: string
  tipo_sesion: SessionTipo                     // individual, familiar, graduacion, corporativo, evento, otro
  ubicacion: string
  status: BookingStatus                        // programado, completado, procesando, entregado
  total_fotos_capturadas: number
  total_fotos_procesadas: number
  total_fotos_customer_facing: number
  fecha_creacion: string
  fecha_entrega: string | null
  notas_internas: string
}

// Foto
interface Foto {
  id: string
  booking_id: string
  nombre_archivo: string
  bucket_tipo: BucketType                      // capture, output, selects, trash
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

// Análisis de IA
interface AIInsights {
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

// Cola de carga
interface UploadQueueItem {
  id: string
  fileName: string
  size: number
  bucket: BucketType
  progress: number
  status: 'pending' | 'uploading' | 'processing' | 'done'
  previewUrl?: string
}
```

---

## Componentes Principales

### Componentes Comunes (`/components/common`)

#### `Button.tsx`
- Componente de botón personalizado
- Soporta variantes (primary, secondary, etc.)
- Estados: hover, active, disabled
- Integración con Tailwind

#### `Card.tsx`
- Contenedor base con sombra y borde
- Usable en dashboards y listados

#### `Badge.tsx`
- Etiquetas pequeñas para estados
- Colores según estado de booking
- Indicadores de estatus

#### `MetricCard.tsx`
- Tarjeta para mostrar métricas
- Incluye icono, valor y descripción
- Útil en dashboards

### Componentes de Layout (`/components/layout`)

#### `AdminLayout.tsx`
- Layout envolvente para área de admin
- Sidebar de navegación
- Header con información de usuario
- Outlet para rutas anidadas

#### `ClientLayout.tsx`
- Layout para área de cliente
- Navegación principal
- Salida para contenido de rutas

### Componentes de Galería (`/components/gallery`)

#### `PhotoModal.tsx`
- Modal para visualizar fotos en detalle
- Zoom y navegación
- Información de IA insights
- Opciones de descarga

---

## Desarrollo

### Flujo de desarrollo

1. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   La aplicación estará en: `http://localhost:5173`

2. **Hot Module Replacement (HMR)**:
   - Los cambios en archivos se reflejan automáticamente
   - No se pierde el estado de la aplicación

3. **Tipado de TypeScript**:
   - Validación en tiempo de desarrollo
   - IntelliSense mejorado en IDE

4. **ESLint en tiempo real**:
   - Problemas detectados mientras escribes
   - Configuración en `eslint.config.js`

### Estructura de componentes típica

```typescript
import { ReactElement } from 'react'
import { useStore } from '@/stores/store'

interface MyComponentProps {
  title: string
  onAction?: () => void
}

export const MyComponent = ({ title, onAction }: MyComponentProps): ReactElement => {
  const data = useStore((state) => state.data)

  return (
    <div className="p-4 bg-white rounded-lg">
      <h2 className="text-2xl font-heading">{title}</h2>
      {/* Contenido */}
    </div>
  )
}
```

### Usando Zustand

```typescript
import { useAuthStore } from '@/stores/authStore'

const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuthStore()

  return (
    <div>
      {isAuthenticated && <p>Bienvenido, {user?.name}</p>}
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  )
}
```

### Animaciones con Framer Motion

```typescript
import { motion } from 'framer-motion'

export const AnimatedCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="p-4 bg-white rounded-lg"
  >
    Contenido animado
  </motion.div>
)
```

---

## Compilación

### Build para Producción

```bash
npm run build
```

Este comando:

1. **Compila TypeScript**: `tsc -b`
   - Valida tipos
   - Genera información de compilación

2. **Empaqueta con Vite**: `vite build`
   - Optimiza bundle
   - Minifica código
   - Genera archivos en `/dist`

### Verificar build

```bash
npm run preview
```

Visualiza la build compilada localmente.

### Estructura de la build

```
dist/
├── index.html          # Punto de entrada
├── assets/
│   ├── index-*.js      # JavaScript empaquetado
│   └── index-*.css     # CSS compilado
└── vite.svg            # Activos estáticos
```

---

## Información Adicional

### Archivos ignorados (`.gitignore`)

```
node_modules/
dist/
dist-ssr/
*.local
.vscode/*
.idea/
.DS_Store
*.log
```

### Información del Proyecto

- **Nombre**: webapp
- **Versión**: 0.0.0
- **Privado**: Sí
- **Tipo de módulo**: ESM (ES modules)
- **Total de líneas de código**: ~5,055 líneas TypeScript/TSX
- **Componentes**: 7
- **Páginas**: 11
- **Stores**: 4

### Estructura de datos mock

El proyecto incluye datos mock (`/src/data/mockData.ts`) para:
- Clientes de prueba con diferentes tipos de suscripción
- Bookings de sesiones fotográficas
- Fotos con análisis IA simulado

---

## Próximos Pasos Sugeridos

1. **Backend**: Implementar API REST/GraphQL
2. **Autenticación Real**: Integrar JWT o sesiones
3. **Base de Datos**: Conectar PostgreSQL/MongoDB
4. **Cloud Storage**: Integrar AWS S3 o Supabase
5. **IA Real**: Conectar APIs de análisis de imágenes (Vision AI, AWS Rekognition, etc.)
6. **Testing**: Agregar Jest y React Testing Library
7. **CI/CD**: Implementar GitHub Actions o similar
8. **Deployment**: Publicar en Vercel, Netlify o servidor propio

---

**Última actualización**: Noviembre 8, 2024  
**Estado**: MVP en desarrollo  
**Mantenedor**: Loreto Villarreal
