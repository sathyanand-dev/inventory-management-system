const AppError = require('../utils/AppError');

// Validation middleware - second layer of defense (frontend validates first, model validates last)
// This catches malicious requests that bypass frontend validation
const validateItem = (req, res, next) => {
  const { itemName, quantity, price, description, category } = req.body;

  // Required fields validation
  if (!itemName || itemName.trim() === '') {
    return next(new AppError('Item name is required', 400, 'VALIDATION_ERROR'));
  }

  if (quantity === undefined || quantity === null || quantity === '') {
    return next(new AppError('Quantity is required', 400, 'VALIDATION_ERROR'));
  }

  if (price === undefined || price === null || price === '') {
    return next(new AppError('Price is required', 400, 'VALIDATION_ERROR'));
  }

  // Length validation
  if (itemName.trim().length < 2) {
    return next(new AppError('Item name must be at least 2 characters', 400, 'VALIDATION_ERROR'));
  }

  if (itemName.trim().length > 200) {
    return next(new AppError('Item name must not exceed 200 characters', 400, 'VALIDATION_ERROR'));
  }

  if (description && description.trim().length > 1000) {
    return next(new AppError('Description must not exceed 1000 characters', 400, 'VALIDATION_ERROR'));
  }

  if (category && category.trim().length > 100) {
    return next(new AppError('Category must not exceed 100 characters', 400, 'VALIDATION_ERROR'));
  }

  // Type validation
  const quantityNum = Number(quantity);
  const priceNum = Number(price);

  if (isNaN(quantityNum) || quantityNum < 0) {
    return next(new AppError('Quantity must be a non-negative number', 400, 'VALIDATION_ERROR'));
  }

  if (quantityNum > 1000000) {
    return next(new AppError('Quantity cannot exceed 1,000,000', 400, 'VALIDATION_ERROR'));
  }

  if (isNaN(priceNum) || priceNum < 0) {
    return next(new AppError('Price must be a non-negative number', 400, 'VALIDATION_ERROR'));
  }

  if (priceNum > 10000000) {
    return next(new AppError('Price cannot exceed 10,000,000', 400, 'VALIDATION_ERROR'));
  }

  // Sanitize and normalize data before it reaches the database
  // Trimming removes extra spaces and converting to numbers ensures type safety
  req.body.itemName = itemName.trim();
  req.body.quantity = quantityNum;
  req.body.price = priceNum;
  
  if (req.body.description) {
    req.body.description = description.trim();
  }
  
  if (req.body.category) {
    req.body.category = category.trim();
  }

  next();
};

module.exports = { validateItem };
