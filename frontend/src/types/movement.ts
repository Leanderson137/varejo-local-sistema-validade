import type { LucideIcon } from 'lucide-react'

export type MovementType = 'entrada' | 'venda' | 'descarte' | 'ajuste'

export type MovementTypeFilter = 'Todos' | MovementType

export type QuantityClass = 'positive' | 'negative' | 'loss'

export type LotHighlight = 'red' | 'orange' | null

export type CategoryFilter =
  | 'Todas'
  | 'Laticínios'
  | 'Padaria'
  | 'Hortifruti'
  | 'Carnes'

export type MovementCategory = Exclude<CategoryFilter, 'Todas'>

export type SortOption = 'recentes' | 'antigos' | 'categoria'

export type DateFilterType = 'year' | 'month' | 'week' | 'day'

export interface Movement {
  id: string
  date: string
  dateValue: string
  product: string
  category: MovementCategory
  type: MovementType
  typeLabel: string
  qty: string
  qtyClass: QuantityClass
  lot: string
  lotHighlight: LotHighlight
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