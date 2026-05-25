import { AlertLevel } from '../../models/Alert'

export interface CreateAlertRequest {
  lotId: string
  level: AlertLevel
}

export interface GetAlertsRequest {
  seen?: boolean
  level?: AlertLevel
}