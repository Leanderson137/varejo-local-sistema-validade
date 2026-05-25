import { IMovement } from '../models/Movement'
import {
  MovementLotResponse,
  MovementResponse,
  MovementUserResponse
} from '../dtos/responses/movementResponse'

const isPopulatedObject = (value: unknown): value is Record<string, any> => {
  return typeof value === 'object' && value !== null
}

const mapLot = (
  lot: unknown
): string | MovementLotResponse => {
  if (isPopulatedObject(lot) && lot.lotNumber && lot.expirationDate) {
    return {
      _id: String(lot._id),
      lotNumber: String(lot.lotNumber),
      expirationDate: new Date(lot.expirationDate)
    }
  }

  return String(lot)
}

const mapUser = (
  user: unknown
): string | MovementUserResponse => {
  if (isPopulatedObject(user) && user.name && user.email) {
    return {
      _id: String(user._id),
      name: String(user.name),
      email: String(user.email)
    }
  }

  return String(user)
}

export const toMovementResponse = (
  movement: IMovement
): MovementResponse => {
  return {
    _id: String(movement._id),
    lotId: mapLot(movement.lotId),
    userId: mapUser(movement.userId),
    type: movement.type,
    quantity: movement.quantity,
    reason: movement.reason,
    movedAt: movement.movedAt,
    createdAt: movement.createdAt,
    updatedAt: movement.updatedAt
  }
}

export const toMovementResponseList = (
  movements: IMovement[]
): MovementResponse[] => {
  return movements.map(toMovementResponse)
}