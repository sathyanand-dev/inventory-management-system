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
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const authRouter = require('./routes/auth');
const itemsRouter = require('./routes/items');
const { protect } = require('./middlewares/auth');

// Public routes
app.use('/auth', authRouter);

// Protected routes
app.use('/items', protect, itemsRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
