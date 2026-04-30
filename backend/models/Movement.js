const mongoose = require('mongoose')

const movementSchema = new mongoose.Schema({
  lotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lot',
    required: [true, 'Lote é obrigatório']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Usuário é obrigatório']
  },
  type: {
    type: String,
    enum: ['entry', 'exit', 'adjustment', 'discard'],
    required: [true, 'Tipo de movimentação é obrigatório']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantidade é obrigatória'],
    min: 1
  },
  reason: {
    type: String,
    trim: true
  },
  movedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })

module.exports = mongoose.model('Movement', movementSchema)