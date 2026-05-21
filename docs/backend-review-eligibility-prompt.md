# Backend Prompt — Review Eligibility Gate

Paste this into a Claude session on the **backend (MVEP) repo**.

---

## Context

The frontend currently has a `POST /api/v1/products/:id/reviews` endpoint wired up.
We need the backend to enforce a purchase-and-delivery eligibility rule before allowing
a review to be submitted. The rule must be enforced server-side — the frontend will also
check client-side to conditionally show the form, but the backend is the authority.

---

## Rule

A customer may only submit a review for a product if **all** of the following are true:

1. The request is authenticated (existing requirement — return `401` if not).
2. The authenticated user has the role `customer`.
3. The customer has at least one **order with status `delivered`** that contains the product being reviewed (matched by `productId`).
4. The customer has not already reviewed this product (existing requirement — return `409` if duplicate).

If condition 2 or 3 is not met, return:
```json
// 403
{ "message": "You can only review products you have purchased and received" }
```

---

## Changes required

### `POST /api/v1/products/:id/reviews`

Add the following validation **before** creating the review:

```
1. Decode the JWT to get the authenticated userId and role.
2. If role !== 'customer', return 403.
3. Query the orders table/collection for any order where:
     - customerId === userId
     - status === 'delivered'
     - items array contains an entry with productId === params.id
4. If no such order exists, return 403.
5. Proceed with existing duplicate-check (409) and review creation (201).
```

---

## No new endpoints needed

The frontend determines eligibility client-side by inspecting the response from
`GET /api/v1/orders/my` (which it already fetches for Order History).
It checks whether any returned order has `status === 'delivered'` and contains
the current `productId` in its `items` array.

The backend enforcement above is the authoritative guard — the frontend check
only controls whether the form is rendered, not whether the submission succeeds.

---

## Updated error table for `POST /api/v1/products/:id/reviews`

| Status | Condition |
|--------|-----------|
| `201` | Review created successfully |
| `400` | `rating` is not an integer between 1 and 5 |
| `401` | No valid auth token |
| `403` | Caller is not a customer, or has no delivered order for this product |
| `404` | Product not found |
| `409` | Customer has already reviewed this product |

---

## No other endpoints change.
