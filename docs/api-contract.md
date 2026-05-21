# MVEP API Contract

> **Single source of truth for all request/response shapes.**
> Base URL: `/api/v1`
> Auth: `Authorization: Bearer <token>` on all protected routes.
> All errors return `{ "message": "string" }`.

---

## Auth — `/api/v1/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | — | Register new user, triggers email verification |
| POST | `/auth/verify-email` | — | Submit 6-digit verification code |
| POST | `/auth/resend-verification` | — | Resend verification code |
| POST | `/auth/login` | — | Login with email + password |
| POST | `/auth/logout` | ✓ | Invalidate session |
| GET | `/auth/me` | ✓ | Get current authenticated user |

### POST `/auth/register`
```json
// Request
{ "name": "string", "email": "string", "password": "string", "role": "customer|vendor" }

// Response 201
{ "requiresVerification": true, "email": "string" }

// Response 201 — development only (NODE_ENV=development)
{ "requiresVerification": true, "email": "string", "devCode": "string" }

// Response 400 — admin role attempted
{ "message": "Cannot self-register as admin" }

// Response 409 — email in use
{ "message": "Email already in use" }
```

### POST `/auth/verify-email`
```json
// Request
{ "email": "string", "code": "string" }

// Response 200
{
  "user": { "id": "string", "name": "string", "email": "string", "role": "customer|vendor|admin", "avatar": null },
  "token": "string"
}

// Response 400 — wrong or expired code
{ "message": "Invalid or expired verification code" }
```

### POST `/auth/login`
```json
// Request
{ "email": "string", "password": "string" }

// Response 200
{
  "user": { "id": "string", "name": "string", "email": "string", "role": "customer|vendor|admin", "avatar": null },
  "token": "string"
}

// Response 401 — wrong credentials
{ "message": "Invalid email or password" }

// Response 403 — unverified account
{ "message": "Please verify your email before logging in" }

// Response 403 — suspended or banned
{ "message": "Account suspended" | "Account banned" }
```

---

## Products — `/api/v1/products`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/products` | — | — | List products (paginated, filterable) |
| GET | `/products/:id` | — | — | Get single product |
| GET | `/products/:id/reviews` | — | — | Get product reviews |
| POST | `/products` | ✓ | vendor/admin | Create product |
| PUT | `/products/:id` | ✓ | vendor/admin | Update product |
| DELETE | `/products/:id` | ✓ | vendor/admin | Delete product |

### GET `/products`
```
Query params:
  page=1           (default: 1)
  limit=12         (default: 12)
  search=string    full-text on name + description
  category=string  exact match
  minPrice=number
  maxPrice=number
  rating=number    minimum average rating
  sort=newest|price_asc|price_desc|popular
```
```json
// Response 200
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": 0.00,
      "stock": 0,
      "category": "string",
      "images": ["string"],
      "rating": 0.0,
      "reviewCount": 0,
      "vendorId": "string",
      "vendorName": "string",
      "createdAt": "ISO 8601"
    }
  ],
  "total": 0,
  "page": 1,
  "totalPages": 0
}
```

### GET `/products/:id/reviews`
```json
// Response 200
[
  {
    "id": "string",
    "userId": "string",
    "userName": "string",
    "rating": 0,
    "comment": "string",
    "createdAt": "ISO 8601"
  }
]
```

### POST `/products`
> `vendorId` is derived server-side from the token. `image` (primary) is derived as `images[0]`.
```json
// Request
{
  "name": "string",
  "description": "string",
  "price": 0.00,
  "stock": 0,
  "category": "Electronics|Clothing|Home & Garden|Sports|Books|Toys|Beauty|Food",
  "images": ["string"]
}

// Response 201
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": 0.00,
  "stock": 0,
  "category": "string",
  "image": "string",
  "vendorId": "string",
  "createdAt": "ISO 8601"
}

// Response 403 — customer token
{ "message": "Forbidden" }
```

---

## Orders — `/api/v1/orders`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/orders` | ✓ | vendor/admin | All orders |
| GET | `/orders/my` | ✓ | customer | Customer's own orders |
| GET | `/orders/:id` | ✓ | any | Get single order |
| POST | `/orders` | ✓ | customer | Place new order |
| PATCH | `/orders/:id/status` | ✓ | vendor/admin | Update order status |

### POST `/orders`
> `productName`, `unitPrice`, and `total` are computed server-side — never sent by the client.
```json
// Request
{
  "items": [{ "productId": "string", "quantity": 1 }],
  "shippingAddress": {
    "line1": "string",
    "city": "string",
    "state": "string",
    "postcode": "string",
    "country": "string"
  },
  "paymentMethod": "card"
}

// Response 201
{
  "id": "string",
  "customerId": "string",
  "customerName": "string",
  "customerEmail": "string",
  "items": [{ "productId": "string", "productName": "string", "quantity": 1, "unitPrice": 0.00 }],
  "status": "pending",
  "total": 0.00,
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601"
}

// Response 404 — unknown productId
{ "message": "Product not found: <productId>" }

// Response 409 — insufficient stock
{ "message": "Insufficient stock for: <productName>" }
```

