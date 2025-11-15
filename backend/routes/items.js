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

// Stats & Analytics (specific routes first)
router.get('/stats', getDashboardStats);
router.get('/low-stock', getLowStockItems);

// CRUD Operations
router.get('/', getAllItems);
router.post('/add', validateItem, createItem);
router.get('/:id', getItemById);
router.put('/:id', validateItem, updateItem);
router.delete('/:id', deleteItem);

module.exports = router;
