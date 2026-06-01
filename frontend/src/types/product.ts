import type { LucideIcon } from 'lucide-react'

export type ProductCategory =
  | 'Hortifruti'
  | 'Carnes'
  | 'Grãos'
  | 'Laticínios'
  | 'Padaria'
  | 'Bebidas'

export type ProductStatus =
  | 'sem-estoque'
  | 'estoque-baixo'
  | 'em-dia'
  | 'vencido'

export type ProductFilterStatus =
  | 'Em dia'
  | 'Atenção'
  | 'Vencidos'

export interface Product {
  id: string
  name: string
  category: ProductCategory
  barcode?: string
  supplier?: string
  quantity: number
  minimumStock?: number
  costPrice?: string
  expiry: string
  status: ProductStatus
  statusLabel: string
  filterStatus: ProductFilterStatus
  icon?: LucideIcon
}

export interface CreateProductData {
  name: string
  category: ProductCategory
  barcode?: string
  supplier?: string
  quantity: number
  minimumStock?: number
  costPrice?: string
}