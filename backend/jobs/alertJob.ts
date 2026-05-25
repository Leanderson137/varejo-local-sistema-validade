import cron from 'node-cron'
import { Types } from 'mongoose'
import lotRepository from '../repositories/lotRepository'
import alertService from '../services/alertService'

interface PopulatedProduct {
  alertDaysBeforeExpiry?: number
}

interface LotForAlertJob {
  _id: Types.ObjectId
  expirationDate: Date
  productId?: PopulatedProduct
}

const runAlertJob = (): void => {
  cron.schedule('0 8 * * *', async () => {
    console.log('Verificando validades...')

    try {
      const lots = await lotRepository.findLotsForAlertJob()
      const now = new Date()

      for (const lot of lots as unknown as LotForAlertJob[]) {
        const daysUntilExpiry = Math.ceil(
          (lot.expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        )

        const alertDays = lot.productId?.alertDaysBeforeExpiry || 15
        const lotId = String(lot._id)

        if (daysUntilExpiry < 0) {
          await lotRepository.updateStatusById(lotId, 'expired')

          await alertService.createAlert({
            lotId,
            level: 'critical'
          })
        } else if (daysUntilExpiry <= Math.floor(alertDays / 3)) {
          await lotRepository.updateStatusById(lotId, 'expiring_soon')

          await alertService.createAlert({
            lotId,
            level: 'critical'
          })
        } else if (daysUntilExpiry <= alertDays) {
          await lotRepository.updateStatusById(lotId, 'expiring_soon')

          await alertService.createAlert({
            lotId,
            level: 'attention'
          })
        }
      }

      console.log('Verificação de validades concluída.')
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro no alertJob:', error.message)
      } else {
        console.error('Erro desconhecido no alertJob.')
      }
    }
  })
}

export default runAlertJob