import { ErrorRequestHandler } from 'express'
import AppError from '../errors/AppError'

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message
    })

    return
  }

  if (error instanceof Error) {
    res.status(500).json({
      message: error.message
    })

    return
  }

  res.status(500).json({
    message: 'Erro interno no servidor.'
  })
}

export default errorHandler