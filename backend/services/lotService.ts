import { Types } from 'mongoose'
import Lot, { ILot } from '../models/Lot'
import Product from '../models/Product'
import lotRepository from '../repositories/lotRepository'
import productRepository from '../repositories/productRepository'
import AppError from '../errors/AppError'
import {
  CreateLotRequest,
  UpdateLotRequest,
  GetLotsRequest
} from '../dtos/requests/lotRequest'

const createLot = async (data: CreateLotRequest): Promise<ILot> => {
  const product = await productRepository.findById(data.productId)

  if (!product) {
    throw new AppError('Produto não encontrado.', 404)
  }

  return lotRepository.create({
    ...data,
    productId: new Types.ObjectId(data.productId)
  })
}

const getLots = async (filter: GetLotsRequest = {}): Promise<ILot[]> => {
  return lotRepository.findAll(filter)
}

const getLotById = async (id: string): Promise<ILot> => {
  const lot = await lotRepository.findById(id)

  if (!lot) {
    throw new AppError('Lote não encontrado.', 404)
  }

  return lot
}

const updateLot = async (
  id: string,
  data: UpdateLotRequest
): Promise<ILot> => {
  const updateData = {
    ...data,
    productId: data.productId
      ? new Types.ObjectId(data.productId)
      : undefined
  }

  const lot = await lotRepository.updateById(id, updateData)

  if (!lot) {
    throw new AppError('Lote não encontrado.', 404)
  }

  return lot
}

const discardLot = async (id: string): Promise<ILot> => {
  const lot = await lotRepository.updateStatusById(id, 'discarded')

  if (!lot) {
    throw new AppError('Lote não encontrado.', 404)
  }

  return lot
}

const deleteOrphanLots = async (): Promise<number> => {
  const lots = await Lot.find().select('_id productId')

  const orphanLotIds: string[] = []

  for (const lot of lots) {
    const productExists = await Product.exists({
      _id: lot.productId
    })

    if (!productExists) {
      orphanLotIds.push(String(lot._id))
    }
  }

  if (orphanLotIds.length === 0) {
    return 0
  }

  const result = await Lot.deleteMany({
    _id: {
      $in: orphanLotIds
    }
  })

  return result.deletedCount ?? 0
}

export default {
  createLot,
  getLots,
  getLotById,
  updateLot,
  discardLot,
  deleteOrphanLots
}