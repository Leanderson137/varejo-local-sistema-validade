import { ILot } from '../models/Lot'
import { IMovement } from '../models/Movement'
import {
  DashboardResponse,
  ExpirationReportResponse,
  MovementReportResponse
} from '../dtos/responses/reportResponse'
import { toLotResponse, toLotResponseList } from './lotMapper'
import { toMovementResponseList } from './movementMapper'

interface DashboardData {
  totalLots: number
  expiringSoon: number
  expired: number
  unseenAlerts: number
  criticalLots: ILot[]
}

export const toDashboardResponse = (
  dashboard: DashboardData
): DashboardResponse => {
  return {
    totalLots: dashboard.totalLots,
    expiringSoon: dashboard.expiringSoon,
    expired: dashboard.expired,
    unseenAlerts: dashboard.unseenAlerts,
    criticalLots: dashboard.criticalLots.map(toLotResponse)
  }
}

export const toExpirationReportResponse = (
  lots: ILot[]
): ExpirationReportResponse => {
  return {
    lots: toLotResponseList(lots)
  }
}

export const toMovementReportResponse = (
  movements: IMovement[]
): MovementReportResponse => {
  return {
    movements: toMovementResponseList(movements)
  }
}