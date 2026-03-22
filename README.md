# El Gregorio Farm Resort - Full Stack Booking System

A complete resort booking website and admin dashboard built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, and Supabase.

---

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React
- **Backend / DB:** Supabase (PostgreSQL, Auth, Storage)
- **Architecture:** Modular services, typed Supabase responses, protected admin routes

---

## Project Structure

```
src/
├── components/
│   ├── sections/         # Public website sections
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── RoomsSection.tsx
│   │   ├── AmenitiesSection.tsx
│   │   ├── ReviewsSection.tsx
│   │   ├── ReservationSection.tsx
│   │   ├── LocationSection.tsx
│   │   └── Footer.tsx
│   └── ui/               # Reusable UI components
│       ├── StatusBadge.tsx
│       └── ReservationModal.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useAvailability.ts
├── layouts/
│   └── AdminLayout.tsx
├── lib/
│   └── supabase.ts
├── pages/
│   ├── HomePage.tsx
│   ├── AdminLoginPage.tsx
│   ├── AdminDashboardPage.tsx
│   ├── AdminReservationsPage.tsx
│   ├── AdminCalendarPage.tsx
│   ├── AdminRoomsPage.tsx
│   └── AdminReviewsPage.tsx
├── routes/
│   └── ProtectedRoute.tsx
├── services/
│   ├── auth.ts
│   ├── reservations.ts
│   ├── rooms.ts
│   └── reviews.ts
├── types/
│   ├── database.ts
│   └── index.ts
└── utils/
    └── helpers.ts
```

---

## Step 1: Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase project
3. Paste and run the contents of `supabase-schema.sql`
4. This will create all tables, indexes, RLS policies, and seed data

---

## Step 2: Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Find these in your Supabase project under **Settings → API**.

---

## Step 3: Create Admin User

In your Supabase project:
1. Go to **Authentication → Users**
2. Click **Add User** → **Create new user**
3. Enter your admin email and password
4. Use these credentials to log in at `/admin/login`

---

## Step 4: Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## Step 5: Build for Production

```bash
npm run build
npm run preview
```

---

## Features

### Public Website
- Sticky navbar with smooth scroll
- Full-width hero section with CTA
- Rooms showcase with live pricing
- Amenities grid
- Guest reviews (live from DB)
- Booking form with real-time availability check
- Automatic total price computation
- Google Maps embed
- Success confirmation with reference code

### Admin Dashboard (`/admin`)
- Protected by Supabase Auth
- Dashboard summary stats
- Reservations table with filters (status, room, date, search)
- Reservation detail modal with status update
- Monthly calendar view with color-coded bookings
- Room management (add, edit, enable/disable)
- Reviews management (add, edit, show/hide)

### Backend Logic
- Real-time availability checking (PostgreSQL function)
- Reference code generation (format: EGR-YYYYMMDD-XXXX)
- Automatic check-out date calculation
- Row Level Security (RLS) on all tables
- Indexed queries for performance

---

## Reservation Statuses

| Status | Description |
|--------|-------------|
| Pending | Newly submitted, awaiting confirmation |
| Confirmed | Admin has confirmed the booking |
| Checked-in | Guest has arrived |
| Completed | Stay is finished |
| Cancelled | Reservation was cancelled |

---

## Default Rooms (from seed data)

| Room | Capacity | Price/Night |
|------|----------|-------------|
| Family Room | 6–8 guests | ₱4,500 |
| Couple Room | 2–3 guests | ₱2,500 |
| Group Villa | 10–15 guests | ₱7,500 |

---

## Developer

Website developed by **Rhen-Rhen A. Lumbo**
