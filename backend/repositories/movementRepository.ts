import { Types } from 'mongoose'
import Movement, { IMovement, MovementType } from '../models/Movement'

interface CreateMovementData {
  lotId: Types.ObjectId
  userId: Types.ObjectId
  type: MovementType
  quantity: number
  reason?: string
}

interface MovementFilter {
  lotId?: string
  type?: MovementType
}

interface MovementReportFilter {
  movedAt?: {
    $gte?: Date
    $lte?: Date
  }
  type?: MovementType
}

const create = async (data: CreateMovementData): Promise<IMovement> => {
  return Movement.create(data)
}

const findAll = async (filter: MovementFilter = {}): Promise<IMovement[]> => {
  return Movement.find(filter)
    .populate('lotId', 'lotNumber expirationDate')
    .populate('userId', 'name email')
    .sort({ movedAt: -1 })
}

const findMovementReport = async (
  filter: MovementReportFilter = {}
): Promise<IMovement[]> => {
  return Movement.find(filter)
    .populate({
      path: 'lotId',
      populate: { path: 'productId', select: 'name sku' }
    })
    .populate('userId', 'name email')
    .sort({ movedAt: -1 })
}

export default {
  create,
  findAll,
  findMovementReport
}