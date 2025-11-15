require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;

// Connect to MongoDB Atlas - no need for deprecated options in Mongoose 8.x
mongoose.connect(uri)
  .then(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('MongoDB database connection established successfully');
    }
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit if database connection fails
  });

const connection = mongoose.connection;

const authRouter = require('./routes/auth');
const itemsRouter = require('./routes/items');
const { protect } = require('./middlewares/auth');

// Public routes - anyone can register or login
app.use('/auth', authRouter);

// Protected routes - requires valid JWT token
app.use('/items', protect, itemsRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

const server = app.listen(port, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Server is running on port: ${port}`);
  }
});

// Graceful shutdown - ensures database connections close properly before server stops
// This prevents data corruption and handles deployment scenarios cleanly
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});
