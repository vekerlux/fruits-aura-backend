# Quick Start Guide

## 🚀 Getting Started

### 1. Set Up MongoDB Atlas

Follow the detailed guide in `MONGODB_SETUP.md` to:
- Create free MongoDB Atlas account
- Create a cluster
- Get your connection string
- Update `.env` file

**Quick summary:**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free M0 cluster
3. Create database user
4. Allow network access (0.0.0.0/0)
5. Copy connection string
6. Update `MONGODB_URI` in `.env`

### 2. Seed Database

```bash
npm run seed
```

This will:
- Create admin user (admin@fruitsaura.com / Admin123!)
- Add 8 fruit drinks to database

### 3. Start Server

```bash
npm run dev
```

Server runs on: http://localhost:5000

### 4. Test API

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User"
  }'
```

**Get Products:**
```bash
curl http://localhost:5000/api/products
```

## 📁 Project Structure

```
fruits-aura-backend/
├── src/
│   ├── models/          # Database schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Review.js
│   ├── routes/          # API endpoints
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── reviews.js
│   │   ├── users.js
│   │   └── admin.js
│   ├── controllers/     # Business logic
│   │   └── authController.js
│   ├── middleware/      # Auth, validation
│   │   └── auth.js
│   ├── utils/           # Helper functions
│   │   └── jwt.js
│   ├── scripts/         # Database scripts
│   │   └── seedDatabase.js
│   └── server.js        # Express app
├── .env                 # Environment variables
├── .env.example         # Template
├── package.json
└── README.md
```

## 🔐 Default Credentials

**Admin Account:**
- Email: admin@fruitsaura.com
- Password: Admin123!

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Seed database
npm run seed
```

## 📝 Environment Variables

Key variables in `.env`:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secrets
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Server
PORT=5000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:5173
```

## ✅ Verification Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Connection string added to `.env`
- [ ] Database seeded successfully
- [ ] Backend server starts without errors
- [ ] Can register a new user
- [ ] Can retrieve products
- [ ] Ready to integrate with frontend!

## 🎯 Next Steps

1. **Test all endpoints** - Use Postman or curl
2. **Integrate frontend** - Connect React app to API
3. **Add authentication** - Login/signup pages
4. **Build admin panel** - Product management UI
5. **Deploy** - Railway, Render, or Vercel

## 📚 API Documentation

See `README.md` for complete API endpoint documentation.

## 🆘 Troubleshooting

**MongoDB connection fails:**
- Check connection string in `.env`
- Verify network access in Atlas (0.0.0.0/0)
- Confirm database user credentials

**Server won't start:**
- Check if port 5000 is available
- Verify all dependencies installed
- Check `.env` file exists

**Seed script fails:**
- Ensure MongoDB connection works
- Check `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`

---

Need help? Check `MONGODB_SETUP.md` for detailed MongoDB setup instructions!
