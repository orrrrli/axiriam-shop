# API Documentation

Complete reference for all API endpoints in Bean Haven Café.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

---

## Authentication

All protected endpoints require authentication via NextAuth.js session.

### Headers

```http
Content-Type: application/json
Cookie: next-auth.session-token=...
```

---

## Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:** `201 Created`
```json
{
  "message": "User created successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- `400` - Validation error
- `409` - User already exists
- `500` - Server error

---

### Products

#### Get All Products

```http
GET /api/products?category={category}&search={query}&featured={boolean}
```

**Query Parameters:**
- `category` (optional): `hot`, `cold`, `food`, or `all`
- `search` (optional): Search term for name/description
- `featured` (optional): `true` to get only featured products

**Response:** `200 OK`
```json
{
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Classic Flight",
      "description": "Our signature blend with notes of chocolate and caramel",
      "price": 3.99,
      "image": "https://example.com/image.jpg",
      "category": "hot",
      "inStock": true,
      "featured": true,
      "averageRating": 4.5,
      "totalReviews": 24,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Single Product

```http
GET /api/products/{id}
```

**Response:** `200 OK`
```json
{
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Classic Flight",
    "reviews": [
      {
        "user": "607f1f77bcf86cd799439012",
        "userName": "Sarah Johnson",
        "rating": 5,
        "comment": "Amazing coffee!",
        "createdAt": "2024-01-15T00:00:00.000Z"
      }
    ]
    // ... other product fields
  }
}
```

**Errors:**
- `404` - Product not found

#### Create Product (Admin Only)

```http
POST /api/products
Authorization: Required (Admin role)
```

**Request Body:**
```json
{
  "name": "New Brew",
  "description": "Delicious new coffee",
  "price": 4.99,
  "image": "https://example.com/image.jpg",
  "category": "hot",
  "featured": false
}
```

**Response:** `201 Created`

**Errors:**
- `401` - Unauthorized
- `400` - Validation error

#### Update Product (Admin Only)

```http
PUT /api/products/{id}
Authorization: Required (Admin role)
```

#### Delete Product (Admin Only)

```http
DELETE /api/products/{id}
Authorization: Required (Admin role)
```

---

### Orders

#### Get User Orders

```http
GET /api/orders
Authorization: Required
```

**Response:** `200 OK`
```json
{
  "orders": [
    {
      "_id": "607f1f77bcf86cd799439015",
      "user": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "items": [
        {
          "product": "507f1f77bcf86cd799439011",
          "productName": "Classic Flight",
          "quantity": 2,
          "price": 3.99
        }
      ],
      "shippingAddress": {
        "fullName": "John Doe",
        "address": "123 Main St",
        "city": "Seattle",
        "postalCode": "98101",
        "country": "USA",
        "phone": "(555) 123-4567"
      },
      "status": "processing",
      "totalPrice": 14.01,
      "isPaid": true,
      "trackingNumber": "WC2024020512345",
      "createdAt": "2024-02-05T00:00:00.000Z"
    }
  ]
}
```

#### Create Order

```http
POST /api/orders
Authorization: Required
```

**Request Body:**
```json
{
  "items": [
    {
      "product": "507f1f77bcf86cd799439011",
      "productName": "Classic Flight",
      "quantity": 2,
      "price": 3.99
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "address": "123 Main St",
    "city": "Seattle",
    "postalCode": "98101",
    "country": "USA",
    "phone": "(555) 123-4567"
  },
  "paymentMethod": "stripe",
  "itemsPrice": 7.98,
  "taxPrice": 0.64,
  "shippingPrice": 5.99,
  "totalPrice": 14.61
}
```

**Response:** `201 Created`

---

### Reviews

#### Add Product Review

```http
POST /api/reviews
Authorization: Required
```

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439011",
  "rating": 5,
  "comment": "Excellent coffee! Rich and smooth."
}
```

**Response:** `201 Created`

**Errors:**
- `401` - Unauthorized
- `400` - Already reviewed or validation error
- `404` - Product not found

---

### Contact

#### Submit Contact Form

```http
POST /api/contact
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "general",
  "message": "Your coffee is amazing!"
}
```

**Response:** `200 OK`

---

### Stripe

#### Create Payment Intent

```http
POST /api/stripe/create-payment-intent
Authorization: Required
```

**Request Body:**
```json
{
  "amount": 14.61,
  "orderId": "607f1f77bcf86cd799439015"
}
```

**Response:** `200 OK`
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

---

### Admin

#### Get Dashboard Statistics

```http
GET /api/admin/stats
Authorization: Required (Admin role)
```

**Response:** `200 OK`
```json
{
  "stats": {
    "totalOrders": 127,
    "totalProducts": 8,
    "totalUsers": 45,
    "totalRevenue": 1847.32,
    "avgOrderValue": 14.55,
    "recentOrders": [...]
  }
}
```

---

## Error Responses

All endpoints follow consistent error formatting:

```json
{
  "error": "Descriptive error message"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

*Currently not implemented. Recommended for production:*

- 100 requests per 15 minutes per IP for general endpoints
- 10 requests per 15 minutes for auth endpoints
- No limit for authenticated admin users

---

## Webhooks

### Stripe Webhooks

Configure in Stripe Dashboard → Developers → Webhooks:

**Endpoint URL**: `https://your-domain.com/api/stripe/webhook`

**Events to Listen:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

---

For more details, refer to the inline code documentation.
