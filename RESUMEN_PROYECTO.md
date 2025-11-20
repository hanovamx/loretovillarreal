# RESUMEN EJECUTIVO - Loreto Villarreal MVP

## Información Rápida

| Aspecto | Detalle |
|--------|---------|
| **Nombre del Proyecto** | Loreto Villarreal - MVP |
| **Tipo de Proyecto** | Web SPA (Single Page Application) |
| **Framework Principal** | React 19 + TypeScript + Vite |
| **Ubicación** | `/Users/josegonzalez/Desktop/Programación/loretovillarreal_mvp/webapp` |
| **Líneas de Código** | ~5,055 líneas TypeScript/TSX |
| **Módulos** | 29 archivos (componentes, páginas, stores, etc.) |
| **Estado** | MVP en desarrollo |
| **Licencia** | (No especificada) |

---

## Stack Tecnológico

### Frontend
- **React**: 19.1.1 (UI framework con hooks)
- **TypeScript**: 5.9.3 (Tipado estático)
- **Vite**: 7.1.7 (Build tool ultra rápido)
- **React Router**: 7.9.5 (Enrutamiento SPA)
- **Zustand**: 5.0.8 (State management)

### Estilos y UI
- **Tailwind CSS**: 3.4.14 (Utility-first CSS)
- **Framer Motion**: 12.23.24 (Animaciones)
- **React Icons**: 5.5.0 (Iconografía)
- **Sonner**: 2.0.7 (Notificaciones toast)

### Herramientas de Desarrollo
- **ESLint**: 9.36.0 (Linting)
- **TypeScript ESLint**: 8.45.0 (Linting TS)
- **PostCSS**: 8.5.6 (Procesamiento CSS)

---

## Estructura de Directorios Clave

```
webapp/
├── src/
│   ├── components/    (7 componentes)
│   │   ├── common/    (Button, Card, Badge, MetricCard)
│   │   ├── gallery/   (PhotoModal)
│   │   └── layout/    (AdminLayout, ClientLayout)
│   ├── pages/         (11 páginas)
│   │   ├── admin/     (7 páginas admin)
│   │   └── client/    (4 páginas cliente)
│   ├── stores/        (4 stores Zustand)
│   │   ├── authStore.ts
│   │   ├── clienteStore.ts
│   │   ├── bookingStore.ts
│   │   └── fotoStore.ts
│   ├── types/         (Definiciones TypeScript)
│   ├── utils/         (ai.ts, random.ts)
│   ├── constants/     (branding.ts)
│   ├── data/          (mockData.ts)
│   └── assets/        (Archivos estáticos)
├── dist/              (Build de producción)
├── scripts/           (dumpClients.ts)
└── [config files]
```

---

## Scripts Disponibles

```bash
npm run dev      # Inicia desarrollo en http://localhost:5173 con HMR
npm run build    # Compila TS y empaqueta con Vite
npm run lint     # Ejecuta ESLint
npm run preview  # Previsualiza la build de producción
```

---

## Características Principales

### Sistema de Autenticación Dual

**Admin:**
- Email: `admin@loretovillarreal.studio`
- Contraseña: `demo123`
- Acceso a gestión completa del negocio

**Cliente:**
- Login con credenciales temporales
- Acceso a sus sesiones fotográficas

---

### Funcionalidades de Admin

1. **Gestión de Clientes**
   - CRUD completo
   - Tipos: individual, familia, empresa
   - Estados de suscripción: free_180_days, premium_annual, expired
   - Historial de bookings

2. **Gestión de Bookings (Sesiones)**
   - Crear/editar sesiones fotográficas
   - Tipos: individual, familiar, graduacion, corporativo, evento, otro
   - Estados: programado, completado, procesando, entregado
   - Tracking de fotos: capturadas, procesadas, customer-facing

3. **Galería de Fotos**
   - Carga drag-drop
   - Clasificación en buckets: capture, output, selects, trash
   - Análisis IA automático
   - Etiquetado inteligente

4. **Dashboard**
   - Métricas del negocio
   - Configuración
   - Ayuda y soporte

---

### Funcionalidades de Cliente

1. **Dashboard Personal**
   - Resumen de sesiones
   - Próximas citas
   - Fotos disponibles

2. **Sesiones Fotográficas**
   - Ver detalles de cada sesión
   - Acceso a fotos capturadas
   - Descargas

3. **Perfil**
   - Datos personales
   - Estado de suscripción
   - Historial

---

## Tipos de Datos Principales

### Cliente
```typescript
interface Cliente {
  id, nombre_completo, email, telefono
  fecha_registro, tipo_cliente, status_subscription
  password_temporal, total_bookings, total_fotos
  ultimo_booking
}
```

