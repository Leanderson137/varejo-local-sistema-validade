import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import categoryService from '../services/categoryService'
import asyncHandler from '../utils/asyncHandler'
import {
  CreateCategoryRequest,
  UpdateCategoryRequest
} from '../dtos/requests/categoryRequest'
import {
  toCategoryResponse,
  toCategoryResponseList
} from '../mappers/categoryMapper'

interface IdParams extends ParamsDictionary {
  id: string
}

export const createCategory = asyncHandler<
  ParamsDictionary,
  unknown,
  CreateCategoryRequest
>(async (req: Request<ParamsDictionary, unknown, CreateCategoryRequest>, res: Response) => {
  const category = await categoryService.createCategory(req.body)

  return res.status(201).json(toCategoryResponse(category))
})

export const getCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const categories = await categoryService.getCategories()

    return res.json(toCategoryResponseList(categories))
  }
)

export const getCategoryById = asyncHandler<IdParams>(
  async (req: Request<IdParams>, res: Response) => {
    const category = await categoryService.getCategoryById(req.params.id)

    return res.json(toCategoryResponse(category))
  }
)

export const updateCategory = asyncHandler<
  IdParams,
  unknown,
  UpdateCategoryRequest
>(async (req: Request<IdParams, unknown, UpdateCategoryRequest>, res: Response) => {
  const category = await categoryService.updateCategory(req.params.id, req.body)

  return res.json(toCategoryResponse(category))
})

export const deleteCategory = asyncHandler<IdParams>(
  async (req: Request<IdParams>, res: Response) => {
    await categoryService.deleteCategory(req.params.id)

    return res.json({ message: 'Categoria removida com sucesso.' })
  }
)