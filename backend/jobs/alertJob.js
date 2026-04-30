const cron = require('node-cron')
const Lot = require('../models/Lot')
const Alert = require('../models/Alert')

const runAlertJob = () => {
  cron.schedule('0 8 * * *', async () => {
    console.log('Verificando validades...')

    try {
      const lots = await Lot.find({ status: { $in: ['active', 'expiring_soon'] } })
        .populate('productId', 'alertDaysBeforeExpiry')

      const now = new Date()

      for (const lot of lots) {
        const daysUntilExpiry = Math.ceil(
          (lot.expirationDate - now) / (1000 * 60 * 60 * 24)
        )

        const alertDays = lot.productId?.alertDaysBeforeExpiry || 15

        if (daysUntilExpiry < 0) {
          await Lot.findByIdAndUpdate(lot._id, { status: 'expired' })

          await Alert.create({
            lotId: lot._id,
            level: 'critical'
          })

        } else if (daysUntilExpiry <= Math.floor(alertDays / 3)) {
          await Lot.findByIdAndUpdate(lot._id, { status: 'expiring_soon' })

          await Alert.create({
            lotId: lot._id,
            level: 'critical'
          })

        } else if (daysUntilExpiry <= alertDays) {
          await Lot.findByIdAndUpdate(lot._id, { status: 'expiring_soon' })

          await Alert.create({
            lotId: lot._id,
            level: 'attention'
          })
        }
      }

      console.log('Verificação de validades concluída.')
    } catch (error) {
      console.error('Erro no alertJob:', error.message)
    }
  })
}

module.exports = runAlertJob