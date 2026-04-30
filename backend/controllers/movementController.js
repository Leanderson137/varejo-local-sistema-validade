const Movement = require('../models/Movement')
const Lot = require('../models/Lot')

const createMovement = async (req, res) => {
  try {
    const { lotId, type, quantity, reason } = req.body

    const lot = await Lot.findById(lotId)
    if (!lot) {
      return res.status(404).json({ message: 'Lote não encontrado.' })
    }

    if (lot.status === 'discarded') {
      return res.status(400).json({ message: 'Lote descartado não pode ser movimentado.' })
    }

    if (type === 'exit' || type === 'discard') {
      if (quantity > lot.quantity) {
        return res.status(400).json({ message: 'Quantidade insuficiente no lote.' })
      }
      lot.quantity -= quantity
      if (type === 'discard') lot.status = 'discarded'
    }

    if (type === 'entry') {
      lot.quantity += quantity
    }

    if (type === 'adjustment') {
      lot.quantity = quantity
    }

    await lot.save()

    const movement = await Movement.create({
      lotId,
      userId: req.user._id,
      type,
      quantity,
      reason
    })

    res.status(201).json(movement)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getMovements = async (req, res) => {
  try {
    const filter = {}
    if (req.query.lotId) filter.lotId = req.query.lotId
    if (req.query.type) filter.type = req.query.type

    const movements = await Movement.find(filter)
      .populate('lotId', 'lotNumber expirationDate')
      .populate('userId', 'name email')
      .sort({ movedAt: -1 })

    res.json(movements)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { createMovement, getMovements }