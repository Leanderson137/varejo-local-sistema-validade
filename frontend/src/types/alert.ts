import type { LucideIcon } from 'lucide-react'

export type AlertSummaryVariant = 'red' | 'red-dark' | 'yellow' | 'orange'

export type AlertStatus =
  | 'vencido'
  | 'sem-estoque'
  | 'estoque-baixo'
  | 'vencendo'

export type AlertDateColor = 'red' | 'pink' | 'yellow' | 'orange'

export type AlertFilterOption =
  | 'Todos'
  | 'Vencidos'
  | 'Vencendo'
  | 'Estoque Baixo'
  | 'Sem Estoque'

export type AlertIconName =
  | 'egg'
  | 'beef'
  | 'wheat'
  | 'milk'
  | 'croissant'
  | 'coffee'
  | 'package'

export interface AlertSummaryCard {
  id: string
  title: string
  value: string
  unit: string
  variant: AlertSummaryVariant
  icon: LucideIcon
}

export interface AlertRow {
  id: string
  productId: string
  name: string
  meta: string
  iconName: AlertIconName
  status: AlertStatus
  statusLabel: string
  dateMain: string
  dateSub: string
  dateColor: AlertDateColor
}