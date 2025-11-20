# Arquitectura del Proyecto - Loreto Villarreal MVP

## Diagrama de Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                    APLICACIÓN WEB (SPA)                         │
│              Loreto Villarreal Photography MVP                  │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Capa de UI      │  │   Enrutamiento   │  │   Estado Global  │
│  (Componentes)   │  │  (React Router)  │  │    (Zustand)     │
└────────┬─────────┘  └──────────┬───────┘  └────────┬─────────┘
         │                       │                   │
         └───────────────────────┼───────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   React Application    │
                    │     (App.tsx)          │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Estado Global Apps   │
                    │  (Zustand Stores)      │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Mock Data Storage    │
                    │   (mockData.ts)        │
                    └────────────────────────┘
```

---

## Estructura de Capas

```
┌─────────────────────────────────────────────────┐
│           CAPA DE PRESENTACIÓN (UI)             │
│  ┌──────────────┐  ┌──────────────────────────┐ │
│  │  Componentes │  │      Páginas             │ │
│  │    Comunes   │  │  ┌──────────────────┐   │ │
│  │              │  │  │  Admin Pages     │   │ │
│  │ - Button     │  │  │  ┌─────────────┐ │   │ │
│  │ - Card       │  │  │  │ Dashboard   │ │   │ │
│  │ - Badge      │  │  │  │ Clientes    │ │   │ │
│  │ - MetricCard │  │  │  │ Bookings    │ │   │ │
│  │              │  │  │  │ Fotos       │ │   │ │
│  │  - Layout    │  │  │  └─────────────┘ │   │ │
│  │  - Gallery   │  │  │                  │   │ │
│  └──────────────┘  │  │  Client Pages    │   │ │
│                    │  │  ┌─────────────┐ │   │ │
│                    │  │  │ Dashboard   │ │   │ │
│                    │  │  │ Sesión      │ │   │ │
│                    │  │  │ Perfil      │ │   │ │
│                    │  │  └─────────────┘ │   │ │
│                    │  └──────────────────┘   │ │
│  └──────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────┐
│      CAPA DE ENRUTAMIENTO (React Router)       │
│  • Rutas públicas (login)                       │
│  • Rutas protegidas (admin/cliente)             │
│  • Guardias de autenticación (RequireAdmin...)  │
│  • Redirecciones automáticas                    │
└─────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────┐
│       CAPA DE ESTADO GLOBAL (Zustand)          │
│  ┌──────────────┐  ┌──────────────┐            │
│  │  authStore   │  │ clienteStore │            │
│  │              │  │              │            │
│  │ - user       │  │ - clientes   │            │
│  │ - isAuth     │  │ - filtered   │            │
│  │ - userType   │  │ - selected   │            │
│  │ - login()    │  │ - fetch()    │            │
│  │ - logout()   │  │ - add()      │            │
│  │              │  │ - update()   │            │
│  │              │  │ - delete()   │            │
│  └──────────────┘  └──────────────┘            │
│  ┌──────────────┐  ┌──────────────┐            │
│  │bookingStore  │  │  fotoStore   │            │
│  │              │  │              │            │
│  │ - bookings   │  │ - fotos      │            │
│  │ - filtered   │  │ - queue      │            │
│  │ - fetch()    │  │ - aiAnalysis │            │
│  │ - add()      │  │ - upload()   │            │
│  │ - filter()   │  │ - analyze()  │            │
│  │              │  │ - bucket()   │            │
│  └──────────────┘  └──────────────┘            │
└─────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────┐
│     CAPA DE DATOS (Tipos & Mock Data)          │
│  • TypeScript Types (types/index.ts)            │
│  • Mock Data (data/mockData.ts)                 │
│  • Constantes (constants/branding.ts)           │
│  • Utilidades (utils/ai.ts, utils/random.ts)   │
└─────────────────────────────────────────────────┘
```

---

## Flujo de Componentes

```
┌─────────────────────────────────────────┐
│           App.tsx                       │
│  • BrowserRouter                        │
│  • Routes definidas                     │
│  • Protectores de autenticación        │
│  • Toaster (Sonner)                     │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
        ▼          ▼          ▼
   AdminLayout  ClientLayout LoginPages
        │          │          │
        │          │          ├─ AdminLoginPage
        │          │          └─ ClientLoginPage
        │          │
        │          └─ Outlet (rutas anidadas)
        │             └─ ClientDashboardPage
        │             └─ ClientSessionPage
        │             └─ ClientProfilePage
        │
        └─ Outlet (rutas anidadas)
           ├─ AdminDashboardPage
           ├─ AdminClientesPage
           ├─ AdminClienteDetailPage
           ├─ AdminBookingsPage
           ├─ AdminBookingDetailPage
           └─ AdminFotosPage
