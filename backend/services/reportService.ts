import { ILot } from '../models/Lot'
import { IMovement } from '../models/Movement'
import lotRepository from '../repositories/lotRepository'
import movementRepository from '../repositories/movementRepository'
import alertRepository from '../repositories/alertRepository'
import {
  ExpirationReportRequest,
  MovementReportRequest
} from '../dtos/requests/reportRequest'

interface DashboardData {
  totalLots: number
  expiringSoon: number
  expired: number
  unseenAlerts: number
  criticalLots: ILot[]
}

const getDashboard = async (): Promise<DashboardData> => {
  const totalLots = await lotRepository.countByStatusNotDiscarded()
  const expiringSoon = await lotRepository.countByStatus('expiring_soon')
  const expired = await lotRepository.countByStatus('expired')
  const unseenAlerts = await alertRepository.countUnseen()
  const criticalLots = await lotRepository.findCriticalLots()

  return {
    totalLots,
    expiringSoon,
    expired,
    unseenAlerts,
    criticalLots
  }
}

const getExpirationReport = async (
  filters: ExpirationReportRequest
): Promise<ILot[]> => {
  const filter: {
    expirationDate?: {
      $gte?: Date
      $lte?: Date
    }
    productId?: string
    status?: ExpirationReportRequest['status']
  } = {}

  if (filters.startDate || filters.endDate) {
    filter.expirationDate = {}

    if (filters.startDate) {
      filter.expirationDate.$gte = new Date(filters.startDate)
    }

    if (filters.endDate) {
      filter.expirationDate.$lte = new Date(filters.endDate)
    }
  }

  if (filters.productId) {
    filter.productId = filters.productId
  }

  if (filters.status) {
    filter.status = filters.status
  }

  return lotRepository.findExpirationReport(filter)
}

const getMovementReport = async (
  filters: MovementReportRequest
): Promise<IMovement[]> => {
  const filter: {
    movedAt?: {
      $gte?: Date
      $lte?: Date
    }
    type?: MovementReportRequest['type']
  } = {}

  if (filters.startDate || filters.endDate) {
    filter.movedAt = {}

    if (filters.startDate) {
      filter.movedAt.$gte = new Date(filters.startDate)
    }

    if (filters.endDate) {
      filter.movedAt.$lte = new Date(filters.endDate)
    }
  }

  if (filters.type) {
    filter.type = filters.type
  }

  return movementRepository.findMovementReport(filter)
}

export default {
  getDashboard,
  getExpirationReport,
  getMovementReport
}