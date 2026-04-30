const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU é obrigatório'],
    unique: true,
    trim: true
  },
  barcode: {
    type: String,
    trim: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Categoria é obrigatória']
  },
  unitCost: {
    type: Number,
    required: [true, 'Custo unitário é obrigatório'],
    min: 0
  },
  alertDaysBeforeExpiry: {
    type: Number,
    default: 15,
    min: 1
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)