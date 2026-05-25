import { AlertLevel } from '../../models/Alert'

export interface AlertProductResponse {
  _id: string
  name: string
  sku: string
}

export interface AlertLotResponse {
  _id: string
  lotNumber?: string
  expirationDate?: Date
  productId?: string | AlertProductResponse
}

export interface AlertResponse {
  _id: string
  lotId: string | AlertLotResponse
  level: AlertLevel
  seen: boolean
  triggeredAt: Date
  createdAt: Date
  updatedAt: Date
}