# Inventory Management System

A full-stack inventory management application built with the MERN stack.

## Features

- User authentication with JWT
- Dashboard with inventory statistics
- CRUD operations for inventory items
- Low stock alerts
- Search and filter functionality
- Responsive design with Material-UI

## Tech Stack

**Frontend:**
- React.js
- Material-UI
- Context API
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB
- JWT Authentication

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
MONGODB_URI=your_mongodb_connection_string
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
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Items
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `GET /api/items/stats` - Get dashboard stats
- `GET /api/items/low-stock` - Get low stock items

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

## License

MIT