### Booking
```typescript
interface Booking {
  id, cliente_id, nombre_sesion, fecha_sesion, tipo_sesion
  ubicacion, status, total_fotos_capturadas
  total_fotos_procesadas, total_fotos_customer_facing
  fecha_creacion, fecha_entrega, notas_internas
}
```

### Foto
```typescript
interface Foto {
  id, booking_id, nombre_archivo, bucket_tipo
  is_customer_facing, url_miniatura, url_medium, url_original
  formato, tamano_bytes, fecha_captura, fecha_subida
  ai_tags, ai_insights
}
```

### AI Insights
```typescript
interface AIInsights {
  faces_count, face_ids, quality_score, composition_score
  has_closed_eyes, has_blur, has_technical_issues, is_group_photo
  dominant_colors, scene_type, lighting_type
  suggested_category, mood, has_overexposure
}
```

---

## Rutas de la Aplicación

### Públicas (Login)
```
/admin/login
/cliente/login
```

### Admin (Protegidas)
```
/admin/dashboard          (Dashboard)
/admin/clientes           (Listado de clientes)
/admin/clientes/:id       (Detalle de cliente)
/admin/bookings           (Listado de bookings)
/admin/bookings/:id       (Detalle de booking)
/admin/fotos              (Galería de fotos)
/admin/configuracion      (Configuración)
/admin/ayuda              (Ayuda y soporte)
```

### Cliente (Protegidas)
```
/cliente/dashboard        (Dashboard)
/cliente/sesion/:id       (Sesión fotográfica)
/cliente/perfil           (Perfil personal)
```

---

## Stores Zustand

### authStore
- Gestión de autenticación
- Estado de sesión
- Información del usuario actual

### clienteStore
- CRUD de clientes
- Filtrado y búsqueda
- Cliente seleccionado

### bookingStore
- CRUD de bookings
- Filtrado por estado
- Detalles de sesiones

### fotoStore
- CRUD de fotos
- Cola de carga
- Análisis IA
- Gestión de buckets

---

## Configuración Personalizada

### Tailwind CSS - Colores
- **Primary**: #0f0f0f (Negro)
- **Background**: #FFFFFF
- **Buckets**: capture (#6b7280), output (#1f2937), selects (#0f0f0f), trash (#9f1239)
- **Status**: programado (#78350f), completado (#0f0f0f), procesando (#1f2937), entregado (#111827)

### Tailwind CSS - Fuentes
- **sans**: Arimo, Helvetica Neue
- **heading**: Imperial Urw, Times New Roman

---

## Flujo de Datos

```
┌─────────────────┐
│   React UI      │
│   Components    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  React Router   │
│  (Pages)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Zustand       │
│   Stores        │
│   (State)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Mock Data      │
│  (mockData.ts)  │
└─────────────────┘
```

---

## Instalación Rápida

```bash
cd /Users/josegonzalez/Desktop/Programación/loretovillarreal_mvp/webapp
npm install
npm run dev
```

Acceder a: `http://localhost:5173`

---

## Archivos de Configuración

| Archivo | Propósito |
|---------|-----------|
| `package.json` | Dependencias y scripts |
| `tsconfig.json` | Configuración TypeScript |
| `vite.config.ts` | Configuración del build |
| `tailwind.config.js` | Estilos Tailwind |
| `postcss.config.js` | Procesamiento CSS |
| `eslint.config.js` | Reglas de linting |
| `.gitignore` | Archivos ignorados por git |
| `index.html` | HTML principal |

---

## Métricas del Proyecto

| Métrica | Cantidad |
|---------|----------|
| Archivos TypeScript/TSX | 29 |
| Componentes React | 7 |
| Páginas | 11 |
| Stores | 4 |
| Líneas de código | ~5,055 |
| Dependencias | 11 |
| DevDependencies | 13 |

---

## Requisitos Mínimos

- **Node.js**: v18.0+
- **npm**: v9.0+
- **Editor recomendado**: VS Code con extensiones React

---

## Próximos Pasos (Roadmap)

1. Implementar API backend (Node.js/Express, Python, etc.)
2. Conectar base de datos (PostgreSQL, MongoDB)
3. Integrar autenticación real (JWT, OAuth)
4. Cloud storage para fotos (AWS S3, Supabase)
5. APIs de IA reales (Google Vision AI, AWS Rekognition)
6. Testing completo (Jest, React Testing Library)
7. CI/CD (GitHub Actions)
8. Deployment (Vercel, Netlify, servidor propio)

---

## Notas Importantes

- La aplicación actualmente usa datos mock en `mockData.ts`
- La autenticación es simulada (no hay backend)
- Las fotos y análisis IA son datos de demostración
- Listo para integrarse con servicios reales

---

**Fecha**: Noviembre 8, 2024  
**Archivo**: README_COMPLETO.md (937 líneas, 24KB)
