# Inventory Management System

A full-stack inventory management system built with the MERN stack (MongoDB, Express, React, Node.js) featuring JWT authentication, Material-UI interface, low stock alerts, advanced search and filtering, and comprehensive error handling.

## 📋 Table of Contents
- [Features](#features)
- [System Architecture](#system-architecture)
- [Installation & Setup](#installation--setup)
- [Authentication System](#authentication-system)
- [API Documentation](#api-documentation)
- [Using the System](#using-the-system)
- [Database Schema](#database-schema)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Development Best Practices](#development-best-practices)

## ✨ Features

### Core Features
- ✅ **JWT Authentication** - Secure login/register with token-based authentication
- ✅ **Full CRUD Operations** - Create, Read, Update, Delete inventory items
- ✅ **Low Stock Alert System** - Real-time alerts for items below threshold
- ✅ **Advanced Dashboard** - Statistics, insights, and clickable cards
- ✅ **Search & Filter** - Real-time search with category and price filters
- ✅ **Pagination** - Efficient data loading with customizable page size
- ✅ **Sort Functionality** - Sort by name, price, quantity, or date
- ✅ **Responsive Design** - Modern Material-UI with custom indigo/pink theme
- ✅ **Form Validation** - Client and server-side validation
- ✅ **Toast Notifications** - Real-time user feedback
- ✅ **Confirmation Dialogs** - Safe delete operations
- ✅ **View Item Details** - Comprehensive item information dialog
- ✅ **Currency Support** - Indian Rupees (₹) throughout the application

### Technical Features
- **MVC Architecture** on backend for clean code organization
- **Context API** for global state management (Auth & Inventory)
- **Protected Routes** - All inventory operations require authentication
- **Centralized API Client** with Axios interceptors for token injection
- **Custom Error Classes** and middleware for consistent error handling
- **RESTful API** with standardized response format
- **Input Validation** using custom middleware
- **Password Hashing** with bcrypt for secure storage
- **JWT Token Management** with 7-day expiration

## 🏗️ System Architecture

### High-Level Overview

The system follows a three-tier architecture with clear separation of concerns:

```
┌─────────────────────────┐         HTTP/REST          ┌─────────────────────────┐       Mongoose      ┌─────────────────────┐
│                         │ ◄────────────────────────► │                         │ ◄──────────────────► │                     │
│    React Frontend       │      JWT Protected         │    Express Backend      │                     │      MongoDB        │
│    (Material-UI)        │      API Requests          │      (Node.js)          │                     │   Database (Atlas)  │
│                         │                            │                         │                     │                     │
│  - Pages (Views)        │                            │  - Controllers          │                     │  - Users            │
│  - Context (State)      │                            │  - Routes               │                     │  - Items            │
│  - Services (API)       │                            │  - Middlewares          │                     │                     │
│  - Components (UI)      │                            │  - Models               │                     │                     │
└─────────────────────────┘                            └─────────────────────────┘                     └─────────────────────┘
```

### Component Interaction Flow

#### 1. **Authentication Flow**
```
User Login → AuthContext.login() → API Call → Backend Auth Controller 
→ Verify Credentials → Generate JWT → Store in localStorage → Redirect to Dashboard
```

#### 2. **Protected Route Access**
```
Route Access → PrivateRoute Check → Verify Token in localStorage 
→ If Valid: Render Component | If Invalid: Redirect to Login
```

#### 3. **Inventory Operations Flow**
```
User Action → InventoryContext Method → API Service with JWT Token 
→ Auth Middleware Validates Token → Controller Processes Request 
→ Model Interacts with DB → Response to Frontend → Update Context State → Re-render UI
```

#### 4. **Low Stock Alert Flow**
```
Dashboard Load → Fetch Stats → Backend Checks Items with quantity < threshold 
→ Return Count → Display Badge → Click Card → Navigate to Low Stock Page 
→ Fetch Filtered Items → Display with Urgency Colors
```

### Backend Architecture (MVC Pattern)

```
/backend
  /controllers          # Business logic layer
    ├── authController.js      # Login, register, getMe
    └── itemController.js      # CRUD operations, stats, low stock
  
  /models              # Data models (Mongoose schemas)
    ├── user.model.js         # User schema with password hashing
    └── item.model.js         # Item schema with validation
  
  /routes              # API endpoint definitions
    ├── auth.js               # Authentication routes
    └── items.js              # Item routes (all protected)
  
  /middlewares         # Request processing
    ├── auth.js               # JWT verification middleware
    ├── errorHandler.js       # Global error handler
    └── validator.js          # Input validation middleware
  
  /utils               # Helper functions
    └── AppError.js           # Custom error class
  
  server.js            # Entry point, Express setup
  .env                 # Environment variables (secrets)
  seedUser.js          # Script to create default user
```

### Frontend Architecture (Component-Based)

```
/frontend/src
  /components          # Reusable UI components
    ├── Navbar.js             # Navigation bar with logout
    └── PrivateRoute.js       # Route protection wrapper
  
  /pages               # Page-level components
    ├── Login.js              # Login/Register forms
    ├── Dashboard.js          # Stats and quick actions
    ├── InventoryList.js      # Main inventory table with actions
    ├── ItemForm.js           # Add/Edit item form
    └── LowStockItems.js      # Low stock alert page
  
  /context             # Global state management
    ├── AuthContext.js        # Authentication state & methods
    └── InventoryContext.js   # Inventory state & methods
  
  /services            # External API communication
    └── api.js                # Axios client with interceptors
  
  App.js               # Root component with routing & theme
  index.js             # React DOM render entry point
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB Atlas Account** or local MongoDB instance - [Sign up](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** package manager
- **Git** (optional, for cloning)

### Step 1: Clone or Download the Project

```bash
git clone <repository-url>
cd "Inventory management system"
```

### Step 2: Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   
   Create a `.env` file in the `backend` directory with the following variables:
   
   ```env
   # MongoDB Connection
   ATLAS_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/inventory?retryWrites=true&w=majority
   
   # Server Port
   PORT=5000
   
   # JWT Secret Key (use a strong, random string)
   JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
   ```

   **Important:** Replace `<username>` and `<password>` with your MongoDB Atlas credentials.

4. **Whitelist your IP in MongoDB Atlas:**
   - Go to MongoDB Atlas Dashboard
   - Navigate to Network Access
   - Click "Add IP Address"
   - Add your current IP or allow all (0.0.0.0/0) for development only
   - Wait 1-2 minutes for changes to take effect

5. **Seed default user (optional but recommended):**
   ```bash
   node seedUser.js
   ```
   This creates a default user:
   - **Email:** manager@inventory.com
   - **Password:** manager123
   - **Role:** Inventory Manager

6. **Start the backend server:**
   ```bash
   node server.js
   ```
   
   You should see:
   ```
   Server is running on port: 5000
   ✅ MongoDB Connected successfully
   ```

### Step 3: Frontend Setup

1. **Open a new terminal and navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   
   The app will automatically open at `http://localhost:3000`

### Step 4: First Login

1. Open your browser and go to `http://localhost:3000`
2. You'll be redirected to the login page
3. Use the default credentials:
   - **Email:** `manager@inventory.com`
   - **Password:** `manager123`
4. Click "Login" and you'll be redirected to the Dashboard

### Troubleshooting

**MongoDB Connection Error:**
- Verify your `ATLAS_URI` is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure your MongoDB user has read/write permissions

**Port Already in Use:**
- Change the `PORT` in `.env` file
- Kill the process using the port: `npx kill-port 5000`

**Frontend Can't Connect to Backend:**
- Verify backend is running on port 5000
- Check if `http://localhost:5000` is accessible
- Ensure CORS is properly configured in `server.js`

## 🔐 Authentication System

### Overview
The system uses **JWT (JSON Web Tokens)** for stateless authentication. Tokens are stored in `localStorage` and included in all API requests via an Axios interceptor.

### Authentication Flow

1. **Registration:**
   - User submits username, email, and password
   - Backend hashes password using bcrypt (10 salt rounds)
   - User document created with role "Inventory Manager"
   - JWT token generated and returned

2. **Login:**
   - User submits email and password
   - Backend verifies credentials using bcrypt.compare()
   - JWT token generated with 7-day expiration
   - Token stored in localStorage
   - User redirected to dashboard

3. **Protected Route Access:**
   - Frontend checks for token in localStorage
   - If absent: Redirect to login
   - If present: Include in Authorization header as `Bearer <token>`
   - Backend middleware verifies token signature and expiration
   - If valid: Allow access | If invalid: Return 401 error

4. **Logout:**
   - Token removed from localStorage
   - User redirected to login page

### Default User Credentials

**For Testing/Development:**
- **Email:** manager@inventory.com
- **Password:** manager123
- **Role:** Inventory Manager

### Security Features

- ✅ Password hashing with bcrypt (never stored in plain text)
- ✅ JWT token expiration (7 days)
- ✅ Token verification on every protected route
- ✅ Automatic logout on token expiration
- ✅ HTTP-only approach (token in localStorage, not cookies)
- ✅ Protected API endpoints (all /items routes require authentication)

## 📡 API Documentation

### Base URL
```
http://localhost:5000
```

### Response Format

All API responses follow a consistent structure:

**Success Response:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description"
  }
}
```

### HTTP Status Codes

| Code | Meaning                          | When Used                              |
|------|----------------------------------|----------------------------------------|
| 200  | OK                               | Successful GET, PUT, DELETE            |
| 201  | Created                          | Successful POST (resource created)     |
| 400  | Bad Request                      | Validation error, invalid input        |
| 401  | Unauthorized                     | Missing or invalid JWT token           |
| 404  | Not Found                        | Resource doesn't exist                 |
| 500  | Internal Server Error            | Unexpected server error                |

---

### Authentication Endpoints

#### 1. Register New User

**Endpoint:** `POST /auth/register`

**Purpose:** Create a new user account with encrypted password

**Authentication:** Not required (public endpoint)

**Request Body:**
```json
{
  "username": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Validation Rules:**
- `username`: Required, string, min 2 characters
- `email`: Required, valid email format, must be unique
- `password`: Required, string, min 6 characters

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "60d5ec49f1a2c8b1f8e4e1a1",
      "username": "John Doe",
      "email": "john@example.com",
      "role": "Inventory Manager"
    }
  },
  "message": "User registered successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email already exists"
  }
}
```

---

#### 2. Login User

**Endpoint:** `POST /auth/login`

**Purpose:** Authenticate user and receive JWT token

**Authentication:** Not required (public endpoint)

**Request Body:**
```json
{
  "email": "manager@inventory.com",
  "password": "manager123"
}
```

**Validation Rules:**
- `email`: Required, valid email format
- `password`: Required, string

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "60d5ec49f1a2c8b1f8e4e1a1",
      "username": "Inventory Manager",
      "email": "manager@inventory.com",
      "role": "Inventory Manager"
    }
  },
  "message": "Login successful"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Invalid credentials"
  }
}
```

---

#### 3. Get Current User

**Endpoint:** `GET /auth/me`

**Purpose:** Retrieve authenticated user's information

**Authentication:** Required (JWT token)

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1a2c8b1f8e4e1a1",
    "username": "Inventory Manager",
    "email": "manager@inventory.com",
    "role": "Inventory Manager"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Not authorized, token failed"
  }
}
```

---

### Inventory Item Endpoints

> **Note:** All item endpoints require JWT authentication. Include token in Authorization header.

#### 4. Get All Items (with Filters)

**Endpoint:** `GET /items`

**Purpose:** Retrieve paginated list of inventory items with optional filters and sorting

**Authentication:** Required

**Query Parameters:**

| Parameter   | Type    | Default | Description                                    |
|-------------|---------|---------|------------------------------------------------|
| page        | number  | 1       | Page number for pagination                     |
| limit       | number  | 10      | Items per page                                 |
| search      | string  | -       | Search in itemName and description             |
| category    | string  | -       | Filter by exact category                       |
| minPrice    | number  | -       | Minimum price filter (in ₹)                    |
| maxPrice    | number  | -       | Maximum price filter (in ₹)                    |
| sortBy      | string  | createdAt | Field to sort by (itemName, price, quantity, createdAt) |
| sortOrder   | string  | desc    | Sort direction (asc or desc)                   |

**Example Request:**
```
GET /items?page=1&limit=10&search=laptop&category=Electronics&minPrice=10000&maxPrice=100000&sortBy=price&sortOrder=asc
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "_id": "60d5ec49f1a2c8b1f8e4e1a1",
        "itemName": "Laptop",
        "quantity": 15,
        "price": 45000,
        "description": "High-performance laptop",
        "category": "Electronics",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 48,
    "itemsPerPage": 10
  }
}
```

---

#### 5. Get Single Item

**Endpoint:** `GET /items/:id`

**Purpose:** Retrieve detailed information about a specific item

**Authentication:** Required

**URL Parameters:**
- `id`: MongoDB ObjectId of the item

**Example Request:**
```
GET /items/60d5ec49f1a2c8b1f8e4e1a1
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1a2c8b1f8e4e1a1",
    "itemName": "Laptop",
    "quantity": 15,
    "price": 45000,
    "description": "High-performance laptop for professional use",
    "category": "Electronics",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Item not found"
  }
}
```

---

#### 6. Create New Item

**Endpoint:** `POST /items/add`

**Purpose:** Add a new item to the inventory

**Authentication:** Required

**Request Body:**
```json
{
  "itemName": "Wireless Mouse",
  "quantity": 50,
  "price": 599,
  "description": "Ergonomic wireless mouse with USB receiver",
  "category": "Electronics"
}
```

**Validation Rules:**
- `itemName`: Required, string, min 2 characters
- `quantity`: Required, number, min 0
- `price`: Required, number, min 0 (in ₹)
- `description`: Optional, string
- `category`: Optional, string

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1a2c8b1f8e4e1a2",
    "itemName": "Wireless Mouse",
    "quantity": 50,
    "price": 599,
    "description": "Ergonomic wireless mouse with USB receiver",
    "category": "Electronics",
    "createdAt": "2024-01-16T14:20:00.000Z",
    "updatedAt": "2024-01-16T14:20:00.000Z"
  },
  "message": "Item created successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Item name is required"
  }
}
```

