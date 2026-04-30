const mongoose = require('mongoose')

const lotSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Produto é obrigatório']
  },
  lotNumber: {
    type: String,
    required: [true, 'Número do lote é obrigatório'],
    trim: true
  },
  manufactureDate: {
    type: Date
  },
  expirationDate: {
    type: Date,
    required: [true, 'Data de validade é obrigatória']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantidade é obrigatória'],
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'expiring_soon', 'expired', 'discarded'],
    default: 'active'
  }
}, { timestamps: true })

module.exports = mongoose.model('Lot', lotSchema)