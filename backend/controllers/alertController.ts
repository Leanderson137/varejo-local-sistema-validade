import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { AlertLevel } from '../models/Alert'
import alertService from '../services/alertService'
import asyncHandler from '../utils/asyncHandler'
import { GetAlertsRequest } from '../dtos/requests/alertRequest'
import {
  toAlertResponse,
  toAlertResponseList
} from '../mappers/alertMapper'

interface IdParams extends ParamsDictionary {
  id: string
}

export const getAlerts = asyncHandler(
  async (req: Request, res: Response) => {
    const filter: GetAlertsRequest = {}

    if (req.query.seen && typeof req.query.seen === 'string') {
      filter.seen = req.query.seen === 'true'
    }

    if (req.query.level && typeof req.query.level === 'string') {
      filter.level = req.query.level as AlertLevel
    }

    const alerts = await alertService.getAlerts(filter)

    return res.json(toAlertResponseList(alerts))
  }
)

export const markAsSeen = asyncHandler<IdParams>(
  async (req: Request<IdParams>, res: Response) => {
    const alert = await alertService.markAsSeen(req.params.id)

    return res.json({
      message: 'Alerta marcado como visto.',
      alert: toAlertResponse(alert)
    })
  }
)

export const markAllAsSeen = asyncHandler(
  async (req: Request, res: Response) => {
    await alertService.markAllAsSeen()

    return res.json({
      message: 'Todos os alertas marcados como vistos.'
    })
  }
)