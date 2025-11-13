const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: false },
  category: { type: String, required: false },
}, {
  timestamps: true,
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
