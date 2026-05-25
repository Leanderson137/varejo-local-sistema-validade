import { ILot } from '../models/Lot'
import {
  LotProductResponse,
  LotResponse
} from '../dtos/responses/lotResponse'

const isPopulatedObject = (value: unknown): value is Record<string, any> => {
  return typeof value === 'object' && value !== null
}

const mapProduct = (
  product: unknown
): string | LotProductResponse => {
  if (isPopulatedObject(product) && product.name && product.sku) {
    return {
      _id: String(product._id),
      name: String(product.name),
      sku: String(product.sku),
      alertDaysBeforeExpiry:
        product.alertDaysBeforeExpiry !== undefined
          ? Number(product.alertDaysBeforeExpiry)
          : undefined
    }
  }

  return String(product)
}

export const toLotResponse = (lot: ILot): LotResponse => {
  return {
    _id: String(lot._id),
    productId: mapProduct(lot.productId),
    lotNumber: lot.lotNumber,
    manufactureDate: lot.manufactureDate,
    expirationDate: lot.expirationDate,
    quantity: lot.quantity,
    status: lot.status,
    createdAt: lot.createdAt,
    updatedAt: lot.updatedAt
  }
}

export const toLotResponseList = (lots: ILot[]): LotResponse[] => {
  return lots.map(toLotResponse)
}