---

#### 7. Update Item

**Endpoint:** `PUT /items/:id`

**Purpose:** Update an existing item's information

**Authentication:** Required

**URL Parameters:**
- `id`: MongoDB ObjectId of the item

**Request Body:** (all fields optional, only send fields to update)
```json
{
  "itemName": "Wireless Mouse Pro",
  "quantity": 45,
  "price": 799,
  "description": "Professional ergonomic wireless mouse",
  "category": "Electronics"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1a2c8b1f8e4e1a2",
    "itemName": "Wireless Mouse Pro",
    "quantity": 45,
    "price": 799,
    "description": "Professional ergonomic wireless mouse",
    "category": "Electronics",
    "createdAt": "2024-01-16T14:20:00.000Z",
    "updatedAt": "2024-01-16T15:30:00.000Z"
  },
  "message": "Item updated successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Item not found"
  }
}
```

---

#### 8. Delete Item

**Endpoint:** `DELETE /items/:id`

**Purpose:** Remove an item from the inventory

**Authentication:** Required

**URL Parameters:**
- `id`: MongoDB ObjectId of the item

**Example Request:**
```
DELETE /items/60d5ec49f1a2c8b1f8e4e1a2
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Item deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Item not found"
  }
}
```

---

#### 9. Get Dashboard Statistics

