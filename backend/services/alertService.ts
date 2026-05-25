import { Types } from 'mongoose'
import { IAlert } from '../models/Alert'
import alertRepository from '../repositories/alertRepository'
import AppError from '../errors/AppError'
import {
  CreateAlertRequest,
  GetAlertsRequest
} from '../dtos/requests/alertRequest'

const createAlert = async (data: CreateAlertRequest): Promise<IAlert> => {
  return alertRepository.create({
    lotId: new Types.ObjectId(data.lotId),
    level: data.level
  })
}

const getAlerts = async (
  filter: GetAlertsRequest = {}
): Promise<IAlert[]> => {
  return alertRepository.findAll(filter)
}

const markAsSeen = async (id: string): Promise<IAlert> => {
  const alert = await alertRepository.markAsSeen(id)

  if (!alert) {
    throw new AppError('Alerta não encontrado.', 404)
  }

  return alert
}

const markAllAsSeen = async (): Promise<void> => {
  await alertRepository.markAllAsSeen()
}

const countUnseen = async (): Promise<number> => {
  return alertRepository.countUnseen()
}

export default {
  createAlert,
  getAlerts,
  markAsSeen,
  markAllAsSeen,
  countUnseen
}