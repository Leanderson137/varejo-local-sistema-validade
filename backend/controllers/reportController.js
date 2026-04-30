const Lot = require('../models/Lot')
const Movement = require('../models/Movement')
const Alert = require('../models/Alert')
const Product = require('../models/Product')

const getDashboard = async (req, res) => {
  try {
    const totalLots = await Lot.countDocuments({ status: { $ne: 'discarded' } })
    const expiringSoon = await Lot.countDocuments({ status: 'expiring_soon' })
    const expired = await Lot.countDocuments({ status: 'expired' })
    const unseenAlerts = await Alert.countDocuments({ seen: false })

    const criticalLots = await Lot.find({ status: { $in: ['expiring_soon', 'expired'] } })
      .populate('productId', 'name sku')
      .sort({ expirationDate: 1 })
      .limit(5)

    res.json({
      totalLots,
      expiringSoon,
      expired,
      unseenAlerts,
      criticalLots
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getExpirationReport = async (req, res) => {
  try {
    const { startDate, endDate, productId, status } = req.query

    const filter = {}

    if (startDate || endDate) {
      filter.expirationDate = {}
      if (startDate) filter.expirationDate.$gte = new Date(startDate)
      if (endDate) filter.expirationDate.$lte = new Date(endDate)
    }

    if (productId) filter.productId = productId
    if (status) filter.status = status

    const lots = await Lot.find(filter)
      .populate('productId', 'name sku unitCost alertDaysBeforeExpiry')
      .sort({ expirationDate: 1 })

    res.json(lots)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getMovementReport = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query

    const filter = {}

    if (startDate || endDate) {
      filter.movedAt = {}
      if (startDate) filter.movedAt.$gte = new Date(startDate)
      if (endDate) filter.movedAt.$lte = new Date(endDate)
    }

    if (type) filter.type = type

    const movements = await Movement.find(filter)
      .populate({
        path: 'lotId',
        populate: { path: 'productId', select: 'name sku' }
      })
      .populate('userId', 'name email')
      .sort({ movedAt: -1 })

    res.json(movements)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getDashboard, getExpirationReport, getMovementReport }