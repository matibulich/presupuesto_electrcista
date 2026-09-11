# AGENTS.md - Contexto del Proyecto

## Resumen

**"OT Manager"** es una aplicación web de gestión de órdenes de trabajo construida con Next.js 16, TypeScript, Tailwind CSS y Prisma. Permite registrar clientes, tipos de trabajos, materiales utilizados, prioridad y estado de cada orden, con generación de PDFs y un flujo completo de creación, edición y visualización.

La aplicación está conectada a **Supabase PostgreSQL** mediante Prisma ORM y persiste los datos realmente en la base de datos.

## Estado Actual

✅ **Base de datos conectada y migrada** (Supabase PostgreSQL)  
✅ **CRUD completo de órdenes**: crear, listar, ver detalle, editar, cambiar estado  
✅ **Generación de PDFs** (orden de trabajo en A4) vía `@react-pdf/renderer`  
✅ **Validación de formularios** con `react-hook-form` + `zod` (validación del lado del cliente y del servidor)  
✅ **Server Actions** (`use server`) para mutaciones de datos  
✅ **Búsqueda y filtrado de órdenes** en listado  
✅ **Diseño responsive** con layout de sidebar + header  
✅ **TypeScript** estricto, ESLint configurado  

⚠️ **Pendiente**: rutas `/clientes` y `/configuracion` definidas en el sidebar pero no implementadas  
⚠️ **Pendiente**: filtros de búsqueda en el listado de órdenes (input presente, sin funcionalidad)  

## Stack Tecnológico

### Framework y Runtime
- **Next.js 16.3.1** (App Router)
- **React 19.2.8**
- **TypeScript 5**

### UI
- **Tailwind CSS 4**
- **shadcn/ui** (componentes base)
- **@hugeicons/react** (íconos)
- **clsx** + **tailwind-merge** (gestión de clases)

### Base de Datos
- **Prisma ORM 7.10.0**
- **PostgreSQL** (Supabase como host)
- **@prisma/adapter-pg** (adapter para PostgreSQL)
- Cliente Prisma generado en `src/generated/prisma/`
- **2 migraciones**: `init` y `add unit to WorkOrderMaterial`

### Validación de Formularios
- **react-hook-form** `^7.86.0`
- **zod** `^4.4.3`
- **@hookform/resolvers** `^5.9.1`
- Schema de validación en `src/lib/validations/orders.ts`

### Generación de PDFs
- **@react-pdf/renderer** `^4.9.0`
- Componente PDF reutilizable: `src/components/pdf/WorkOrderPdf.tsx`
- API Route: `src/app/api/ordenes/[id]/pdf/route.ts`

### Configuración
- ESLint 9 (config de Next.js)
- PostCSS
- Path alias: `@/*` → `./src/*`

## Arquitectura y Estructura de Archivos

```
ordenes-trabajo/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout (lang="es")
│   │   ├── page.tsx             # Dashboard (datos reales desde Prisma)
│   │   ├── globals.css
│   │   ├── api/
│   │   │   └── ordenes/
│   │   │       └── [id]/
│   │   │           └── pdf/
│   │   │               └── route.ts       # API Route: genera PDF de orden
│   │   └── ordenes/
│   │       ├── page.tsx         # Listado de órdenes (con Prisma)
│   │       ├── actions.ts       # Server Actions: create/update/status
│   │       ├── nuevas/
│   │       │   └── page.tsx     # Formulario de nueva orden
│   │       └── [id]/
│   │           ├── page.tsx           # Detalle de orden (con Prisma)
│   │           ├── StatusActions.tsx   # Botones cambio de estado
│   │           └── editar/
│   │               └── page.tsx       # Formulario de edición
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx      # Barra superior (fija, desktop)
│   │   │   └── Sidebar.tsx     # Navegación lateral (dashboard, órdenes, clientes, settings)
│   │   ├── ui/              # Componentes UI (shadcn/ui + custom)
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── Form-field.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   └── textarea.tsx
│   │   ├── orders/
│   │   │   └── WorkOrdersForm.tsx  # Formulario reutilizable (create/edit)
│   │   └── pdf/
│   │       └── WorkOrderPdf.tsx    # Componente PDF de orden de trabajo
│   └── lib/
│       ├── prisma.ts          # Cliente Prisma singleton (singleton pattern)
│       ├── utils.ts           # Helper `cn()` (clsx + twMerge)
│       └── validations/
│           └── orders.ts      # Schema Zod para órdenes de trabajo
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│       ├── 20260901001451_init/
│       └── 20260901001938_init/
├── .env                     # DATABASE_URL + DIRECT_URL (Supabase)
├── components.json          # Configuración de shadcn/ui
└── AGENTS.md
```

