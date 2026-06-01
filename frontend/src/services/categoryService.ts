import api from './api'
import type { Category, CategoryApiResponse } from '../types/category'

const mapCategoryFromApi = (category: CategoryApiResponse): Category => {
  return {
    id: category._id,
    name: category.name,
    description: category.description
  }
}

const getCategories = async (): Promise<Category[]> => {
  const categories = await api.get<CategoryApiResponse[]>('/categories')

  return categories.map(mapCategoryFromApi)
}

export default {
  getCategories
}