**Endpoint:** `GET /items/stats`

**Purpose:** Retrieve summary statistics for the dashboard

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalItems": 150,
    "lowStockCount": 12,
    "totalValue": 2450000,
    "categories": [
      { "_id": "Electronics", "count": 45 },
      { "_id": "Furniture", "count": 30 },
      { "_id": "Stationery", "count": 75 }
    ]
  }
}
```

**Calculation Logic:**
- `totalItems`: Count of all items in inventory
- `lowStockCount`: Count of items with quantity < 10
- `totalValue`: Sum of (price × quantity) for all items (in ₹)
- `categories`: Aggregation of items grouped by category

---

#### 10. Get Low Stock Items

**Endpoint:** `GET /items/low-stock`

**Purpose:** Retrieve items below the stock threshold for alert system

**Authentication:** Required

**Query Parameters:**

| Parameter | Type   | Default | Description                           |
|-----------|--------|---------|---------------------------------------|
| threshold | number | 10      | Quantity threshold for low stock      |

**Example Request:**
```
GET /items/low-stock?threshold=15
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "_id": "60d5ec49f1a2c8b1f8e4e1a3",
        "itemName": "Office Chair",
        "quantity": 3,
        "price": 8500,
        "description": "Ergonomic office chair",
        "category": "Furniture",
        "createdAt": "2024-01-10T09:00:00.000Z",
        "updatedAt": "2024-01-15T11:30:00.000Z"
      },
      {
        "_id": "60d5ec49f1a2c8b1f8e4e1a4",
        "itemName": "Printer Cartridge",
        "quantity": 8,
        "price": 1200,
        "description": "Black ink cartridge",
        "category": "Electronics",
        "createdAt": "2024-01-12T14:20:00.000Z",
        "updatedAt": "2024-01-14T16:45:00.000Z"
      }
    ],
    "threshold": 15,
    "count": 2
  }
}
```

**Sorting:** Items are sorted by quantity in ascending order (lowest stock first)

**Use Case:** This endpoint powers the Low Stock Alert page and dashboard card badge

## 📖 Using the System

### Login & Authentication

1. **Access the Application:**
   - Open browser and navigate to `http://localhost:3000`
   - You'll be automatically redirected to the login page

