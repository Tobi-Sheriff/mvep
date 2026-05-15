# MVEP API Contract

> All endpoints are mocked via MSW v2. Base URL: `/api/v1`  
> Auth: `Authorization: Bearer <token>` on all protected routes.

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
{ "requiresVerification": true, "email": "string", "devCode": "string (dev only)" }

// Response 409 — email already in use
{ "message": "Email already in use" }
```

### POST `/auth/verify-email`
```json
// Request
{ "email": "string", "code": "string (6 digits)" }

// Response 200
{ "user": { "id": "string", "name": "string", "email": "string", "role": "customer|vendor|admin" }, "token": "string" }

// Response 400 — invalid code
{ "message": "Invalid or expired verification code" }
```

### POST `/auth/login`
```json
// Request
{ "email": "string", "password": "string" }

// Response 200
{ "user": { "id": "string", "name": "string", "email": "string", "role": "customer|vendor|admin" }, "token": "string" }

// Response 401 — wrong credentials
{ "message": "Invalid email or password" }
```

---

## Products — `/api/v1/products`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/products` | — | — | List products (paginated, filterable) |
| GET | `/products/:id` | — | — | Get single product |
| POST | `/products` | ✓ | vendor/admin | Create product |
| PUT | `/products/:id` | ✓ | vendor/admin | Update product |
| DELETE | `/products/:id` | ✓ | vendor/admin | Delete product |

### GET `/products`
```
Query params:
  page=1        (default: 1)
  limit=12      (default: 12)
  search=string
  category=string
  minPrice=number
  maxPrice=number
  rating=number (minimum rating)
  sort=price_asc|price_desc|newest|popular
```
```json
// Response 200
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": 0,
      "category": "string",
      "stock": 0,
      "rating": 0,
      "reviewCount": 0,
      "images": ["string"],
      "vendorId": "string",
      "vendorName": "string",
      "createdAt": "ISO string"
    }
  ],
  "total": 0,
  "page": 1,
  "totalPages": 0
}
```

### POST `/products`
```json
// Request
{
  "name": "string",
  "description": "string",
  "price": 0,
  "category": "string",
  "stock": 0,
  "images": ["string"]
}
// Response 201 — product object
```

---

## Orders — `/api/v1/orders`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/orders` | ✓ | vendor/admin | List orders (vendor sees own) |
| GET | `/orders/my` | ✓ | customer | Customer's own orders |
| GET | `/orders/:id` | ✓ | any | Get single order |
| POST | `/orders` | ✓ | customer | Place new order |
| PATCH | `/orders/:id/status` | ✓ | vendor/admin | Update order status |

### POST `/orders`
```json
// Request
{
  "items": [{ "productId": "string", "quantity": 0 }],
  "shippingAddress": {
    "line1": "string", "city": "string", "state": "string",
    "postcode": "string", "country": "string"
  },
  "paymentMethod": "card"
}
// Response 201
{ "id": "string", "status": "pending", "total": 0, "createdAt": "ISO string" }
```

### PATCH `/orders/:id/status`
```json
// Request
{ "status": "pending|processing|shipped|delivered|cancelled" }
```

---

## Users — `/api/v1/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/profile` | ✓ | Get current user profile |
| PUT | `/users/profile` | ✓ | Update profile (name, avatar) |
| GET | `/users/wishlist` | ✓ | Get wishlist items |
| POST | `/users/wishlist/:productId` | ✓ | Add product to wishlist |
| DELETE | `/users/wishlist/:productId` | ✓ | Remove from wishlist |

---

## Analytics — `/api/v1/analytics`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/analytics/revenue` | ✓ | vendor/admin | Revenue over time |
| GET | `/analytics/products/top` | ✓ | vendor/admin | Top products by sales |
| GET | `/analytics/overview` | ✓ | vendor/admin | Dashboard stat cards |

### GET `/analytics/revenue`
```
Query: period=7d|30d|90d|1y
```
```json
// Response 200
{
  "data": [{ "date": "string", "revenue": 0, "orders": 0 }],
  "total": 0,
  "change": 0
}
```

### GET `/analytics/overview`
```json
// Response 200
{
  "totalRevenue": 0,
  "totalOrders": 0,
  "totalProducts": 0,
  "conversionRate": 0,
  "revenueChange": 0,
  "ordersChange": 0
}
```

---

## Seeded demo accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | customer@mvep.dev | password |
| Vendor | vendor@mvep.dev | password |
| Admin (super) | admin@mvep.dev | password |
