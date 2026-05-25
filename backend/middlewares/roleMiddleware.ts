import { NextFunction, Request, Response } from 'express'
import { IUser } from '../models/User'
import AppError from '../errors/AppError'

interface AuthRequest extends Request {
  user?: IUser
}

export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && req.user.role === 'admin') {
    next()
    return
  }

  next(new AppError('Acesso restrito a administradores.', 403))
}