const AppError = require('../utils/AppError');

// Validation middleware
const validateItem = (req, res, next) => {
  const { itemName, quantity, price } = req.body;

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

  // Type validation
  const quantityNum = Number(quantity);
  const priceNum = Number(price);

  if (isNaN(quantityNum) || quantityNum < 0) {
    return next(new AppError('Quantity must be a non-negative number', 400, 'VALIDATION_ERROR'));
  }

  if (isNaN(priceNum) || priceNum < 0) {
    return next(new AppError('Price must be a non-negative number', 400, 'VALIDATION_ERROR'));
  }

  // Sanitize and normalize data
  req.body.itemName = itemName.trim();
  req.body.quantity = quantityNum;
  req.body.price = priceNum;
  
  if (req.body.description) {
    req.body.description = req.body.description.trim();
  }
  
  if (req.body.category) {
    req.body.category = req.body.category.trim();
  }

  next();
};

module.exports = { validateItem };
