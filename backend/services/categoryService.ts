import { ICategory } from '../models/Category'
import categoryRepository from '../repositories/categoryRepository'
import AppError from '../errors/AppError'
import {
  CreateCategoryRequest,
  UpdateCategoryRequest
} from '../dtos/requests/categoryRequest'

const createCategory = async (
  data: CreateCategoryRequest
): Promise<ICategory> => {
  const categoryExists = await categoryRepository.findByName(data.name)

  if (categoryExists) {
    throw new AppError('Categoria já cadastrada.', 400)
  }

  return categoryRepository.create(data)
}

const getCategories = async (): Promise<ICategory[]> => {
  return categoryRepository.findAll()
}

const getCategoryById = async (id: string): Promise<ICategory> => {
  const category = await categoryRepository.findById(id)

  if (!category) {
    throw new AppError('Categoria não encontrada.', 404)
  }

  return category
}

const updateCategory = async (
  id: string,
  data: UpdateCategoryRequest
): Promise<ICategory> => {
  if (data.name) {
    const categoryExists = await categoryRepository.findByName(data.name)

    if (categoryExists && String(categoryExists._id) !== id) {
      throw new AppError('Categoria já cadastrada.', 400)
    }
  }

  const category = await categoryRepository.updateById(id, data)

  if (!category) {
    throw new AppError('Categoria não encontrada.', 404)
  }

  return category
}

const deleteCategory = async (id: string): Promise<void> => {
  const category = await categoryRepository.deleteById(id)

  if (!category) {
    throw new AppError('Categoria não encontrada.', 404)
  }
}

export default {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
}