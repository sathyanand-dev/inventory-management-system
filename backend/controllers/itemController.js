const Item = require('../models/item.model');
const AppError = require('../utils/AppError');
const { asyncHandler } = require('../middlewares/errorHandler');

// Get all items with pagination, search, and filters
const getAllItems = asyncHandler(async (req, res, next) => {
  const { 
    page = 1, 
    limit = 10, 
    search = '', 
    category = '', 
    minPrice, 
    maxPrice,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build query
  const query = {};
  
  if (search) {
    query.$or = [
      { itemName: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (category) {
    query.category = { $regex: category, $options: 'i' };
  }
  
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Calculate pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Sort
  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Execute query
  const items = await Item.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  const total = await Item.countDocuments(query);

  res.json({
    success: true,
    data: {
      items,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum
      }
    }
  });
});

// Get single item
const getItemById = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return next(new AppError('Item not found', 404, 'NOT_FOUND'));
  }

  res.json({
    success: true,
    data: item
  });
});

// Create new item
const createItem = asyncHandler(async (req, res, next) => {
  const { itemName, quantity, price, description, category } = req.body;

  const newItem = new Item({
    itemName,
    quantity,
    price,
    description,
    category,
  });

  const savedItem = await newItem.save();

  res.status(201).json({
    success: true,
    data: savedItem,
    message: 'Item created successfully'
  });
});

// Update item
const updateItem = asyncHandler(async (req, res, next) => {
  const { itemName, quantity, price, description, category } = req.body;

  const item = await Item.findById(req.params.id);

  if (!item) {
    return next(new AppError('Item not found', 404, 'NOT_FOUND'));
  }

  item.itemName = itemName;
  item.quantity = quantity;
  item.price = price;
  item.description = description;
  item.category = category;

  const updatedItem = await item.save();

  res.json({
    success: true,
    data: updatedItem,
    message: 'Item updated successfully'
  });
});

// Delete item
const deleteItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findByIdAndDelete(req.params.id);

  if (!item) {
    return next(new AppError('Item not found', 404, 'NOT_FOUND'));
  }

  res.json({
    success: true,
    message: 'Item deleted successfully'
  });
});

// Get dashboard stats
const getDashboardStats = asyncHandler(async (req, res, next) => {
  const totalItems = await Item.countDocuments();
  const lowStockItems = await Item.countDocuments({ quantity: { $lt: 10 } });
  const totalValue = await Item.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: { $multiply: ['$quantity', '$price'] } }
      }
    }
  ]);

  const categories = await Item.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      totalItems,
      lowStockItems,
      totalValue: totalValue[0]?.total || 0,
      categories: categories.filter(c => c._id).map(c => ({
        name: c._id,
        count: c.count
      }))
    }
  });
});

// Get low stock items
const getLowStockItems = asyncHandler(async (req, res, next) => {
  const { threshold = 10 } = req.query;
  
  console.log('Low stock request received with threshold:', threshold);
  
  const lowStockItems = await Item.find({ 
    quantity: { $lt: Number(threshold) } 
  }).sort({ quantity: 1 });

  console.log('Found low stock items:', lowStockItems.length);

  res.json({
    success: true,
    data: {
      items: lowStockItems,
      count: lowStockItems.length,
      threshold: Number(threshold)
    }
  });
});

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getDashboardStats,
  getLowStockItems
};
