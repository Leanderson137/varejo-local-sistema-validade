import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { LotStatus } from '../models/Lot'
import lotService from '../services/lotService'
import asyncHandler from '../utils/asyncHandler'
import {
  CreateLotRequest,
  UpdateLotRequest,
  GetLotsRequest
} from '../dtos/requests/lotRequest'
import {
  toLotResponse,
  toLotResponseList
} from '../mappers/lotMapper'

interface IdParams extends ParamsDictionary {
  id: string
}

export const createLot = asyncHandler<
  ParamsDictionary,
  unknown,
  CreateLotRequest
>(async (req: Request<ParamsDictionary, unknown, CreateLotRequest>, res: Response) => {
  const lot = await lotService.createLot(req.body)

  return res.status(201).json(toLotResponse(lot))
})

export const getLots = asyncHandler(
  async (req: Request, res: Response) => {
    const filter: GetLotsRequest = {}

    if (req.query.productId && typeof req.query.productId === 'string') {
      filter.productId = req.query.productId
    }

    if (req.query.status && typeof req.query.status === 'string') {
      filter.status = req.query.status as LotStatus
    }

    const lots = await lotService.getLots(filter)

    return res.json(toLotResponseList(lots))
  }
)

export const getLotById = asyncHandler<IdParams>(
  async (req: Request<IdParams>, res: Response) => {
    const lot = await lotService.getLotById(req.params.id)

    return res.json(toLotResponse(lot))
  }
)

export const updateLot = asyncHandler<
  IdParams,
  unknown,
  UpdateLotRequest
>(async (req: Request<IdParams, unknown, UpdateLotRequest>, res: Response) => {
  const lot = await lotService.updateLot(req.params.id, req.body)

  return res.json(toLotResponse(lot))
})

export const discardLot = asyncHandler<IdParams>(
  async (req: Request<IdParams>, res: Response) => {
    const lot = await lotService.discardLot(req.params.id)

    return res.json({
      message: 'Lote descartado com sucesso.',
      lot: toLotResponse(lot)
    })
  }
)