2. **Login:**
   - Enter email: `manager@inventory.com`
   - Enter password: `manager123`
   - Click "Login" button
   - Upon successful authentication, you'll be redirected to the Dashboard

3. **Register New User (Optional):**
   - Click on "Register" tab
   - Fill in username, email, and password
   - Role is automatically assigned as "Inventory Manager"
   - After registration, you'll be automatically logged in

4. **Logout:**
   - Click on the user profile icon in the top-right corner
   - Select "Logout" from the dropdown menu
   - You'll be redirected to the login page and token will be cleared

---

### Dashboard

**Access:** Click "Dashboard" in navbar or navigate to `/`

**Features:**

1. **Statistics Cards:**
   - **Total Items:** Shows count of all inventory items
   - **Low Stock Alerts:** Displays count of items with quantity < 10 (clickable)
   - **Total Value:** Sum of all items (price × quantity) in ₹
   - **Categories:** Number of different product categories

2. **Interactive Cards:**
   - Click on "Low Stock Alerts" card to navigate to low stock page
   - Cards are color-coded with your theme colors
   - Icons represent each metric visually

3. **Quick Actions:**
   - "Add New Item" button navigates to item creation form
   - "View All Items" button goes to full inventory list

**Use Case:** Get a quick overview of your inventory health at a glance

