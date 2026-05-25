import { MovementType } from '../../models/Movement'

export interface MovementLotResponse {
  _id: string
  lotNumber: string
  expirationDate: Date
}

export interface MovementUserResponse {
  _id: string
  name: string
  email: string
}

export interface MovementResponse {
  _id: string
  lotId: string | MovementLotResponse
  userId: string | MovementUserResponse
  type: MovementType
  quantity: number
  reason?: string
  movedAt: Date
  createdAt: Date
  updatedAt: Date
}