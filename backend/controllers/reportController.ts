import { Request, Response } from 'express'
import { LotStatus } from '../models/Lot'
import { MovementType } from '../models/Movement'
import reportService from '../services/reportService'
import asyncHandler from '../utils/asyncHandler'
import {
  ExpirationReportRequest,
  MovementReportRequest
} from '../dtos/requests/reportRequest'
import {
  toDashboardResponse,
  toExpirationReportResponse,
  toMovementReportResponse
} from '../mappers/reportMapper'

export const getDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    const dashboard = await reportService.getDashboard()

    return res.json(toDashboardResponse(dashboard))
  }
)

export const getExpirationReport = asyncHandler(
  async (req: Request, res: Response) => {
    const { startDate, endDate, productId, status } = req.query

    const filters: ExpirationReportRequest = {
      startDate: typeof startDate === 'string' ? startDate : undefined,
      endDate: typeof endDate === 'string' ? endDate : undefined,
      productId: typeof productId === 'string' ? productId : undefined,
      status: typeof status === 'string' ? (status as LotStatus) : undefined
    }

    const lots = await reportService.getExpirationReport(filters)

    return res.json(toExpirationReportResponse(lots))
  }
)

export const getMovementReport = asyncHandler(
  async (req: Request, res: Response) => {
    const { startDate, endDate, type } = req.query

    const filters: MovementReportRequest = {
      startDate: typeof startDate === 'string' ? startDate : undefined,
      endDate: typeof endDate === 'string' ? endDate : undefined,
      type: typeof type === 'string' ? (type as MovementType) : undefined
    }

    const movements = await reportService.getMovementReport(filters)

    return res.json(toMovementReportResponse(movements))
  }
)