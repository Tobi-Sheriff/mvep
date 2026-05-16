# MVEP — Project Specification

> Multi-Vendor E-Commerce Platform  
> A CV-grade React SPA demonstrating enterprise frontend patterns.

---

## Project Overview

MVEP is a full-featured multi-vendor e-commerce platform built entirely in React. It demonstrates real-world frontend engineering across two portals:

- **Vendor Dashboard** — product management, order processing, analytics
- **Customer Storefront** — product catalogue, cart, multi-step checkout

The backend is entirely mocked via MSW v2, making the project fully self-contained for portfolio and interview purposes.

---

## Goals

1. Demonstrate senior-level React patterns (composition, custom hooks, code splitting)
2. Show RTK Query vs Redux slice distinction (server state vs client state)
3. Implement real-world auth (JWT, role guards, email verification)
4. Deliver production-quality UX (skeleton loaders, optimistic updates, error boundaries)
5. Achieve meaningful test coverage (unit + integration + E2E)

---

## User Roles

| Role | Access |
|------|--------|
| **Customer** | Storefront, product search, cart, checkout, wishlist, order history |
| **Vendor** | Dashboard, product CRUD, order management, analytics charts |
| **Admin** | All vendor features + user management (super-admin seeded at startup) |

---

## Portal Architecture

> See the full component hierarchy: [`mvep_component_architecture.svg`](./mvep_component_architecture.svg)

### Vendor Dashboard (`/vendor/*`)

- Sidebar navigation: Dashboard · Products · Orders · Analytics
- **Dashboard** — revenue stat cards (total, change %), recent orders
- **Products** — paginated table with add/edit modal and delete confirm
- **Orders** — filterable list, status workflow: Pending → Processing → Shipped → Delivered
- **Analytics** — Recharts line chart (revenue), bar chart (daily orders), top products table, period selector (7d / 30d / 90d / 1y)

### Customer Storefront (`/store/*`)

- Top navigation with search bar and cart badge
- **Catalogue** — product grid, pagination, real-time search with debounce, sidebar filters (category, price range, star rating)
- **Product detail** — image gallery, description, reviews, add-to-cart, wishlist toggle
- **Cart** — slide-in drawer, quantity controls, line totals, proceed to checkout
- **Checkout** — 4-step wizard: Address → Payment → Review → Confirmation
- **Order history** — per-order status timeline
- **Wishlist** — dedicated page, move-to-cart

---

## Key Technical Patterns

### State Management Split

```
Server state  → RTK Query (Phase 6)
  Products, orders, analytics, user profile

Client state  → Redux slices
  authSlice    — JWT token, user, pendingVerification
  cartSlice    — items, quantities (localStorage-persisted)

UI state      → useState / useReducer
  Modals, form steps, filter panels
```

### Authentication Flow

```
Register → Email verification (6-digit code) → Login → JWT stored in localStorage
         ↓                                              ↓
   pendingVerification state                    authSlice.isAuthenticated = true
```

### Route Protection

```
PrivateRoute
  ├── !isAuthenticated → /login (saves intended destination)
  ├── wrong role      → role's home (/store or /vendor/dashboard)
  └── passes         → renders children
```

### Optimistic Updates

Status changes and wishlist toggles update the UI immediately before the API responds. On error, they roll back.

### Error Handling

- Global error boundary at `App.tsx` — catches any unhandled throws, shows a friendly fallback
- Feature-level error boundaries on dashboard sections (analytics, product table)
- Axios 401 interceptor — auto-dispatches `logout()` and redirects to login

---

## Folder Structure

```
src/
├── app/
│   ├── store.ts          Redux store with all reducers
│   ├── router.tsx        createBrowserRouter with all routes
│   └── hooks.ts          Typed useAppDispatch / useAppSelector
│
├── features/             Domain-sliced modules
│   ├── auth/
│   │   ├── components/   PrivateRoute
│   │   ├── hooks/        useAuth, useAuthActions
│   │   ├── slice/        authSlice
│   │   └── types/        User, AuthState, Zod schemas
│   ├── vendor/
│   ├── customer/
│   ├── cart/
│   ├── orders/
│   └── analytics/
│
├── shared/
│   ├── components/
│   │   ├── ui/           PasswordInput, Button, Modal, Skeleton…
│   │   └── layout/       AuthLayout, DashboardLayout, StorefrontLayout
│   ├── hooks/            useDebounce, usePagination…
│   ├── utils/            axiosInstance, formatters…
│   └── types/            Shared TypeScript types
│
├── mocks/
│   ├── browser.ts        MSW setupWorker
│   └── handlers/         auth, products, orders, users, analytics
│
└── pages/                Route-level page components
    ├── auth/             LoginPage, RegisterPage, EmailVerificationPage
    ├── vendor/           DashboardPage, ProductsPage, OrdersPage, AnalyticsPage
    └── customer/         StorefrontPage, ProductDetailPage, CartPage…
```

---

## Development Roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Project foundation — Vite, Tailwind, ESLint, routing skeleton, MSW | ✅ Done |
| 2 | Authentication — login, register, email verification, role guards | ✅ Done |
| 3 | Vendor Dashboard — product CRUD, order management, analytics | ✅ Done |
| 4 | Customer Storefront — catalogue, search, filters, product detail | ✅ Done |
| 5 | Cart & Checkout — cart slice, multi-step checkout, order confirm | ✅ Done |
| 6 | RTK Query migration — replace all Axios calls | ✅ Done |
| 7 | Polish — code splitting, skeletons, error boundaries, a11y | Upcoming |
| 8 | Testing — 60 test cases, Vitest + Playwright | Upcoming |
| 9 | Deployment — Vercel + GitHub Actions CI/CD | Upcoming |

---

## CV Talking Points

- "Implemented JWT authentication with role-based access control across three user types"
- "Used MSW v2 to mock a 24-endpoint REST API across 5 modules, enabling full UI development without a backend"
- "Applied the domain-sliced architecture pattern to separate vendor, customer, and auth concerns"
- "Separated server state (RTK Query) from client state (Redux slices) to avoid cache duplication"
- "Implemented optimistic UI updates with rollback on error for order status changes and wishlist"
- "Implemented skeleton loaders on all async surfaces, eliminating layout shift during data fetches (React.lazy code splitting planned for Phase 7)"
