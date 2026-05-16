<div align="center">

# 🛒 Multi-Vendor E-Commerce Platform

**MVEP** is an enterprise-grade React SPA featuring a dual-portal architecture — a full **Vendor Dashboard** and a **Customer Storefront** — with role-based access control, JWT authentication, and domain-sliced state management.

<br/>

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.3-764ABC?style=flat-square&logo=redux)](https://redux-toolkit.js.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Vitest](https://img.shields.io/badge/Vitest-2.x-6E9F18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev)

<br/>

[**Live Demo →**](https://mvep.vercel.app) &nbsp;|&nbsp; [API Contract](./docs/api-contract.md) &nbsp;|&nbsp; [Test Cases](./docs/test-cases.md) &nbsp;|&nbsp; [Project Spec](./docs/project-spec.md)

</div>

---

## 📸 Screenshots

> _Add screenshots here once the UI is built. Suggested: Landing page, Vendor Dashboard with analytics chart, Product catalogue, Checkout flow._

---

## ✨ Features

### Vendor Dashboard (`/vendor/*`)

- **Product management** — full CRUD with search, category filter, stock tracking, and paginated product table
- **Order management** — status workflow (Pending → Processing → Shipped → Delivered), filterable by status, optimistic updates with rollback
- **Analytics** — revenue line chart (7d / 30d / 90d / 1y), daily orders bar chart, top products table, period selector

### Customer Storefront (`/store/*`)

- **Product catalogue** — paginated grid, real-time search with debounce, sidebar filters (category, price range, star rating)
- **Product detail** — image gallery, reviews, quantity picker, add-to-cart, wishlist toggle
- **Wishlist** — dedicated page, optimistic toggle with rollback
- **Shopping cart** — _(Phase 5)_ quantity management, localStorage persistence
- **Multi-step checkout** — _(Phase 5)_ Address → Payment → Review → Confirmation with Zod validation
- **Order history** — _(Phase 5)_ per-order status timeline

### Platform-wide

- 🔐 JWT authentication with three roles: **Customer**, **Vendor**, **Admin**
- 🛡️ Protected routes with role-based access guards
- 💀 Skeleton loaders on all async surfaces (no spinners)
- 🚨 Error Boundaries at global and feature level
- ♿ Semantic HTML, keyboard-navigable interactive elements

---

## 🏗️ Architecture

![MVEP Component Architecture](./docs/mvep_component_architecture.svg)

```
src/
├── app/                    # Redux store, router, typed hooks
├── features/               # Domain-sliced feature modules
│   ├── auth/               # Login, register, email verification, role guards
│   ├── vendor/             # Dashboard, products, orders, analytics
│   ├── customer/           # Storefront, product detail, wishlist
│   ├── cart/               # Cart slice + types
│   ├── orders/             # Order types
│   └── analytics/          # Analytics types + hooks
├── shared/
│   ├── components/
│   │   ├── ui/             # Custom UI primitives (Skeleton, Badge, Modal…)
│   │   └── layout/         # AuthLayout, DashboardLayout, StorefrontLayout
│   ├── hooks/              # useDebounce
│   └── utils/              # axiosInstance (Axios + auth interceptor), cn()
├── mocks/                  # MSW v2 handlers + fixture data
└── pages/                  # Route-level page components
    ├── auth/               # LoginPage, RegisterPage, EmailVerificationPage
    ├── vendor/             # DashboardPage, ProductsPage, OrdersPage, AnalyticsPage
    └── customer/           # StorefrontPage, ProductDetailPage, CartPage…
```

### State management approach

| Concern                               | Tool                                           | Why                                                       |
| ------------------------------------- | ---------------------------------------------- | --------------------------------------------------------- |
| Remote data (products, orders, users) | Axios + custom hooks (RTK Query in Phase 6)    | Manual `useEffect` fetch now; tag-based caching planned   |
| Auth state                            | Redux slice (`authSlice`)                      | Persists across routes, readable by any component         |
| Cart state                            | Redux slice (`cartSlice`)                      | Synced to localStorage, optimistic updates                |
| UI state (modals, filters)            | Local `useState`                               | Scoped — no reason to globalise                           |
| Form state                            | React Hook Form + Zod                          | Uncontrolled inputs, schema validation, zero re-renders   |

> **Key architectural decision:** Server state (remote data) will move to RTK Query in Phase 6 while Redux slices handle client state (auth, cart). This separation avoids caching remote data in Redux unnecessarily.

---

## 🛠️ Tech Stack

| Layer      | Technology                                  |
| ---------- | ------------------------------------------- |
| Framework  | React 18 (Concurrent Features)              |
| Language   | TypeScript 5                                |
| Build tool | Vite 5                                      |
| Routing    | React Router v6 (nested, protected routes)  |
| State      | Redux Toolkit 2 (RTK Query migration in Phase 6) |
| Forms      | React Hook Form + Zod                            |
| Styling    | Tailwind CSS (custom component library)          |
| Charts     | Recharts                                    |
| Mock API   | Mock Service Worker (MSW v2)                |
| Testing    | Vitest + React Testing Library + Playwright |
| Deployment | Vercel + GitHub Actions CI/CD               |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 20`
- npm `>= 10`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/mvep.git
cd mvep

# 2. Install dependencies
npm install

# 3. Start the dev server (MSW auto-starts in development)
npm run dev
```

The app runs at `http://localhost:5173`. MSW intercepts all `/api/v1` calls automatically — no backend or environment variables needed.

### Test accounts (MSW fixture data)

| Role     | Email             | Password    |
| -------- | ----------------- | ----------- |
| Customer | customer@mvep.dev | password |
| Vendor   | vendor@mvep.dev   | password |
| Admin    | admin@mvep.dev    | password |

---

## 🧪 Testing

```bash
# Unit + integration tests
npm run test

# Tests with UI (browser-based Vitest UI)
npm run test:ui

# Coverage report
npm run test:coverage

# End-to-end (Playwright)
npm run test:e2e
```

### Coverage targets

| Level       | Target         | Scope                                             |
| ----------- | -------------- | ------------------------------------------------- |
| Unit        | 80%+           | Redux slices, utility functions, custom hooks     |
| Integration | 70%+           | Components with API calls (MSW), form submissions |
| E2E         | Critical paths | Login, add-to-cart, checkout, vendor CRUD         |

See [`/docs/MVEP_Test_Cases_and_Scenarios.docx`](./docs/MVEP_Test_Cases_and_Scenarios.docx) for the full test case register (60 documented cases across 8 modules).

---

## 📡 API

All endpoints are mocked with MSW. Base URL: `/api/v1`

| Module    | Endpoints                                                                                               |
| --------- | ------------------------------------------------------------------------------------------------------- |
| Auth      | `POST /auth/register` · `POST /auth/verify-email` · `POST /auth/resend-verification` · `POST /auth/login` · `POST /auth/logout` · `GET /auth/me` |
| Products  | `GET /products` · `GET /products/:id` · `POST /products` · `PUT /products/:id` · `DELETE /products/:id` |
| Orders    | `GET /orders` · `GET /orders/:id` · `PATCH /orders/:id/status` · `POST /orders`                          |
| Users     | `GET /users/profile` · `PUT /users/profile` · `GET /users/wishlist` · `POST/DELETE /users/wishlist/:id` |
| Analytics | `GET /analytics/revenue` · `GET /analytics/products/top` · `GET /analytics/overview`                    |

Full endpoint reference including request bodies, query parameters, and response schemas: [`/docs/MVEP_API_Contract.docx`](./docs/MVEP_API_Contract.docx)

---

## 📋 Available Scripts

| Script                  | Description                           |
| ----------------------- | ------------------------------------- |
| `npm run dev`           | Start Vite dev server with MSW        |
| `npm run build`         | TypeScript compile + production build |
| `npm run preview`       | Serve production build locally        |
| `npm run lint`          | ESLint across all TS/TSX files        |
| `npm run test`          | Vitest unit + integration tests       |
| `npm run test:ui`       | Vitest browser UI                     |
| `npm run test:coverage` | Coverage report                       |
| `npm run test:e2e`      | Playwright E2E tests                  |

---

## 📂 Documentation

All project documentation lives in the `/docs` folder:

| Document                                                                                                             | Description                                                             |
| -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [`project-spec.md`](./docs/project-spec.md)                                     | Full technical specification — architecture, features, roadmap, CV prep |
| [`api-contract.md`](./docs/api-contract.md)                                     | Complete API reference including request/response schemas                |
| [`test-cases.md`](./docs/test-cases.md)                                         | 60 documented test cases across 8 modules                               |
| [`mvep_component_architecture.svg`](./docs/mvep_component_architecture.svg)     | Interactive component hierarchy diagram — all 8 layers                  |

---

## 🗺️ Roadmap

- [x] Project scaffolding and architecture
- [x] Authentication — login, register, email verification, role-based guards
- [x] Vendor dashboard — product CRUD
- [x] Vendor dashboard — order management
- [x] Vendor dashboard — analytics charts
- [x] Customer storefront — product catalogue, search, filters, pagination
- [x] Customer storefront — product detail, reviews, wishlist
- [x] Customer storefront — cart, multi-step checkout, order history
- [ ] RTK Query migration (replace all manual fetches)
- [ ] Performance polish (code splitting, skeletons, error boundaries)
- [ ] Test suite (unit + integration + E2E)
- [ ] Deployment (Vercel + GitHub Actions)

---

## 📄 License

MIT — see [LICENSE](./LICENSE) for details.

---

<div align="center">

Built with React 18 · Redux Toolkit · Tailwind CSS · Mock Service Worker

</div>
