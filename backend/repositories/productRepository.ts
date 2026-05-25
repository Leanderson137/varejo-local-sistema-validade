import { Types } from 'mongoose'
import Product, { IProduct } from '../models/Product'

interface CreateProductData {
  name: string
  sku: string
  barcode?: string
  categoryId: Types.ObjectId
  unitCost: number
  alertDaysBeforeExpiry?: number
  createdBy: Types.ObjectId
}

interface UpdateProductData {
  name?: string
  sku?: string
  barcode?: string
  categoryId?: Types.ObjectId
  unitCost?: number
  alertDaysBeforeExpiry?: number
}

const findBySku = async (sku: string): Promise<IProduct | null> => {
  return Product.findOne({ sku })
}

const findById = async (id: string): Promise<IProduct | null> => {
  return Product.findById(id)
    .populate('categoryId', 'name')
    .populate('createdBy', 'name email')
}

const findAll = async (): Promise<IProduct[]> => {
  return Product.find()
    .populate('categoryId', 'name')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
}

const create = async (data: CreateProductData): Promise<IProduct> => {
  return Product.create(data)
}

const updateById = async (
  id: string,
  data: UpdateProductData
): Promise<IProduct | null> => {
  return Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  })
}

const deleteById = async (id: string): Promise<IProduct | null> => {
  return Product.findByIdAndDelete(id)
}

export default {
  findBySku,
  findById,
  findAll,
  create,
  updateById,
  deleteById
}