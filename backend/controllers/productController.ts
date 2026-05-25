import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { IUser } from '../models/User'
import productService from '../services/productService'
import asyncHandler from '../utils/asyncHandler'
import {
  CreateProductRequest,
  UpdateProductRequest
} from '../dtos/requests/productRequest'
import {
  toProductResponse,
  toProductResponseList
} from '../mappers/productMapper'

interface IdParams extends ParamsDictionary {
  id: string
}

type AuthenticatedRequest<
  P = ParamsDictionary,
  ReqBody = unknown
> = Request<P, unknown, ReqBody> & {
  user?: IUser
}

export const createProduct = asyncHandler<
  ParamsDictionary,
  unknown,
  CreateProductRequest
>(async (req: AuthenticatedRequest<ParamsDictionary, CreateProductRequest>, res: Response) => {
  const createdBy = productService.getCreatedById(req.user)

  const product = await productService.createProduct({
    ...req.body,
    createdBy
  })

  return res.status(201).json(toProductResponse(product))
})

export const getProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const products = await productService.getProducts()

    return res.json(toProductResponseList(products))
  }
)

export const getProductById = asyncHandler<IdParams>(
  async (req: Request<IdParams>, res: Response) => {
    const product = await productService.getProductById(req.params.id)

    return res.json(toProductResponse(product))
  }
)

export const updateProduct = asyncHandler<
  IdParams,
  unknown,
  UpdateProductRequest
>(async (req: Request<IdParams, unknown, UpdateProductRequest>, res: Response) => {
  const product = await productService.updateProduct(req.params.id, req.body)

  return res.json(toProductResponse(product))
})

export const deleteProduct = asyncHandler<IdParams>(
  async (req: Request<IdParams>, res: Response) => {
    await productService.deleteProduct(req.params.id)

    return res.json({ message: 'Produto removido com sucesso.' })
  }
)