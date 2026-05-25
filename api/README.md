# Barbershop API

> RESTful API for barbershop management — bookings, workers, and services.

Built with **NestJS 11**, **PostgreSQL** (Neon serverless), **Prisma 7**, and **Supabase Auth**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS 11 |
| Language | TypeScript 5.7 |
| ORM | Prisma 7 |
| Database | PostgreSQL (Neon serverless) |
| Auth | Supabase JWT + Passport.js |
| Docs | Swagger + Scalar |
| Testing | Jest 30 |
| Linter | Biome |

---

## Getting Started

```bash
# Install dependencies
npm install

# Copy env and fill in values
cp .env.example .env

# Run dev server (watch mode)
npm run dev
```

### Environment Variables

```env
DATABASE_URL=postgresql://...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=...
```

---

## API Docs

| Interface | URL |
|---|---|
| Swagger UI | `http://localhost:3000/api` |
| Scalar Reference | `http://localhost:3000/docs` |

---

## Project Structure

```
src/
├── common/
│   ├── decorators/       # @CurrentWorker, @Booking, @Service, @Worker
│   ├── guards/           # SupabaseAuthGuard (JWT validation)
│   └── strategies/       # SupabaseStrategy (Passport JWT extraction)
├── modules/
│   ├── booking/          # Booking CRUD + DTOs + tests
│   ├── service/          # Service CRUD + DTOs + tests
│   └── worker/           # Worker CRUD + DTOs + tests
├── prisma/               # PrismaService singleton
├── supabase/             # SupabaseModule + client wrapper
└── main.ts               # Bootstrap, Swagger config, global pipes
```

---

## Data Model

```
┌──────────────────────────────────────┐
│               Worker                 │
│  id · supabaseId · name              │
│  specialty · avatarUrl               │
│  active · createdAt · updatedAt      │
└───────────────┬──────────────────────┘
                │ 1
       ┌────────┴──────────┐
       │ n                 │ n
┌──────▼──────────┐  ┌─────▼────────────────────┐
│    Service      │  │        Booking            │
│  id · name      │  │  id · clientName · phone  │
│  description    │  │  email · notes · source   │
│  price          │  │  date · status            │
│  duration       │  │  workerId (fk)            │
│  category       │  │  createdAt · updatedAt    │
│  active         │  └──────────────┬────────────┘
│  featured       │                 │ n
│  workerId (fk)  │        ┌────────┴──────────────┐
└─────────────────┘        │    BookingService     │
         │ n               │  bookingId · serviceId│
         └─────────────────┘   (junction table)    │
                           └───────────────────────┘
```

### Enums

**Worker Specialty**

```
BEAUTICIAN | ESTHETICS
```

**Service Category**

```
HAIR | COLORING | TREATMENTS | AESTHETICS
```

**Booking Status**

```
PENDING ──► CONFIRMED ──► COMPLETED
                └────────► CANCELLED
```

---

## Endpoints

### Workers

| Method | Path | Auth | Description |
|--------|------|:----:|-------------|
| `POST` | `/workers` | ✅ | Create worker |
| `GET` | `/workers` | ❌ | List workers (`?specialty=`) |
| `GET` | `/workers/:id` | ✅ | Get worker by ID |
| `PATCH` | `/workers/:id` | ✅ | Update worker |
| `DELETE` | `/workers/:id` | ✅ | Delete worker |

### Services

| Method | Path | Auth | Description |
|--------|------|:----:|-------------|
| `POST` | `/services` | ✅ | Create service |
| `GET` | `/services` | ❌ | List services (`?category=`) |
| `GET` | `/services/featured` | ❌ | Top 4 featured services |
| `GET` | `/services/:id` | ✅ | Get service by ID |
| `PATCH` | `/services/:id` | ✅ | Update service |
| `DELETE` | `/services/:id` | ✅ | Delete service |

### Bookings

| Method | Path | Auth | Description |
|--------|------|:----:|-------------|
| `POST` | `/bookings` | ❌ | Create booking (public form) |
| `GET` | `/bookings` | ✅ | List bookings (filterable) |
| `GET` | `/bookings/:id` | ✅ | Get booking by ID |
| `PATCH` | `/bookings/:id` | ✅ | Update booking |
| `DELETE` | `/bookings/:id` | ✅ | Delete booking |

> ✅ = requires Supabase Bearer token · ❌ = public

---

## Auth Flow

```
Client                    API                     Supabase
  │                        │                         │
  │── request w/ token ───►│                         │
  │                        │── validate JWT (JWKS) ─►│
  │                        │◄── claims ──────────────│
  │                        │                         │
  │                   SupabaseAuthGuard              │
  │                   extracts @CurrentWorker        │
  │                        │                         │
  │◄── protected resource ─│                         │
```

---

## Scripts

```bash
npm run dev          # Watch mode (development)
npm run build        # Compile to dist/
npm start            # Production start
npm run start:debug  # Debug mode

npm test             # Unit tests
npm run test:e2e     # End-to-end tests
npm run test:cov     # Coverage report

npm run lint         # Biome check
npm run format       # Biome format
```

---

## Testing

Tests live alongside their modules:

```
src/modules/booking/booking.service.spec.ts
src/modules/service/service.service.spec.ts
src/modules/worker/worker.service.spec.ts
test/                 # e2e specs
```