---

### Inventory List

**Access:** Click "Inventory" in navbar or navigate to `/inventory`

**Features:**

1. **Search & Filter:**
   - **Search Bar:** Type to search by item name or description (real-time)
   - **Category Filter:** Dropdown to filter by specific category
   - **Price Range:** Min and Max price inputs for price filtering
   - **Clear Filters:** Button to reset all filters

2. **Sorting:**
   - Click on column headers to sort:
     - Name (A-Z or Z-A)
     - Price (Low to High or High to Low)
     - Quantity (Low to High or High to Low)
     - Date Added (Newest or Oldest)
   - Current sort indicated by arrow icon in column header

3. **Pagination:**
   - Items per page selector (5, 10, 25, 50)
   - Page navigation at bottom of table
   - Shows current page and total pages

4. **Item Actions:**
   - **View (Eye Icon):** Opens detailed dialog with all item information
   - **Edit (Pencil Icon):** Navigates to edit form with pre-filled data
   - **Delete (Trash Icon):** Shows confirmation dialog before deletion

5. **Item Details Dialog:**
   - Displays complete item information
   - Shows creation and last update timestamps
   - "Quick Edit" button to modify item
   - "Close" button to return to list

**Workflow Example:**
```
Search "laptop" → Filter by "Electronics" → Sort by "Price" (Low to High) 
→ Click "View" to see details → Click "Edit" to modify → Update quantity → Save
```

---

### Add New Item

**Access:** 
- Dashboard: Click "Add New Item" button
- Navbar: Click "Add Item"
- Direct URL: `/create`

**Form Fields:**

1. **Item Name:** (Required)
   - Minimum 2 characters
   - Example: "Wireless Mouse"

2. **Quantity:** (Required)
   - Must be 0 or positive number
   - Example: 50

3. **Price:** (Required)
   - Must be 0 or positive number
   - Displayed with ₹ symbol
   - Example: 599 (₹599)

4. **Description:** (Optional)
   - Additional details about the item
   - Example: "Ergonomic wireless mouse with USB receiver"

5. **Category:** (Optional)
   - Dropdown or text input
   - Examples: Electronics, Furniture, Stationery, Clothing

**Validation:**
- Real-time validation as you type
- Red error messages appear below invalid fields
- Submit button disabled until form is valid
- Server-side validation provides additional safety

**After Submit:**
- Success toast notification appears
- Automatically redirected to inventory list
- New item appears at the top (sorted by date)

---

### Edit Item

**Access:** 
- Inventory List: Click edit icon (pencil) on any item
- Direct URL: `/edit/:id`

**Features:**
- Form pre-filled with current item data
- Same validation rules as "Add Item"
- Can modify any field
- "Cancel" button returns to inventory list without saving
- "Update" button saves changes and redirects to inventory list

**Workflow:**
```
Inventory List → Click Edit Icon → Modify Quantity from 50 to 45 
→ Update Description → Click "Update Item" → Success → Return to List
```

---

### Low Stock Alert System

**Access:** 
- Dashboard: Click "Low Stock Alerts" card
- Navbar: Click "Low Stock" link
- Direct URL: `/low-stock`

**Features:**

1. **Adjustable Threshold:**
   - Slider to set custom threshold (default: 10 units)
   - Real-time updates as you change threshold
   - Threshold value displayed prominently

2. **Urgency Indicators:**
   - **Critical (Red):** Quantity 0-3 units - Immediate attention required
   - **Warning (Orange):** Quantity 4-6 units - Order soon
   - **Low (Yellow):** Quantity 7-threshold - Monitor closely

3. **Item Information:**
   - Item name, current quantity, price
   - Category and description
   - Urgency badge with color coding

4. **Actions:**
   - **Restock Button:** Opens edit form to increase quantity
   - Items sorted by quantity (lowest first)

5. **Empty State:**
   - If no items below threshold: "All Stock Levels Good!" message
   - Green success indicator

**Use Case:**
```
Morning Routine → Check Low Stock Page → See 3 critical items 
→ Click "Restock" on Office Chairs → Update quantity from 3 to 50 
→ Return to Low Stock Page → Item removed from list
```

