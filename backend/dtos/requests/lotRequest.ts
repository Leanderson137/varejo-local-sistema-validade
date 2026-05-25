import { LotStatus } from '../../models/Lot'

export interface CreateLotRequest {
  productId: string
  lotNumber: string
  manufactureDate?: Date
  expirationDate: Date
  quantity: number
}

export interface UpdateLotRequest {
  productId?: string
  lotNumber?: string
  manufactureDate?: Date
  expirationDate?: Date
  quantity?: number
  status?: LotStatus
}

export interface GetLotsRequest {
  productId?: string
  status?: LotStatus
}