```

---

## Flujo de Datos - Ejemplo: Gestión de Clientes

```
┌──────────────────┐
│  AdminClientes   │
│  Page Component  │
└────────┬─────────┘
         │
         │ useClienteStore()
         │ (fetch, update, delete)
         ▼
┌──────────────────────┐
│  clienteStore.ts     │
│  (Zustand)           │
│                      │
│ - State:             │
│   • clientes[]       │
│   • filtered[]       │
│   • selectedCliente  │
│                      │
│ - Actions:           │
│   • fetchClientes()  │
│   • addCliente()     │
│   • updateCliente()  │
│   • deleteCliente()  │
│   • searchClientes() │
└────────┬─────────────┘
         │
         │ Actualiza estado
         ▼
┌──────────────────────┐
│  Componentes UI      │
│                      │
│ - AdminClientesPage  │
│ - AdminCliente-      │
│   DetailPage         │
│ - Card components    │
│ - Button components  │
└──────────────────────┘

          ┌─────────────────────────┐
          │   mockData.ts           │
          │                         │
          │ Proporciona datos       │
          │ de ejemplo para:        │
          │ • Clientes              │
          │ • Bookings              │
          │ • Fotos                 │
          └─────────────────────────┘
```

---

## Estructura de Rutas Protegidas

```
RUTAS PÚBLICAS
├── /                    → Redirige a /admin/login
├── /admin/login         → AdminLoginPage
└── /cliente/login       → ClientLoginPage

RUTAS ADMIN (Protegidas por RequireAdmin)
└── /admin               → AdminLayout
    ├── /dashboard       → AdminDashboardPage
    ├── /clientes        → AdminClientesPage
    ├── /clientes/:id    → AdminClienteDetailPage
    ├── /bookings        → AdminBookingsPage
    ├── /bookings/:id    → AdminBookingDetailPage
    ├── /fotos           → AdminFotosPage
    ├── /configuracion   → AdminDashboardPage (banner)
    └── /ayuda           → AdminDashboardPage (banner)

RUTAS CLIENTE (Protegidas por RequireClient)
└── /cliente             → ClientLayout
    ├── /dashboard       → ClientDashboardPage
    ├── /sesion/:id      → ClientSessionPage
    └── /perfil          → ClientProfilePage

