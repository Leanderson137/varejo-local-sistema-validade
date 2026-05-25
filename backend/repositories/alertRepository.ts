import { Types } from 'mongoose'
import Alert, { IAlert, AlertLevel } from '../models/Alert'

interface AlertFilter {
  seen?: boolean
  level?: AlertLevel
}

interface CreateAlertData {
  lotId: Types.ObjectId
  level: AlertLevel
}

const create = async (data: CreateAlertData): Promise<IAlert> => {
  return Alert.create(data)
}

const findAll = async (filter: AlertFilter = {}): Promise<IAlert[]> => {
  return Alert.find(filter)
    .populate({
      path: 'lotId',
      populate: { path: 'productId', select: 'name sku' }
    })
    .sort({ triggeredAt: -1 })
}

const markAsSeen = async (id: string): Promise<IAlert | null> => {
  return Alert.findByIdAndUpdate(id, { seen: true }, { new: true })
}

const markAllAsSeen = async (): Promise<void> => {
  await Alert.updateMany({ seen: false }, { seen: true })
}

const countUnseen = async (): Promise<number> => {
  return Alert.countDocuments({ seen: false })
}

export default {
  create,
  findAll,
  markAsSeen,
  markAllAsSeen,
  countUnseen
}