## Modelo de Datos (Prisma Schema)

Basado en `prisma/schema.prisma`:

### Enums
- `WorkOrderStatus`: PENDING, IN_PROGRESS, COMPLETED, CANCELLED
- `WorkOrderPriority`: NORMAL, URGENT

### Modelos

**Customer**
| Campo       | Tipo      | Requerido | Descripción                    |
|-------------|-----------|-----------|--------------------------------|
| id          | String    | ✓ (PK)    | CUID generado automáticamente  |
| name        | String    | ✓         | Nombre del cliente             |
| phone       | String    | ✓         | Teléfono (índice)              |
| address     | String?   |           | Dirección opcional             |
| notes       | String?   |           | Notas opcionales               |
| createdAt   | DateTime  | ✓         | Default: now()                 |
| updatedAt   | DateTime  | ✓         | Auto actualizado               |

**WorkOrder**
| Campo        | Tipo               | Requerido | Descripción                            |
|--------------|--------------------|-----------|----------------------------------------|
| id           | String             | ✓ (PK)    | CUID                                   |
| number       | Int                | ✓ (UNIQUE)| Auto incremental (autoincrement)       |
| customerId   | String             | ✓ (FK)    | Relación con Customer (cascade)        |
| type         | String             | ✓         | Tipo de trabajo (ej: instalación)      |
| description  | String             | ✓         | Descripción detallada                  |
| priority     | WorkOrderPriority  | ✓         | Default: NORMAL                        |
| status       | WorkOrderStatus    | ✓         | Default: PENDING                       |
| observations | String?            |           | Observaciones adicionales              |
| completedAt  | DateTime?          |           | Fecha de finalización                  |
| createdAt    | DateTime           | ✓         | Default: now()                         |
| updatedAt    | DateTime           | ✓         | Auto actualizado                       |

**WorkOrderMaterial**
| Campo        | Tipo    | Requerido | Descripción                          |
|--------------|---------|-----------|--------------------------------------|
| id           | String  | ✓ (PK)    | CUID                                 |
| workOrderId  | String  | ✓ (FK)    | Relación con WorkOrder (cascade)     |
| description  | String  | ✓         | Nombre del material                  |
| quantity     | Int     | ✓         | Cantidad requerida                   |
| unit         | String? |           | Unidad de medida (ej: m, u)          |
| createdAt    | DateTime| ✓         | Default: now()                       |

### Índices
- `Customer.phone` — index
- `WorkOrder.number` — unique
- `WorkOrder.customerId` — index
- `WorkOrder.status` — index
- `WorkOrder.createdAt` — index
- `WorkOrderMaterial.workOrderId` — index

## Schema de Validación (Zod)

Basado en `src/lib/validations/orders.ts`:

| Campo           | Tipo                  | Requerido | Validación                         |
|-----------------|-----------------------|-----------|------------------------------------|
| customerName    | string                | ✓         | min 3 caracteres                   |
| phone           | string                | ✓         | min 8 caracteres                   |
| address         | string                |           | opcional                           |
| workType        | string                | ✓         | min 3 caracteres                   |
| description     | string                | ✓         | min 10 caracteres                  |
| observations    | string                |           | opcional                           |
| priority        | enum                  | ✓         | "NORMAL" \| "URGENT"               |
| materials       | array                 | ✓         | min 1 elemento                     |
| materials[].description | string          | ✓         | min 1 carácter                     |
| materials[].quantity    | string          | ✓         | regex `/^\d+$/` + > 0             |
| materials[].unit        | string          | ✓         | min 1 carácter                     |

**Nota**: Aunque `unit` es opcional en Prisma (`String?`), el schema Zod lo requiere. El formulario siempre envía un valor.

## Rutas

