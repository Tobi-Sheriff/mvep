# MVEP Test Cases & Scenarios

> 60 test cases across 8 modules. Status: building progressively alongside implementation.  
> Framework: Vitest + React Testing Library (unit/integration) · Playwright (E2E)

---

## Module 1 — Authentication (TC-001 to TC-010)

| ID | Title | Type | Priority |
|----|-------|------|----------|
| TC-001 | Login with valid customer credentials | Integration | High |
| TC-002 | Login with valid vendor credentials | Integration | High |
| TC-003 | Login with invalid password shows error | Integration | High |
| TC-004 | Login form Zod validation — empty fields | Unit | Medium |
| TC-005 | Login form Zod validation — malformed email | Unit | Medium |
| TC-006 | Register new customer account | Integration | High |
| TC-007 | Register new vendor account | Integration | High |
| TC-008 | Register with duplicate email shows 409 error | Integration | High |
| TC-009 | Email verification — correct code logs user in | Integration | High |
| TC-010 | Email verification — wrong code shows error | Integration | High |
| TC-011 | Logout clears Redux state and localStorage | Unit | High |
| TC-012 | Auth state persists across page refresh (localStorage) | Integration | High |

---

## Module 2 — Route Guards (TC-013 to TC-018)

| ID | Title | Type | Priority |
|----|-------|------|----------|
| TC-013 | Unauthenticated user redirected to /login on vendor route | E2E | High |
| TC-014 | Customer role blocked from /vendor/* routes | Integration | High |
| TC-015 | Vendor role blocked from /store/orders (customer-only) | Integration | High |
| TC-016 | Admin accesses /vendor/dashboard successfully | Integration | Medium |
| TC-017 | PrivateRoute preserves intended destination via location.state | Integration | Medium |
| TC-018 | /verify-email without pendingVerification redirects to /register | Integration | Medium |

---

## Module 3 — Vendor Product Management (TC-019 to TC-028)

| ID | Title | Type | Priority |
|----|-------|------|----------|
| TC-019 | Products table loads and displays vendor's products | Integration | High |
| TC-020 | Add product form validates required fields | Unit | High |
| TC-021 | Successful product creation adds row to table | Integration | High |
| TC-022 | Edit product pre-populates form with existing data | Integration | High |
| TC-023 | Successful product update reflects in table | Integration | High |
| TC-024 | Delete product shows confirmation dialog | Integration | Medium |
| TC-025 | Confirmed delete removes product from list | Integration | High |
| TC-026 | Product list shows skeleton loaders while fetching | Integration | Medium |
| TC-027 | Product list handles API error with error boundary | Integration | Medium |
| TC-028 | Bulk delete removes multiple selected products | Integration | Low |

---

## Module 4 — Vendor Orders & Analytics (TC-029 to TC-036)

| ID | Title | Type | Priority |
|----|-------|------|----------|
| TC-029 | Order list displays vendor's orders | Integration | High |
| TC-030 | Order status update dispatches PATCH and shows optimistic update | Integration | High |
| TC-031 | Order status reverts on API error (optimistic rollback) | Integration | High |
| TC-032 | Analytics page renders revenue Recharts line chart | Integration | Medium |
| TC-033 | Analytics period selector updates chart data (7d/30d/90d/1y) | Integration | Medium |
| TC-034 | Overview stat cards show correct values | Integration | Medium |
| TC-035 | Analytics error state shows friendly message | Integration | Low |
| TC-036 | Top products table renders correctly | Integration | Low |

---

## Module 5 — Customer Product Catalogue (TC-037 to TC-044)

| ID | Title | Type | Priority |
|----|-------|------|----------|
| TC-037 | Storefront loads product grid with skeleton loaders | Integration | High |
| TC-038 | Search input debounces and updates product list | Integration | High |
| TC-039 | Category filter narrows results | Integration | High |
| TC-040 | Price range filter narrows results | Integration | Medium |
| TC-041 | Pagination navigates to next/previous page | Integration | Medium |
| TC-042 | Product detail page renders correct product data | Integration | High |
| TC-043 | Wishlist toggle adds/removes product (optimistic UI) | Integration | Medium |
| TC-044 | Invalid product ID shows 404 state | Integration | Medium |

---

## Module 6 — Shopping Cart (TC-045 to TC-050)

| ID | Title | Type | Priority |
|----|-------|------|----------|
| TC-045 | Add to cart updates cart icon badge count | Integration | High |
| TC-046 | Cart drawer shows correct items and totals | Integration | High |
| TC-047 | Increase/decrease quantity updates line total | Unit | High |
| TC-048 | Remove item from cart removes it from drawer | Integration | High |
| TC-049 | Cart state persists to localStorage across refresh | Integration | High |
| TC-050 | Cart is cleared after successful order placement | Integration | High |

---

## Module 7 — Checkout Flow (TC-051 to TC-056)

| ID | Title | Type | Priority |
|----|-------|------|----------|
| TC-051 | Address step validates required fields before next | Unit | High |
| TC-052 | Payment step validates card fields | Unit | High |
| TC-053 | Review step shows order summary correctly | Integration | High |
| TC-054 | Successful order POST returns to confirmation page with order ID | E2E | High |
| TC-055 | Checkout blocked if cart is empty | Integration | Medium |
| TC-056 | Back button returns to previous step without losing data | Integration | Medium |

---

## Module 8 — Performance & Error Handling (TC-057 to TC-060)

| ID | Title | Type | Priority |
|----|-------|------|----------|
| TC-057 | Global error boundary catches unhandled throws and shows fallback | Integration | High |
| TC-058 | Lazy-loaded route chunks load via React.lazy + Suspense | Integration | Medium |
| TC-059 | 401 response triggers auto-logout via Axios interceptor | Integration | High |
| TC-060 | App loads within 3s on simulated 3G (Lighthouse Performance ≥ 90) | E2E | Medium |

---

## Running tests

```bash
# Unit + integration
npm test

# Watch mode
npm test -- --watch

# Coverage (target: ≥80% feature code)
npm run test:coverage

# E2E
npm run test:e2e
```
