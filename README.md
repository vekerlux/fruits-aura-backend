# Fruits Aura Backend

Backend API for the Fruits Aura application built with Node.js, Express, and MongoDB.

## Features

- ✅ User authentication (JWT)
- ✅ Product management
- ✅ Order processing
- ✅ Review system
- ✅ Admin panel API
- ✅ Role-based access control
- ✅ Security middleware (Helmet, CORS, Rate limiting)

## Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration

# Start development server
npm run dev

# Or start production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/:id` - Get product details

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review (auth required)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

### Admin (Admin only)
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/orders` - All orders
- `PATCH /api/admin/orders/:id/status` - Update order status
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

## Environment Variables

See `.env.example` for required variables.

## Database Models

- User
- Product
- Order
- Review

## Security

- JWT authentication
- Password hashing (bcrypt)
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation

## TODO

- [ ] Set up MongoDB (local or cloud)
- [ ] Seed initial product data
- [ ] Configure email service
- [ ] Set up Stripe account
- [ ] Test all endpoints
- [ ] Deploy to production
