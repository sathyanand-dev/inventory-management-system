# Inventory Management System

A full-stack inventory management application built with the MERN stack.

## Features

- Add, view, update, and delete inventory items with ₹ (INR) currency
- User authentication with JWT (7-day token expiration)
- Role-based access control with protected routes
- Low stock alerts with configurable threshold (default: 10 units)
- Advanced search and filtering (by name, category, stock level)
- Pagination support for large inventories
- Responsive design with mobile drawer navigation
- Real-time error handling and user feedback with toast notifications
- Input validation at frontend, middleware, and database levels
- RESTful API with comprehensive error handling
- Graceful server shutdown handling

## Tech Stack

**Frontend:**
- React 19.2.0
- Material-UI v7
- React Router v7
- Context API
- Axios
- React Toastify

**Backend:**
- Node.js
- Express 5.1.0
- MongoDB with Mongoose 8.19.3
- JWT (jsonwebtoken 9.0.2)
- bcryptjs 3.0.3

**Architecture:**
- Three-layer validation (Frontend → Middleware → Database)
- Custom error handling with AppError class
- Database indexes for optimized queries

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
ATLAS_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start the backend server:

```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

**Note:** Update the URL for production deployment.

Start the frontend:

```bash
npm start
```

The application will run on `http://localhost:3000`

## Default Credentials

```
Email: manager@inventory.com
Password: manager123
Role: Inventory Manager
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Items
- `GET /items` - Get all items (supports pagination, search, filters)
- `GET /items/:id` - Get single item
- `POST /items` - Create item
- `PUT /items/:id` - Update item
- `DELETE /items/:id` - Delete item
- `GET /items/stats` - Get dashboard stats
- `GET /items/low-stock` - Get low stock items

## Project Structure

```
inventory-management-system/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       └── services/
└── README.md
```