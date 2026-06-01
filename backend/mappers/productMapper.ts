import { IProduct } from '../models/Product'
import {
  ProductCategoryResponse,
  ProductCreatedByResponse,
  ProductResponse
} from '../dtos/responses/productResponse'

const isPopulatedObject = (value: unknown): value is Record<string, any> => {
  return typeof value === 'object' && value !== null
}

const mapCategory = (
  category: unknown
): string | ProductCategoryResponse => {
  if (isPopulatedObject(category) && category.name) {
    return {
      _id: String(category._id),
      name: String(category.name)
    }
  }

  return String(category)
}

const mapCreatedBy = (
  createdBy: unknown
): string | ProductCreatedByResponse => {
  if (isPopulatedObject(createdBy) && createdBy.name && createdBy.email) {
    return {
      _id: String(createdBy._id),
      name: String(createdBy.name),
      email: String(createdBy.email)
    }
  }

  return String(createdBy)
}

export const toProductResponse = (
  product: IProduct
): ProductResponse => {
  return {
    _id: String(product._id),
    name: product.name,
    sku: product.sku,
    barcode: product.barcode,
    categoryId: mapCategory(product.categoryId),
    unitCost: product.unitCost,
    minimumStock: product.minimumStock ?? 0,
    alertDaysBeforeExpiry: product.alertDaysBeforeExpiry,
    createdBy: mapCreatedBy(product.createdBy),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  }
}

export const toProductResponseList = (
  products: IProduct[]
): ProductResponse[] => {
  return products.map(toProductResponse)
}