import { LotStatus } from '../../models/Lot'
import { MovementType } from '../../models/Movement'

export interface ExpirationReportRequest {
  startDate?: string
  endDate?: string
  productId?: string
  status?: LotStatus
}

export interface MovementReportRequest {
  startDate?: string
  endDate?: string
  type?: MovementType
}