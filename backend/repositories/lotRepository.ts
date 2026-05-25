import { Types } from 'mongoose'
import Lot, { ILot, LotStatus } from '../models/Lot'

interface CreateLotData {
  productId: Types.ObjectId
  lotNumber: string
  manufactureDate?: Date
  expirationDate: Date
  quantity: number
}

interface LotFilter {
  productId?: string
  status?: LotStatus
}

interface UpdateLotData {
  productId?: Types.ObjectId
  lotNumber?: string
  manufactureDate?: Date
  expirationDate?: Date
  quantity?: number
  status?: LotStatus
}

interface ExpirationReportFilter {
  expirationDate?: {
    $gte?: Date
    $lte?: Date
  }
  productId?: string
  status?: LotStatus
}

const create = async (data: CreateLotData): Promise<ILot> => {
  return Lot.create(data)
}

const findById = async (id: string): Promise<ILot | null> => {
  return Lot.findById(id).populate(
    'productId',
    'name sku alertDaysBeforeExpiry'
  )
}

const findByIdWithoutPopulate = async (id: string): Promise<ILot | null> => {
  return Lot.findById(id)
}

const findAll = async (filter: LotFilter = {}): Promise<ILot[]> => {
  return Lot.find(filter)
    .populate('productId', 'name sku alertDaysBeforeExpiry')
    .sort({ expirationDate: 1 })
}

const updateById = async (
  id: string,
  data: UpdateLotData
): Promise<ILot | null> => {
  return Lot.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  })
}

const updateStatusById = async (
  id: string,
  status: LotStatus
): Promise<ILot | null> => {
  return Lot.findByIdAndUpdate(id, { status }, { new: true })
}

const countByStatusNotDiscarded = async (): Promise<number> => {
  return Lot.countDocuments({ status: { $ne: 'discarded' } })
}

const countByStatus = async (status: LotStatus): Promise<number> => {
  return Lot.countDocuments({ status })
}

const findCriticalLots = async (): Promise<ILot[]> => {
  return Lot.find({
    status: { $in: ['expiring_soon', 'expired'] }
  })
    .populate('productId', 'name sku')
    .sort({ expirationDate: 1 })
    .limit(5)
}

const findExpirationReport = async (
  filter: ExpirationReportFilter = {}
): Promise<ILot[]> => {
  return Lot.find(filter)
    .populate('productId', 'name sku unitCost alertDaysBeforeExpiry')
    .sort({ expirationDate: 1 })
}

const findLotsForAlertJob = async (): Promise<ILot[]> => {
  return Lot.find({
    status: { $in: ['active', 'expiring_soon'] }
  }).populate('productId', 'alertDaysBeforeExpiry')
}

export default {
  create,
  findById,
  findByIdWithoutPopulate,
  findAll,
  updateById,
  updateStatusById,
  countByStatusNotDiscarded,
  countByStatus,
  findCriticalLots,
  findExpirationReport,
  findLotsForAlertJob
}