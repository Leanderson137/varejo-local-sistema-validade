import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { IUser } from '../models/User'
import authService from '../services/authService'
import asyncHandler from '../utils/asyncHandler'
import { RegisterRequest, LoginRequest } from '../dtos/requests/authRequest'

type AuthenticatedRequest<
  P = ParamsDictionary,
  ReqBody = unknown
> = Request<P, unknown, ReqBody> & {
  user?: IUser
}

export const register = asyncHandler<
  ParamsDictionary,
  unknown,
  RegisterRequest
>(async (req: Request<ParamsDictionary, unknown, RegisterRequest>, res: Response) => {
  const user = await authService.register(req.body)

  return res.status(201).json(user)
})

export const login = asyncHandler<
  ParamsDictionary,
  unknown,
  LoginRequest
>(async (req: Request<ParamsDictionary, unknown, LoginRequest>, res: Response) => {
  const user = await authService.login(req.body)

  return res.json(user)
})

export const getMe = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const user = authService.getMe(req.user)

    return res.json(user)
  }
)