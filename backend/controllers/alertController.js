const Alert = require('../models/Alert')

const getAlerts = async (req, res) => {
  try {
    const filter = {}
    if (req.query.seen) filter.seen = req.query.seen === 'true'
    if (req.query.level) filter.level = req.query.level

    const alerts = await Alert.find(filter)
      .populate({
        path: 'lotId',
        populate: { path: 'productId', select: 'name sku' }
      })
      .sort({ triggeredAt: -1 })

    res.json(alerts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const markAsSeen = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { seen: true },
      { new: true }
    )

    if (!alert) {
      return res.status(404).json({ message: 'Alerta não encontrado.' })
    }

    res.json({ message: 'Alerta marcado como visto.', alert })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const markAllAsSeen = async (req, res) => {
  try {
    await Alert.updateMany({ seen: false }, { seen: true })
    res.json({ message: 'Todos os alertas marcados como vistos.' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getAlerts, markAsSeen, markAllAsSeen }