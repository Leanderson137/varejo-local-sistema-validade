import { AlertResponse } from './alertResponse'
import { LotResponse } from './lotResponse'
import { MovementResponse } from './movementResponse'

export interface DashboardResponse {
  totalLots: number
  expiringSoon: number
  expired: number
  unseenAlerts: number
  criticalLots: LotResponse[]
}

export interface ExpirationReportResponse {
  lots: LotResponse[]
}

export interface MovementReportResponse {
  movements: MovementResponse[]
}

export interface AlertReportResponse {
  alerts: AlertResponse[]
}