| Ruta                    | Tipo     | Descripción                              |
|-------------------------|----------|------------------------------------------|
| `/`                     | Page     | Dashboard con métricas y órdenes recientes (desde Prisma) |
| `/ordenes`              | Page     | Listado completo de órdenes (con Prisma, búsqueda y filtro) |
| `/ordenes/nuevas`       | Page     | Formulario de nueva orden → Server Action `createWorkOrder` |
| `/ordenes/[id]`         | Page     | Detalle de orden → estado, cliente, materiales, PDF |
| `/ordenes/[id]/editar`  | Page     | Formulario de edición → Server Action `updateWorkOrder` |
| `/api/ordenes/[id]/pdf` | API Route| Genera y descarga PDF de la orden        |

## Server Actions (`src/app/ordenes/actions.ts`)

Definidas con `"use server"`:

1. **`createWorkOrder(data: WorkOrderFormData)`**
   - Valida con Zod en el servidor
   - Busca o crea cliente (por teléfono)
   - Crea orden dentro de una transacción (`$transaction`)
   - Retorna `{ success, workOrder: { id, number } }`

2. **`updateWorkOrder(id: string, data: WorkOrderFormData)`**
   - Valida con Zod en el servidor
   - Actualiza el cliente existente
   - Elimina materiales anteriores y crea nuevos
   - Retorna `{ success, workOrder: { id, number } }`

3. **`updateWorkOrderStatus(id: string, status)`**
   - Actualiza el estado (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
   - Si state es COMPLETED, setea `completedAt = now()`
   - Retorna `{ success, status }`

## Componentes Clave

- **Sidebar** (`src/components/layout/Sidebar.tsx`): Navegación lateral con enlaces a Dashboard, Órdenes, Clientes y Configuración. Usa `usePathname` para resaltar el item activo.
- **Header** (`src/components/layout/Header.tsx`): Barra superior con título dinámico ("Dashboard", "Órdenes", etc.) y usuario.
- **WorkOrderForm** (`src/components/orders/WorkOrdersForm.tsx`): Formulario reutilizable para crear/editar órdenes. Usa `react-hook-form`, `zodResolver`, `useFieldArray` para materiales dinámicos. Llama a Server Actions con importación dinámica según el modo.
- **StatusActions** (`src/app/ordenes/[id]/StatusActions.tsx`): Componente cliente con botones para cambiar el estado de la orden (Iniciar trabajo, Finalizar, Cancelar).
- **WorkOrderPDF** (`src/components/pdf/WorkOrderPdf.tsx`): Componente de PDF con `@react-pdf/renderer`. Genera A4 con datos de cliente, trabajo, materiales, observaciones.
- **OrdersPage** (`src/app/ordenes/page.tsx`): Listado con tabla, resumen de órdenes por estado, búsqueda y filtrado (UI presente, funcionalidad pendiente).
- **Dashboard** (`src/app/page.tsx`): Métricas con datos reales desde Prisma, listado de últimas órdenes.

## Scripts

```bash
npm run dev          # Servidor de desarrollo (localhost:3000)
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter ESLint
npx prisma studio    # GUI para gestionar la DB
npx prisma generate  # Regenerar cliente Prisma
npx prisma migrate dev  # Crear migración y aplicar
```

## Bases de Datos

- **Host**: Supabase PostgreSQL (`aws-0-us-west-2.pooler.supabase.com`)
- **Pooler**: Conexión en puerto 6543 (pgbouncer=true)
- **Direct**: Conexión directa en puerto 5432
- Variables en `.env`: `DATABASE_URL`, `DIRECT_URL`

## Convenciones

- **Tailwind CSS** con sistema de utilidades.
- **camelCase** para variables y funciones; **PascalCase** para componentes.
- Aliases absolutos con `@/` (ej: `@/components/ui/button`).
- Formularios con `react-hook-form` + `zodResolver`.
- Server Actions con `"use server"` directive.
- Validación duplicada: cliente (Zod) + servidor (Zod).
- Código en español para textos de interfaz; inglés para código y variables.
- Prisma singleton en `globalThis` para evitar múltiples instancias en dev.

## Flujo de Trabajo Típico

1. El usuario navega a `/ordenes/nuevas` y completa el formulario.
2. `react-hook-form` valida en el cliente con el schema Zod.
3. Al submit, el formulario llama a `createWorkOrder` (Server Action).
4. La Server Action re-valida en el servidor y persiste en DB dentro de una transacción.
5. Redirige a `/ordenes/[id]` usando `useRouter` y `router.refresh()`.
6. En el detalle, el usuario puede cambiar el estado con `StatusActions`.
7. El usuario puede generar un PDF descargando desde `/api/ordenes/[id]/pdf`.