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

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('MongoDB database connection established successfully');
    }
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  });

const connection = mongoose.connection;

const authRouter = require('./routes/auth');
const itemsRouter = require('./routes/items');
const { protect } = require('./middlewares/auth');

// Public routes
app.use('/auth', authRouter);

// Protected routes
app.use('/items', protect, itemsRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

const server = app.listen(port, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Server is running on port: ${port}`);
  }
});

// Graceful shutdown
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
