import { Types } from 'mongoose'
import { IProduct } from '../models/Product'
import { IUser } from '../models/User'
import productRepository from '../repositories/productRepository'
import AppError from '../errors/AppError'
import {
  CreateProductServiceRequest,
  UpdateProductRequest
} from '../dtos/requests/productRequest'

const createProduct = async (
  data: CreateProductServiceRequest
): Promise<IProduct> => {
  const skuExists = await productRepository.findBySku(data.sku)

  if (skuExists) {
    throw new AppError('SKU já cadastrado.', 400)
  }

  return productRepository.create({
    ...data,
    categoryId: new Types.ObjectId(data.categoryId),
    createdBy: new Types.ObjectId(data.createdBy)
  })
}

const getProducts = async (): Promise<IProduct[]> => {
  return productRepository.findAll()
}

const getProductById = async (id: string): Promise<IProduct> => {
  const product = await productRepository.findById(id)

  if (!product) {
    throw new AppError('Produto não encontrado.', 404)
  }

  return product
}

const updateProduct = async (
  id: string,
  data: UpdateProductRequest
): Promise<IProduct> => {
  const updateData = {
    ...data,
    categoryId: data.categoryId
      ? new Types.ObjectId(data.categoryId)
      : undefined
  }

  const product = await productRepository.updateById(id, updateData)

  if (!product) {
    throw new AppError('Produto não encontrado.', 404)
  }

  return product
}

const deleteProduct = async (id: string): Promise<void> => {
  const product = await productRepository.deleteById(id)

  if (!product) {
    throw new AppError('Produto não encontrado.', 404)
  }
}

const getCreatedById = (user: IUser | undefined): string => {
  if (!user) {
    throw new AppError('Usuário não autenticado.', 401)
  }

  return String(user._id)
}

export default {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getCreatedById
}