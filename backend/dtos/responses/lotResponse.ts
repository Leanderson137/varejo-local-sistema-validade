import { LotStatus } from '../../models/Lot'

export interface LotProductResponse {
  _id: string
  name: string
  sku: string
  alertDaysBeforeExpiry?: number
}

export interface LotResponse {
  _id: string
  productId: string | LotProductResponse
  lotNumber: string
  manufactureDate?: Date
  expirationDate: Date
  quantity: number
  status: LotStatus
  createdAt: Date
  updatedAt: Date
}