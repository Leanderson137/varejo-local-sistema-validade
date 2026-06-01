import type { LucideIcon } from 'lucide-react'

export type MovementType = 'entrada' | 'venda' | 'descarte' | 'ajuste'

export type MovementTypeFilter = 'Todos' | MovementType

export type QuantityClass = 'positive' | 'negative' | 'loss'

export type LotHighlight = 'red' | 'orange' | null

export type CategoryFilter =
  | 'Todas'
  | 'Hortifruti'
  | 'Carnes'
  | 'Grãos'
  | 'Laticínios'
  | 'Padaria'
  | 'Bebidas'
  | 'Congelados'
  | 'Mercearia'
  | 'Limpeza'
  | 'Higiene'

export type MovementCategory = Exclude<CategoryFilter, 'Todas'>

export type SortOption = 'recentes' | 'antigos' | 'categoria'

export type DateFilterType = 'year' | 'month' | 'week' | 'day'

export interface Movement {
  id: string
  productId: string
  product: string
  barcode?: string
  category: MovementCategory
  date: string
  dateValue: string
  type: MovementType
  typeLabel: string
  qty: string
  quantity: number
  qtyClass: QuantityClass
  lot: string
  lotHighlight: LotHighlight
  observation?: string
  unitCost?: number
  lossValue?: number
}

export interface CreateMovementData {
  productId: string
  product: string
  barcode?: string
  category: MovementCategory
  type: MovementType
  quantity: number
  dateValue: string
  expiry: string
  observation?: string
  unitCost?: number
}

export interface MovementTypeOption {
  label: string
  value: MovementTypeFilter
}

export interface SortOptionItem {
  label: string
  value: SortOption
}

export interface CategoryLoss {
  name: string
  pct: number
  color: 'red' | 'orange' | 'purple'
}

export type MovementIconMap = Record<MovementType, LucideIcon>