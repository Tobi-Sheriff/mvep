# MVEP — Execution Plan

> Multi-Vendor E-Commerce Platform | React 18 · TypeScript · Redux Toolkit · RTK Query · Tailwind CSS

---

## Phase 1 — Project Foundation (Day 1–2)
**Goal:** Working dev server with typed routing skeleton and Tailwind styles.

### Steps
1. Scaffold Vite + React + TypeScript
2. Install all core + dev dependencies in one shot
3. Configure Tailwind CSS + PostCSS
4. Configure ESLint (flat config) + Prettier
5. Build complete folder structure (`features/`, `shared/`, `pages/`, `mocks/`)
6. Create Redux store skeleton
7. Create routing skeleton — placeholder pages for all 3 portals
8. Set up MSW v2 with empty handlers
9. Verify: `npm run dev` shows the app, all routes navigate

**Deliverable:** `http://localhost:5173` renders placeholder pages with working route navigation.

---

## Phase 2 — Authentication (Day 3–5)
**Goal:** JWT login/register with role-based route guarding.

### Steps
1. Build `authSlice` — user, token, role state in Redux
2. MSW handlers: `POST /api/v1/auth/login`, `/register`, `/refresh`, `/logout`
3. Login page + Register page with React Hook Form + Zod validation
4. `PrivateRoute` component — redirects to `/login` if no token
5. `RoleGuard` component — redirects if wrong role
6. Persist auth state to `localStorage`
7. Axios instance with Bearer token interceptor + auto-refresh on 401
8. Verify: Login as Customer → customer routes; Vendor → vendor routes; Admin → admin routes

**Deliverable:** Full auth flow with protected routes working against MSW.

---

## Phase 3 — Vendor Dashboard (Day 6–12)
**Goal:** Vendor can manage products, view orders, and see analytics charts.

### Steps
1. `DashboardLayout` — sidebar nav, header, logout button
2. Product CRUD — list table, add/edit modal (React Hook Form), delete confirmation
3. MSW handlers for all `/api/v1/products` endpoints
4. Order management — order list table, status update (Pending → Shipped → Delivered)
5. Analytics page — Recharts line chart (revenue), bar chart (orders/day), stat cards
6. Optimistic UI updates for status changes
7. Skeleton loaders on all loading states (zero spinners)
8. Error boundary wrapping the dashboard

**Deliverable:** Vendor portal fully functional against MSW.

---

## Phase 3b — Admin Console (Day 13–15)
**Goal:** Separate platform-owner portal at `/admin/*` — completely distinct from the vendor dashboard, with platform-wide visibility and user management.