**Pro Tip:** Set threshold based on your reorder lead time. If supplier takes 7 days, set threshold to your weekly sales rate.

---

### General Tips

1. **Regular Monitoring:**
   - Check dashboard daily for quick health check
   - Review low stock alerts every morning
   - Update quantities after deliveries immediately

2. **Data Consistency:**
   - Use consistent category names (Electronics vs electronics)
   - Add descriptions for better searchability
   - Keep prices updated for accurate total value

3. **Search Optimization:**
   - Add relevant keywords in descriptions
   - Use clear, descriptive item names
   - Consistent category naming helps filtering

4. **Bulk Operations:**
   - Use filters to find similar items
   - Edit multiple items of same category
   - Export filtered results (future feature)

5. **Security:**
   - Logout when done, especially on shared computers
   - Change default password after first login
   - Don't share JWT tokens or credentials

## 🗄️ Database Schema

### User Collection

```javascript
{
  _id: ObjectId,                    // Auto-generated MongoDB ID
  username: String,                 // User's display name
  email: String,                    // Unique email address (used for login)
  password: String,                 // Hashed password (bcrypt with 10 salt rounds)
  role: String,                     // Fixed: "Inventory Manager"
  createdAt: Date,                  // Auto-generated timestamp
  updatedAt: Date                   // Auto-updated timestamp
}
```

**Indexes:**
- `email`: Unique index for fast login queries and duplicate prevention

**Password Security:**
- Pre-save middleware automatically hashes passwords before storing
- Only hashes on password modification (not on every save)
- Uses bcrypt with 10 salt rounds (2^10 iterations)

