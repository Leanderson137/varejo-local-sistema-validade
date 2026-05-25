import Category, { ICategory } from '../models/Category'

interface CreateCategoryData {
  name: string
  description?: string
}

const create = async (data: CreateCategoryData): Promise<ICategory> => {
  return Category.create(data)
}

const findById = async (id: string): Promise<ICategory | null> => {
  return Category.findById(id)
}

const findByName = async (name: string): Promise<ICategory | null> => {
  return Category.findOne({ name })
}

const findAll = async (): Promise<ICategory[]> => {
  return Category.find().sort({ name: 1 })
}

const updateById = async (
  id: string,
  data: Partial<ICategory>
): Promise<ICategory | null> => {
  return Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  })
}

const deleteById = async (id: string): Promise<ICategory | null> => {
  return Category.findByIdAndDelete(id)
}

export default {
  create,
  findById,
  findByName,
  findAll,
  updateById,
  deleteById
}