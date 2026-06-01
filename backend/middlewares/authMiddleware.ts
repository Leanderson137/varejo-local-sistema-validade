import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import User, { IUser } from '../models/User'
import AppError from '../errors/AppError'

interface AuthRequest extends Request {
  user?: IUser
}

interface TokenPayload extends JwtPayload {
  id: string
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization

    console.log('AUTH HEADER RECEBIDO:', authHeader)

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Acesso negado. Token não fornecido.', 401)
    }

    const token = authHeader.split(' ')[1]
    const jwtSecret = process.env.JWT_SECRET

    console.log('TOKEN RECEBIDO:', token)
    console.log('TAMANHO DO TOKEN:', token?.length)
    console.log('JWT_SECRET EXISTE:', Boolean(jwtSecret))
    console.log('JWT_SECRET USADO:', jwtSecret)

    if (!jwtSecret) {
      throw new AppError('JWT_SECRET não definido no arquivo .env.', 500)
    }

    const decoded = jwt.verify(token, jwtSecret) as TokenPayload

    console.log('TOKEN DECODIFICADO:', decoded)

    const user = await User.findById(decoded.id).select('-passwordHash')

    if (!user || !user.active) {
      throw new AppError('Usuário não encontrado ou inativo.', 401)
    }

    req.user = user

    next()
  } catch (error) {
    console.log('ERRO REAL NO TOKEN:', error)

    if (error instanceof AppError) {
      next(error)
      return
    }

    next(new AppError('Token inválido ou expirado.', 401))
  }
}