FALLBACK
└── /*                   → Redirige a /admin/login
```

---

## Ciclo de Vida - Autenticación

```
┌─────────────────┐
│  Login Page     │
│  (Admin/Client) │
└────────┬────────┘
         │
         │ Submit form
         │ (email, password)
         ▼
┌──────────────────────┐
│  authStore.ts        │
│  login...() method   │
│                      │
│ 1. Simula delay      │
│ 2. Valida credenciales
│ 3. Crea User object  │
│ 4. Actualiza estado  │
└────────┬─────────────┘
         │
         ├─ Éxito
         │  └─→ set({ user, userType, isAuthenticated })
         │      └─→ Redirige a dashboard
         │
         └─ Error
            └─→ throw Error()
               └─→ Muestra error al usuario
```

---

## Ciclo de Vida - Carga de Fotos

```
┌─────────────────────┐
│  AdminFotosPage     │
│  (Galería de fotos) │
└────────┬────────────┘
         │
         │ Drag & Drop
         │ Archivo
         ▼
┌──────────────────────┐
│  fotoStore.ts        │
│  uploadPhoto()       │
│                      │
│ 1. Añade a queue     │
│ 2. Status: pending   │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  UI - Upload Queue   │
│                      │
│ Muestra:             │
│ • Progreso           │
│ • Estado             │
│ • Miniatura preview  │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  AI Analysis         │
│  analyzePhotoAI()    │
│                      │
│ 1. Genera insights   │
│ 2. Detecta faces     │
│ 3. Quality score     │
│ 4. Tags automáticos  │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  fotoStore - Update  │
│                      │
│ Status: done         │
│ ai_insights: {...}   │
│ ai_tags: [...]       │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  UI - Galería        │
│  Muestra foto con    │
│  análisis IA         │
└──────────────────────┘
```

---

## Componentes - Dependencias

```
App.tsx
├── BrowserRouter
├── Routes
│   ├── AdminLoginPage
│   │   └── (sin dependencias especiales)
│   │
│   ├── AdminLayout
│   │   └── Outlet (rutas admin)
│   │
│   ├── AdminClientesPage
│   │   ├── useClienteStore()
│   │   ├── Card.tsx
│   │   └── Button.tsx
│   │
│   ├── AdminBookingsPage
│   │   ├── useBookingStore()
│   │   ├── Badge.tsx
│   │   └── MetricCard.tsx
│   │
│   ├── AdminFotosPage
│   │   ├── useFotoStore()
│   │   ├── PhotoModal.tsx
│   │   └── react-dropzone
│   │
│   ├── AdminClienteDetailPage
│   │   ├── useClienteStore()
│   │   └── Card.tsx
│   │
│   ├── AdminBookingDetailPage
│   │   ├── useBookingStore()
│   │   ├── useFotoStore()
│   │   └── PhotoModal.tsx
│   │
│   ├── ClientLoginPage
│   │   └── (formulario simple)
│   │
│   ├── ClientLayout
│   │   └── Outlet (rutas cliente)
│   │
│   ├── ClientDashboardPage
│   │   ├── useBookingStore()
│   │   ├── useAuthStore()
│   │   └── Card.tsx
│   │
│   ├── ClientSessionPage
│   │   ├── useBookingStore()
│   │   ├── useFotoStore()
│   │   └── PhotoModal.tsx
│   │
│   └── ClientProfilePage
│       └── useAuthStore()
│
└── Toaster (Sonner)
```

---

## Stack de Estilos

```
┌─────────────────────────────────────────┐
│          index.html                     │
│  (Aplicación React se monta aquí)       │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         main.tsx                        │
│  (Punto de entrada React)               │
│         ↓                               │
│     index.css (Estilos globales)        │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  index.css                              │
│  • Importa @tailwind directives         │
│  • Estilos globales base                │
│  • Variables CSS                        │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  tailwind.config.js                     │
│  • Colores personalizados               │
│  • Fuentes custom                       │
│  • Extensiones de tema                  │
│  • Plugins                              │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  postcss.config.js                      │
│  • Procesa Tailwind CSS                 │
│  • Autoprefixer para compatibilidad     │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  App.css                                │
│  • Estilos específicos del componente   │
│    App                                  │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  Componentes                            │
│  • Clases Tailwind inline               │
│  • className propiedades                │
│  • Estilos condicionales (clsx)         │
└─────────────────────────────────────────┘
```

---

## Tipado - Jerarquía de Tipos

```
types/index.ts (Definiciones centralizadas)
│
├── User (Usuario autenticado)
│   ├── id: string
│   ├── name: string
│   ├── email: string
│   ├── role: 'admin' | 'client'
│   ├── clienteId?: string
│   └── subscription?: SubscriptionStatus
│
├── Cliente (Cliente/Fotografiado)
│   ├── id: string
│   ├── nombre_completo: string
│   ├── email: string
│   ├── telefono: string
│   ├── fecha_registro: string
│   ├── tipo_cliente: ClienteTipo
│   ├── status_subscription: SubscriptionStatus
│   ├── password_temporal: string
│   ├── total_bookings: number
│   ├── total_fotos: number
│   └── ultimo_booking: string | null
│
├── Booking (Sesión fotográfica)
│   ├── id: string
│   ├── cliente_id: string
│   ├── nombre_sesion: string
│   ├── fecha_sesion: string
│   ├── tipo_sesion: SessionTipo
│   ├── ubicacion: string
│   ├── status: BookingStatus
│   ├── total_fotos_capturadas: number
│   ├── total_fotos_procesadas: number
│   ├── total_fotos_customer_facing: number
│   ├── fecha_creacion: string
│   ├── fecha_entrega: string | null
│   └── notas_internas: string
│
├── Foto (Archivo de imagen)
│   ├── id: string
│   ├── booking_id: string
│   ├── nombre_archivo: string
│   ├── bucket_tipo: BucketType
│   ├── is_customer_facing: boolean
│   ├── url_miniatura: string
│   ├── url_medium: string
│   ├── url_original: string
│   ├── formato: string
│   ├── tamano_bytes: number
│   ├── fecha_captura: string | null
│   ├── fecha_subida: string
│   ├── ai_tags: string[]
│   └── ai_insights: AIInsights | null
│
├── AIInsights (Análisis de imagen IA)
│   ├── faces_count: number
│   ├── face_ids: string[]
│   ├── quality_score: number
│   ├── composition_score: number
│   ├── has_closed_eyes: boolean
│   ├── has_blur: boolean
│   ├── has_technical_issues: boolean
│   ├── is_group_photo: boolean
│   ├── dominant_colors: string[]
│   ├── scene_type: 'portrait' | 'group' | 'event' | ...
│   ├── lighting_type: 'studio' | 'natural' | 'mixed' | ...
│   ├── suggested_category: string
│   ├── mood: string
│   └── has_overexposure: boolean
│
├── UploadQueueItem (Item en cola de carga)
│   ├── id: string
│   ├── fileName: string
│   ├── size: number
│   ├── bucket: BucketType
│   ├── progress: number
│   ├── status: 'pending' | 'uploading' | ...
│   └── previewUrl?: string
│
└── Type Unions (Tipos enumerados)
    ├── SubscriptionStatus = 'free_180_days' | 'premium_annual' | 'expired'
    ├── ClienteTipo = 'individual' | 'familia' | 'empresa'
    ├── SessionTipo = 'individual' | 'familiar' | 'graduacion' | ...
    ├── BookingStatus = 'programado' | 'completado' | 'procesando' | 'entregado'
    ├── BucketType = 'capture' | 'output' | 'selects' | 'trash'
    └── FaceProfile (Perfil de rostro detectado)
```

---

## Configuración del Proyecto

```
Raíz del Proyecto (webapp/)
│
├── TypeScript Config
│   ├── tsconfig.json (Base)
│   ├── tsconfig.app.json (Aplicación)
│   └── tsconfig.node.json (Tools)
│
├── Build Tools
│   ├── vite.config.ts (Vite)
│   ├── package.json (npm)
│   └── package-lock.json
│
├── Estilos
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── index.css
│
├── Linting
│   └── eslint.config.js
│
├── Archivos
│   ├── .gitignore
│   └── index.html (HTML principal)
│
└── Directorios
    ├── src/ (Código fuente)
    ├── dist/ (Build producción)
    ├── node_modules/ (Dependencias)
    ├── scripts/ (Utilidades)
    └── public/ (Estáticos)
```

---

## Integración de Dependencias

```
react@19.1.1 + react-dom@19.1.1
    ↓
Proporciona componentes UI React

    ↓
react-router-dom@7.9.5
    ↓
Enrutamiento SPA

    ↓
zustand@5.0.8
    ↓
Estado global reactivo

    ↓
tailwindcss@3.4.14 + postcss@8.5.6 + autoprefixer@10.4.21
    ↓
Estilos utility-first

    ↓
framer-motion@12.23.24
    ↓
Animaciones suaves

    ↓
react-icons@5.5.0
    ↓
Iconografía

    ↓
sonner@2.0.7
    ↓
Notificaciones toast

    ↓
date-fns@4.1.0
    ↓
Manipulación de fechas

    ↓
react-dropzone@14.3.8
    ↓
Carga drag-drop

    ↓
@faker-js/faker@10.1.0
    ↓
Datos mock realistas
```

---

## Performance

```
Optimizaciones incluidas:

1. Vite
   • HMR (Hot Module Replacement)
   • Bundling rápido
   • Tree shaking automático

2. React
   • Virtual DOM
   • Lazy components
   • Memoization posible

3. TypeScript
   • Eliminación de código muerto
   • Verificación en compilación

4. Tailwind CSS
   • PurgeCSS integrado
   • Estilos mínimos

5. Framer Motion
   • Hardware acceleration
   • Requestanimationframe
```

---

**Fecha**: Noviembre 8, 2024
