const router = require('express').Router();
const { validateItem } = require('../middlewares/validator');
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getDashboardStats,
  getLowStockItems
} = require('../controllers/itemController');

// Special routes MUST come before parameterized routes
// Dashboard stats
router.get('/stats', getDashboardStats);

// Low stock items - MUST be before /:id
router.get('/low-stock', getLowStockItems);

// Create item - specific route
router.post('/add', validateItem, createItem);

// Legacy route for backward compatibility
router.post('/update/:id', validateItem, updateItem);

// General CRUD operations with :id parameter (MUST be last)
router.get('/', getAllItems);
router.put('/:id', validateItem, updateItem);
router.delete('/:id', deleteItem);
router.get('/:id', getItemById); // This MUST be last to avoid catching /low-stock

module.exports = router;