### PATCH `/orders/:id/status`
```json
// Request
{ "status": "processing|shipped|delivered|cancelled" }

// Response 200 — updated Order object

// Response 400 — invalid transition
{ "message": "Invalid status transition: <current> → <requested>" }
```

---

## Users — `/api/v1/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/profile` | ✓ | Get current user profile |
| PUT | `/users/profile` | ✓ | Update profile (name, avatar) |
| GET | `/users/wishlist` | ✓ | Get wishlist (array of product IDs) |
| POST | `/users/wishlist/:productId` | ✓ | Add to wishlist (idempotent) |
| DELETE | `/users/wishlist/:productId` | ✓ | Remove from wishlist (idempotent) |

```json
// GET /users/wishlist — Response 200
["p1", "p3", "p11"]

// POST /users/wishlist/:productId — Response 200
{ "productId": "string", "added": true }

// DELETE /users/wishlist/:productId — Response 200
{ "productId": "string", "removed": true }
```

---

## Analytics — `/api/v1/analytics`

All analytics endpoints: **Protected — vendor or admin.** Scoped to the authenticated vendor's data.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/overview` | Dashboard stat cards |
| GET | `/analytics/revenue` | Revenue over time |
| GET | `/analytics/products/top` | Top 5 products by revenue |

### GET `/analytics/overview`
```json
// Response 200
{
  "totalRevenue": 0.00,
  "totalOrders": 0,
  "totalProducts": 0,
  "totalCustomers": 0,
  "revenueChange": 0.0,
  "ordersChange": 0.0
}
```

### GET `/analytics/revenue`
```
Query: period=7d|30d|90d|1y
```
```json
// Response 200
{
  "data": [{ "date": "YYYY-MM-DD", "revenue": 0.00, "orders": 0 }],
  "total": 0.00,
  "change": 0.0
}
```

### GET `/analytics/products/top`
```json
// Response 200
[{ "id": "string", "name": "string", "revenue": 0.00, "unitsSold": 0 }]
```

---

## Admin — `/api/v1/admin`

**All admin endpoints require `role === 'admin'`. Returns `403` for any other role.**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/stats` | Platform-wide statistics |
| GET | `/admin/users` | All users (filterable) |
| GET | `/admin/users/:id` | Single user |
| PATCH | `/admin/users/:id/status` | Ban / suspend / activate user |
| GET | `/admin/vendors` | All vendors |
| GET | `/admin/orders` | All orders (platform-wide) |
| GET | `/admin/analytics/revenue` | Platform revenue (unscoped) |

### GET `/admin/stats`
```json
// Response 200
{
  "totalRevenue": 0.00,
  "totalOrders": 0,
  "totalProducts": 0,
  "totalVendors": 0,
  "totalCustomers": 0,
  "totalUsers": 0,
  "revenueChange": 0.0,
  "ordersChange": 0.0,
  "newUsersThisMonth": 0
}
```

### GET `/admin/users`
```
Query: role, status, search (name/email), page, limit (default 20)
```
```json
// Response 200
{
  "users": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "customer|vendor|admin",
      "status": "active|suspended|banned",
      "isVerified": true,
      "avatar": null,
      "createdAt": "ISO 8601"
    }
  ],
  "total": 0,
  "page": 1,
  "totalPages": 0
}
```

### PATCH `/admin/users/:id/status`
```json
// Request
{ "status": "active|suspended|banned", "reason": "string (optional)" }

// Response 200
{ "id": "string", "status": "string", "updatedAt": "ISO 8601" }

// Response 400 — self-ban attempt
{ "message": "Cannot change your own status" }
```

### GET `/admin/vendors`
```json
// Response 200
{
  "vendors": [
    {
      "id": "string",
      "userId": "string",
      "storeName": "string",
      "userStatus": "active|suspended|banned",
      "productCount": 0,
      "totalRevenue": 0.00,
      "totalOrders": 0,
      "createdAt": "ISO 8601"
    }
  ],
  "total": 0
}
```

### GET `/admin/analytics/revenue`
```
Query: period=7d|30d|90d|1y
```
```json
// Response 200 — same shape as /analytics/revenue but unscoped (all vendors)
{
  "data": [{ "date": "YYYY-MM-DD", "revenue": 0.00, "orders": 0 }],
  "total": 0.00,
  "change": 0.0
}
```

---

## Seeded demo accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | customer@mvep.dev | password |
| Vendor | vendor@mvep.dev | password |
| Admin | admin@mvep.dev | password |
