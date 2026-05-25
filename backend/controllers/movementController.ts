import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { MovementType } from '../models/Movement'
import { IUser } from '../models/User'
import movementService from '../services/movementService'
import asyncHandler from '../utils/asyncHandler'
import {
  CreateMovementRequest,
  GetMovementsRequest
} from '../dtos/requests/movementRequest'
import {
  toMovementResponse,
  toMovementResponseList
} from '../mappers/movementMapper'

type AuthenticatedRequest<
  P = ParamsDictionary,
  ReqBody = unknown
> = Request<P, unknown, ReqBody> & {
  user?: IUser
}

export const createMovement = asyncHandler<
  ParamsDictionary,
  unknown,
  CreateMovementRequest
>(async (req: AuthenticatedRequest<ParamsDictionary, CreateMovementRequest>, res: Response) => {
  const movement = await movementService.createMovement({
    ...req.body,
    user: req.user
  })

  return res.status(201).json(toMovementResponse(movement))
})

export const getMovements = asyncHandler(
  async (req: Request, res: Response) => {
    const filter: GetMovementsRequest = {}

    if (req.query.lotId && typeof req.query.lotId === 'string') {
      filter.lotId = req.query.lotId
    }

    if (req.query.type && typeof req.query.type === 'string') {
      filter.type = req.query.type as MovementType
    }

    const movements = await movementService.getMovements(filter)

    return res.json(toMovementResponseList(movements))
  }
)