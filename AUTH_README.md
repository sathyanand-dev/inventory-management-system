# Authentication System - Quick Guide

## 🔐 JWT Authentication Implemented

### Default Login Credentials
```
Email: manager@inventory.com
Password: manager123
Role: Inventory Manager
```

## Features

### Backend
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected routes with middleware
- ✅ User model with role (Inventory Manager)
- ✅ Login & Register endpoints
- ✅ Token expiration (7 days)

### Frontend
- ✅ Login/Register page with tabs
- ✅ Beautiful gradient UI design
- ✅ AuthContext for global state
- ✅ Private route protection
- ✅ Automatic token management
- ✅ Logout functionality
- ✅ User profile in navbar with avatar

## API Endpoints

### Public Routes
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Protected Routes
- `GET /auth/me` - Get current user
- `GET /items` - Get all items (requires token)
- `POST /items/add` - Create item (requires token)
- `PUT /items/:id` - Update item (requires token)
- `DELETE /items/:id` - Delete item (requires token)

## How to Use

### 1. Start Backend
```bash
cd backend
npm start
```

### 2. Start Frontend
```bash
cd frontend
npm start
```

### 3. Access the Application
- Open browser to `http://localhost:3000`
- You'll be redirected to login page
- Use the default credentials above or register a new user
- After login, you'll have access to all inventory features

## Token Storage
- Tokens are stored in `localStorage`
- Automatically added to all API requests
- Auto-logout on token expiration or invalid token

## Security Features
- Passwords are hashed before storing
- JWT tokens for stateless authentication
- Protected routes on both frontend and backend
- Automatic token validation on each request
- 401 redirects to login page

## Creating New Users
Users can register through the application or you can run the seed script:
```bash
cd backend
node seedUser.js
```

Enjoy your secure inventory management system! 🚀
