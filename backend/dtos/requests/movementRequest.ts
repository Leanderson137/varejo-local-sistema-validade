import { MovementType } from '../../models/Movement'
import { IUser } from '../../models/User'

export interface CreateMovementRequest {
  lotId: string
  type: MovementType
  quantity: number
  reason?: string
}

export interface CreateMovementServiceRequest extends CreateMovementRequest {
  user: IUser | undefined
}

export interface GetMovementsRequest {
  lotId?: string
  type?: MovementType
}