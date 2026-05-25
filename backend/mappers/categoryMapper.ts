import { ICategory } from '../models/Category'
import { CategoryResponse } from '../dtos/responses/categoryResponse'

export const toCategoryResponse = (
  category: ICategory
): CategoryResponse => {
  return {
    _id: String(category._id),
    name: category.name,
    description: category.description,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt
  }
}

export const toCategoryResponseList = (
  categories: ICategory[]
): CategoryResponse[] => {
  return categories.map(toCategoryResponse)
}