### Steps
1. `AdminLayout` — sidebar nav with violet accent (distinguishable from vendor's blue), dark mode toggle, `ErrorBoundary` + `Suspense` around Outlet
2. Admin types — `AdminUser`, `AdminVendor`, `AdminStats`, query param + response types
3. MSW handlers (`/api/v1/admin/*`) — stats, users with search/role/status filters, status PATCH, vendors, all-platform orders
4. Export `orders` from `orders.ts` so admin handler shares the same live data array
5. RTK Query `adminApi` — `getAdminStats`, `getAdminUsers`, `updateUserStatus` (optimistic), `getAdminVendors`, `getAdminOrders`
6. `AdminOverviewPage` — 6 stat cards (revenue, orders, products, vendors, customers, new users) + recent orders + top vendors
7. `AdminUsersPage` — role tabs (All / Customer / Vendor / Admin), status filter, debounced search, paginated table, ban / suspend / activate with inline confirmation banner
8. `AdminVendorsPage` — vendor table with store name, owner, product count, order count, revenue, status
9. `AdminOrdersPage` — all platform orders (no vendor scoping), status filter tabs, paginated
10. Update `PrivateRoute` — admin role fallback → `/admin/overview`; vendor routes changed to `allowedRoles: ['vendor']` only
11. Update `StorefrontLayout` — admin user sees "Admin console" link; vendor user sees "Vendor portal" link (separated, no longer combined)

**Deliverable:** `admin@mvep.dev` lands at `/admin/overview` — a fully isolated portal with platform-wide stats and user management. Vendor and Admin portals are completely separate.

---

## Phase 4 — Customer Storefront (Day 16–21)
**Goal:** Customer can browse, search, and filter the product catalogue.

### Steps
1. `StorefrontLayout` — top nav, cart icon with badge, search bar
2. Product catalogue grid with pagination
3. Search + filter sidebar (category, price range, rating)
4. Product detail page (images, description, reviews, add-to-cart)
5. MSW handlers for product listing / search / detail
6. Wishlist toggle (add/remove)
7. Skeleton loaders for catalogue and detail pages

**Deliverable:** Customer can browse and view product details.

---

## Phase 5 — Cart & Checkout (Day 22–26)
**Goal:** End-to-end purchase flow with order confirmation.

### Steps
1. Cart state in Redux — add, remove, update quantity, clear
2. Cart drawer — slide-in panel with items + totals
3. Multi-step checkout: Address → Payment → Review → Confirm
4. Zod validation schema at each checkout step
5. MSW handler: `POST /api/v1/orders`
6. Order confirmation page with order ID
7. Order history page for customers

**Deliverable:** Customer can add to cart and complete a full checkout.

---

## Phase 6 — RTK Query Migration (Day 27–30)
**Goal:** Replace all manual Axios calls with RTK Query endpoints.

### Steps
1. Define the base API service (`createApi` with `baseUrl`)
2. Migrate auth endpoints → RTK Query mutations
3. Migrate product endpoints → RTK Query queries + mutations
4. Migrate order endpoints → RTK Query
5. Migrate analytics endpoints → RTK Query
6. Remove manual loading/error state from slices where RTK Query now handles it
7. Enable automatic cache invalidation between related endpoints

**Deliverable:** Zero manual fetch calls; all server state managed by RTK Query.

---

## Phase 7 — Polish & Performance (Day 31–34) ✅ Done
**Goal:** Production-quality UX and bundle size.

### Steps
1. Code splitting — `React.lazy` + `Suspense` on every route-level component
2. Global error boundary at `App.tsx` level
3. Feature-level error boundaries on dashboard sections
4. Audit all loading states — skeletons everywhere, no spinners
5. Accessibility pass — `aria-*` attributes, keyboard nav, focus management
6. Dark mode via Tailwind's `dark:` class strategy
7. Bundle analysis (`vite-bundle-visualizer`) — split any chunk over 200 kB

**Deliverable:** Lighthouse score ≥ 90, no critical a11y violations.

---

## Phase 8 — Testing (Day 35–39)
**Goal:** All 60 test cases from the spec implemented and passing.

### Steps
1. Vitest unit tests — auth slice, cart slice, Zod schemas, utility functions
2. React Testing Library integration tests — Login form, Product CRUD, Cart interactions
3. Playwright E2E tests — full auth flow, vendor product creation, customer purchase flow
4. MSW as the backend for all tests (already set up in Phase 1)
5. Coverage report — target ≥ 80% on feature code

**Deliverable:** `npm test` passes; `npm run test:e2e` passes.

---

## Phase 9 — Deployment (Day 40–41)
**Goal:** Live on Vercel with CI on every push.

### Steps
1. GitHub Actions workflow — lint → test → build on every PR
2. Vercel project setup + connect GitHub repo
3. Environment variables configured in Vercel dashboard
4. Preview deployments on PRs; production deploy on `main` merge
5. Final smoke test on live URL

**Deliverable:** Live URL + green CI badge in README.

---

## Tech Stack Reference

| Layer | Choice |
|---|---|
| Framework | React 18 (Concurrent Features) |
| Language | TypeScript 5 |
| Build | Vite 5 |
| State | Redux Toolkit 2 + RTK Query |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| Styles | Tailwind CSS (custom component library) |
| Charts | Recharts |
| Mock API | Mock Service Worker v2 |
| Tests | Vitest + RTL + Playwright |
| Deploy | Vercel + GitHub Actions |

## API Groups (32 endpoints across 6 groups)

- `POST /api/v1/auth/*` — login, register, verify-email, resend-verification, logout, me
- `GET/POST/PUT/DELETE /api/v1/products` — full product CRUD + reviews
- `GET/POST/PATCH /api/v1/orders` — orders for vendor + customer
- `GET/PUT /api/v1/users` — profile, wishlist add/remove
- `GET /api/v1/analytics/*` — vendor-scoped revenue, top products, overview
- `GET/PATCH /api/v1/admin/*` — platform stats, user management, all vendors, all orders

## Roles

| Role | Portal | Access |
|---|---|---|
| Customer | `/store/*` | Storefront, cart, checkout, wishlist, order history |
| Vendor | `/vendor/*` | Dashboard, product CRUD, order management, analytics (own store) |
| Admin | `/admin/*` | Platform overview, user management (ban/suspend), all vendors, all orders |
