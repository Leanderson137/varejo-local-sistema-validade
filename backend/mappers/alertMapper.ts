import { IAlert } from '../models/Alert'
import {
  AlertLotResponse,
  AlertProductResponse,
  AlertResponse
} from '../dtos/responses/alertResponse'

const isPopulatedObject = (value: unknown): value is Record<string, any> => {
  return typeof value === 'object' && value !== null
}

const mapProduct = (
  product: unknown
): string | AlertProductResponse | undefined => {
  if (!product) {
    return undefined
  }

  if (isPopulatedObject(product) && product.name && product.sku) {
    return {
      _id: String(product._id),
      name: String(product.name),
      sku: String(product.sku)
    }
  }

  return String(product)
}

const mapLot = (
  lot: unknown
): string | AlertLotResponse => {
  if (isPopulatedObject(lot)) {
    return {
      _id: String(lot._id),
      lotNumber: lot.lotNumber ? String(lot.lotNumber) : undefined,
      expirationDate: lot.expirationDate
        ? new Date(lot.expirationDate)
        : undefined,
      productId: mapProduct(lot.productId)
    }
  }

  return String(lot)
}

export const toAlertResponse = (alert: IAlert): AlertResponse => {
  return {
    _id: String(alert._id),
    lotId: mapLot(alert.lotId),
    level: alert.level,
    seen: alert.seen,
    triggeredAt: alert.triggeredAt,
    createdAt: alert.createdAt,
    updatedAt: alert.updatedAt
  }
}

export const toAlertResponseList = (
  alerts: IAlert[]
): AlertResponse[] => {
  return alerts.map(toAlertResponse)
}