const Lot = require('../models/Lot')
const Product = require('../models/Product')

const createLot = async (req, res) => {
  try {
    const { productId, lotNumber, manufactureDate, expirationDate, quantity } = req.body

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' })
    }

    const lot = await Lot.create({
      productId, lotNumber, manufactureDate, expirationDate, quantity
    })

    res.status(201).json(lot)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getLots = async (req, res) => {
  try {
    const filter = {}
    if (req.query.productId) filter.productId = req.query.productId
    if (req.query.status) filter.status = req.query.status

    const lots = await Lot.find(filter)
      .populate('productId', 'name sku alertDaysBeforeExpiry')
      .sort({ expirationDate: 1 })

    res.json(lots)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getLotById = async (req, res) => {
  try {
    const lot = await Lot.findById(req.params.id)
      .populate('productId', 'name sku alertDaysBeforeExpiry')

    if (!lot) {
      return res.status(404).json({ message: 'Lote não encontrado.' })
    }

    res.json(lot)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateLot = async (req, res) => {
  try {
    const lot = await Lot.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!lot) {
      return res.status(404).json({ message: 'Lote não encontrado.' })
    }

    res.json(lot)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const discardLot = async (req, res) => {
  try {
    const lot = await Lot.findByIdAndUpdate(
      req.params.id,
      { status: 'discarded' },
      { new: true }
    )

    if (!lot) {
      return res.status(404).json({ message: 'Lote não encontrado.' })
    }

    res.json({ message: 'Lote descartado com sucesso.', lot })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { createLot, getLots, getLotById, updateLot, discardLot }