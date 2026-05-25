import { Types } from 'mongoose'
import { IMovement } from '../models/Movement'
import lotRepository from '../repositories/lotRepository'
import movementRepository from '../repositories/movementRepository'
import AppError from '../errors/AppError'
import {
  CreateMovementServiceRequest,
  GetMovementsRequest
} from '../dtos/requests/movementRequest'

const createMovement = async (
  data: CreateMovementServiceRequest
): Promise<IMovement> => {
  const { lotId, type, quantity, reason, user } = data

  if (!user) {
    throw new AppError('Usuário não autenticado.', 401)
  }

  const lot = await lotRepository.findByIdWithoutPopulate(lotId)

  if (!lot) {
    throw new AppError('Lote não encontrado.', 404)
  }

  if (lot.status === 'discarded') {
    throw new AppError('Lote descartado não pode ser movimentado.', 400)
  }

  if (type === 'exit' || type === 'discard') {
    if (quantity > lot.quantity) {
      throw new AppError('Quantidade insuficiente no lote.', 400)
    }

    lot.quantity -= quantity

    if (type === 'discard') {
      lot.status = 'discarded'
    }
  }

  if (type === 'entry') {
    lot.quantity += quantity
  }

  if (type === 'adjustment') {
    lot.quantity = quantity
  }

  await lot.save()

  return movementRepository.create({
    lotId: new Types.ObjectId(lotId),
    userId: new Types.ObjectId(String(user._id)),
    type,
    quantity,
    reason
  })
}

const getMovements = async (
  filter: GetMovementsRequest = {}
): Promise<IMovement[]> => {
  return movementRepository.findAll(filter)
}

export default {
  createMovement,
  getMovements
}