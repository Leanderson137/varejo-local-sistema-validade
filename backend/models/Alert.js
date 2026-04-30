const mongoose = require('mongoose')

const alertSchema = new mongoose.Schema({
  lotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lot',
    required: [true, 'Lote é obrigatório']
  },
  level: {
    type: String,
    enum: ['normal', 'attention', 'critical'],
    required: [true, 'Nível do alerta é obrigatório']
  },
  seen: {
    type: Boolean,
    default: false
  },
  triggeredAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })

module.exports = mongoose.model('Alert', alertSchema)