**Example Document:**
```json
{
  "_id": "60d5ec49f1a2c8b1f8e4e1a1",
  "username": "Inventory Manager",
  "email": "manager@inventory.com",
  "password": "$2b$10$eJF7Q1K2m3N4P5O6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H3I4J5",
  "role": "Inventory Manager",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Item Collection

```javascript
{
  _id: ObjectId,                    // Auto-generated MongoDB ID
  itemName: String,                 // Name/title of the item (required, min 2 chars)
  quantity: Number,                 // Available quantity (required, >= 0)
  price: Number,                    // Price in Indian Rupees ₹ (required, >= 0)
  description: String,              // Optional detailed description
  category: String,                 // Optional category for grouping
  createdAt: Date,                  // Auto-generated creation timestamp
  updatedAt: Date                   // Auto-updated modification timestamp
}
```

**Validation Rules:**
- `itemName`: Required, String, minimum 2 characters
- `quantity`: Required, Number, minimum 0, must be integer
- `price`: Required, Number, minimum 0, can have decimals for paisa
- `description`: Optional, String
- `category`: Optional, String

**Indexes:**
- Default `_id` index for fast lookups
- Compound index on `category` + `quantity` for low stock queries

**Example Document:**
```json
{
  "_id": "60d5ec49f1a2c8b1f8e4e1a2",
  "itemName": "Wireless Mouse",
  "quantity": 50,
  "price": 599,
  "description": "Ergonomic wireless mouse with 2.4GHz USB receiver",
  "category": "Electronics",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Relationships:**
- No direct foreign key relationships (MongoDB is document-based)
- Users can create/edit/delete any items (future: track created_by field)

---

## 🛠️ Technologies Used

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | v14+ | JavaScript runtime environment |
| **Express.js** | ^4.18.2 | Web application framework |
| **MongoDB** | Cloud Atlas | NoSQL database for data storage |
| **Mongoose** | ^8.1.0 | MongoDB object modeling (ODM) |
| **jsonwebtoken** | ^9.0.2 | JWT token generation and verification |
| **bcryptjs** | ^2.4.3 | Password hashing and comparison |
| **dotenv** | ^17.2.3 | Environment variable management |
| **cors** | ^2.8.5 | Cross-Origin Resource Sharing middleware |

**Why These Choices:**
- **Express.js**: Minimal and flexible, perfect for RESTful APIs
- **Mongoose**: Provides schema validation and relationships for MongoDB
- **JWT**: Stateless authentication, scalable for future microservices
- **bcrypt**: Industry-standard password hashing with salt

---

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | ^18.2.0 | UI library for building components |
| **React Router** | ^6.21.1 | Client-side routing and navigation |
| **Material-UI (MUI)** | ^5.15.3 | React component library (Material Design) |
| **Axios** | ^1.6.5 | HTTP client for API requests |
| **React Toastify** | ^10.0.4 | Toast notifications for user feedback |
| **@mui/icons-material** | ^5.15.3 | Material Design icon set |
| **@emotion/react** | ^11.11.3 | CSS-in-JS library (required by MUI) |
| **@emotion/styled** | ^11.11.0 | Styled components (required by MUI) |

**Why These Choices:**
- **React**: Component-based architecture, huge ecosystem
- **Material-UI**: Professional design out-of-the-box, responsive
- **Axios**: Better than fetch (interceptors, automatic JSON parsing)
- **Context API**: Built-in React, no external state management library needed

---

### Development Tools

| Tool | Purpose |
|------|---------|
| **VS Code** | Code editor with excellent extensions |
| **Postman** | API testing and documentation |
| **MongoDB Compass** | GUI for MongoDB database management |
| **Git** | Version control |
| **Chrome DevTools** | Frontend debugging and performance |
| **React Developer Tools** | React component debugging |

---

## 📁 Project Structure

### Complete Backend Structure

```
backend/
│
├── controllers/                    # Business logic layer
│   ├── authController.js          # Authentication logic (login, register, getMe)
│   └── itemController.js          # Inventory operations (CRUD, stats, low stock)
│
├── middlewares/                    # Request processing middleware
│   ├── auth.js                    # JWT token verification middleware
│   ├── errorHandler.js            # Global error handler middleware
│   └── validator.js               # Input validation middleware
│
├── models/                         # Mongoose schemas and models
│   ├── item.model.js              # Item schema with validation rules
│   └── user.model.js              # User schema with password hashing
│
├── routes/                         # API route definitions
│   ├── auth.js                    # Authentication routes (/auth/*)
│   └── items.js                   # Item routes (/items/*)
│
├── utils/                          # Helper utilities
│   └── AppError.js                # Custom error class for consistent errors
│
├── node_modules/                   # NPM dependencies (gitignored)
├── .env                           # Environment variables (gitignored)
├── .gitignore                     # Git ignore rules
├── package.json                   # NPM dependencies and scripts
├── package-lock.json              # Locked dependency versions
├── seedUser.js                    # Script to create default user
└── server.js                      # Application entry point
```

**Key Files Explained:**

- **server.js**: Express app setup, middleware registration, route mounting, MongoDB connection
- **authController.js**: Handles user registration, login, and profile retrieval
- **itemController.js**: Implements CRUD operations, dashboard stats, low stock alerts
- **auth.js (middleware)**: Verifies JWT tokens and attaches user to request object
- **errorHandler.js**: Catches all errors and formats them consistently
- **validator.js**: Validates request body/query parameters using custom rules
- **AppError.js**: Custom error class that includes statusCode and error codes

---

### Complete Frontend Structure

```
frontend/
│
├── public/                         # Static assets
│   ├── index.html                 # HTML template
│   ├── manifest.json              # PWA manifest
│   └── robots.txt                 # Search engine crawler rules
│
├── src/                            # Source code
│   │
│   ├── components/                # Reusable UI components
│   │   ├── Navbar.js             # Navigation bar with user menu and logout
│   │   └── PrivateRoute.js       # Route protection wrapper component
│   │
│   ├── context/                   # Global state management (Context API)
│   │   ├── AuthContext.js        # Authentication state (user, token, login, logout)
│   │   └── InventoryContext.js   # Inventory state (items, fetchItems, operations)
│   │
│   ├── pages/                     # Page-level components (routed)
│   │   ├── Dashboard.js          # Dashboard with statistics cards
│   │   ├── InventoryList.js      # Main inventory table with filters and actions
│   │   ├── ItemForm.js           # Add/Edit item form (handles both operations)
│   │   ├── Login.js              # Login and register forms with tabs
│   │   └── LowStockItems.js      # Low stock alert page with threshold control
│   │
│   ├── services/                  # External API communication
│   │   └── api.js                # Axios instance with interceptors and API methods
│   │
│   ├── App.js                     # Root component (routing, theme, providers)
│   ├── index.js                   # React DOM render entry point
│   ├── index.css                  # Global CSS styles
│   ├── reportWebVitals.js        # Performance monitoring
│   └── setupTests.js             # Jest testing setup
│
├── node_modules/                   # NPM dependencies (gitignored)
├── .gitignore                     # Git ignore rules
├── package.json                   # NPM dependencies and scripts
├── package-lock.json              # Locked dependency versions
└── README.md                      # Frontend-specific documentation
```

**Key Files Explained:**

- **App.js**: Root component with ThemeProvider, AuthProvider, Router, and global styles
- **AuthContext.js**: Manages authentication state, provides login/logout/register methods
- **InventoryContext.js**: Manages inventory state, provides CRUD methods for items
- **api.js**: Axios client with base URL, token interceptor, and all API endpoint methods
- **Navbar.js**: Navigation bar with links, user profile dropdown, and logout
- **PrivateRoute.js**: Checks for authentication token before rendering children
- **Dashboard.js**: Displays statistics cards with counts and clickable navigation
- **InventoryList.js**: Main inventory table with search, filter, sort, pagination
- **ItemForm.js**: Reusable form for both creating and editing items (checks route params)
- **Login.js**: Tabbed interface for login and registration forms
- **LowStockItems.js**: Displays items below threshold with urgency indicators

---

## 💡 Development Best Practices

### Backend Best Practices

1. **MVC Architecture:**
   - **Models**: Define data structure and validation
   - **Controllers**: Implement business logic, stay thin
   - **Routes**: Define endpoints only, delegate to controllers
   - **Separation of Concerns**: Each layer has single responsibility

2. **Error Handling:**
   - Custom `AppError` class for operational errors
   - Global error handler catches all errors
   - Consistent error response format
   - Never expose stack traces to client in production

3. **Security:**
   - Environment variables for sensitive data (`.env` file)
   - Password hashing before storage (never plain text)
   - JWT tokens with expiration (7 days)
   - Input validation on all user inputs
   - CORS configuration to allow only frontend origin

4. **Database:**
   - Mongoose schemas for data validation
   - Indexes on frequently queried fields
   - Pagination for large datasets
   - Aggregation for complex queries (dashboard stats)

5. **Code Quality:**
   - Meaningful variable and function names
   - Comments explaining "why", not "what"
   - Consistent error codes (RESOURCE_NOT_FOUND, VALIDATION_ERROR)
   - DRY principle (Don't Repeat Yourself)

---

### Frontend Best Practices

1. **Component Architecture:**
   - Small, reusable components
   - Pages compose multiple components
   - Props for data, callbacks for events
   - Keep components focused on one responsibility

2. **State Management:**
   - Context API for global state (Auth, Inventory)
   - Local state (useState) for component-specific data
   - Avoid prop drilling with context providers
   - Separate contexts for different concerns

3. **API Communication:**
   - Centralized API client (`api.js`)
   - Axios interceptors for authentication headers
   - Consistent error handling with try-catch
   - Loading states for better UX

4. **User Experience:**
   - Loading indicators during API calls
   - Toast notifications for feedback
   - Confirmation dialogs for destructive actions
   - Form validation with helpful error messages
   - Responsive design for all screen sizes

5. **Performance:**
   - Lazy loading for routes (future enhancement)
   - Pagination instead of loading all data
   - Debouncing for search inputs
   - Memoization for expensive computations

6. **Styling:**
   - Material-UI theme for consistent design
   - Custom color palette (indigo/pink)
   - Responsive breakpoints
   - Gradient backgrounds for depth
   - Consistent spacing and sizing

---

## 🚀 Future Enhancements

### Priority Features

- [ ] **CSV Export/Import**: Export inventory to Excel, import bulk items
- [ ] **Activity Logging**: Track who created/modified/deleted items and when
- [ ] **Image Upload**: Add product images to items
- [ ] **Barcode Scanner**: Scan barcodes to quickly find/update items
- [ ] **Role-Based Access**: Admin (full access) vs Viewer (read-only)
- [ ] **Email Notifications**: Automated alerts when items reach low stock
- [ ] **Reports & Analytics**: Advanced charts (Chart.js), trends, forecasting
- [ ] **Bulk Operations**: Select multiple items for bulk update/delete
- [ ] **Dark Mode**: Theme toggle for better night-time usage
- [ ] **Mobile App**: React Native version for on-the-go management

### Technical Improvements

- [ ] **Unit Tests**: Jest + React Testing Library for frontend, Mocha/Chai for backend
- [ ] **CI/CD Pipeline**: GitHub Actions for automated testing and deployment
- [ ] **Docker**: Containerization for consistent deployment
- [ ] **API Rate Limiting**: Prevent abuse with rate limiting middleware
- [ ] **Caching**: Redis for frequently accessed data
- [ ] **WebSocket**: Real-time updates when multiple users edit simultaneously
- [ ] **GraphQL**: Alternative to REST for flexible queries
- [ ] **Logging**: Winston or Bunyan for production logging
- [ ] **Monitoring**: APM tools like New Relic or Datadog

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available for educational purposes.

---

## 👨‍💻 Author

Developed as a full-stack MERN application demonstrating modern web development practices.

---

## 📞 Support

If you encounter any issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Verify MongoDB connection and IP whitelist
3. Ensure all environment variables are set correctly
4. Check if ports 3000 and 5000 are available
5. Review browser console and terminal logs for errors

---

## 🙏 Acknowledgments

- Material-UI for the beautiful component library
- MongoDB Atlas for reliable cloud database hosting
- React community for excellent documentation
- Express.js for the minimalist framework

---

**Last Updated:** November 2025
**Version:** 2.0.0

