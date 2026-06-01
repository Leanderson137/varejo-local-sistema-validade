import type { LucideIcon } from 'lucide-react'

export type ProductCategory =
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

export type ProductStatus =
  | 'sem-estoque'
  | 'estoque-baixo'
  | 'em-dia'
  | 'vencido'
  | 'vencendo'

export type ProductFilterStatus =
  | 'Em dia'
  | 'Atenção'
  | 'Vencidos'

export interface Product {
  id: string
  name: string
  category: ProductCategory
  categoryId?: string
  barcode?: string
  supplier?: string
  quantity: number
  minimumStock?: number
  costPrice?: string
  expiry: string
  lotId?: string
  lotNumber?: string
  status: ProductStatus
  statusLabel: string
  filterStatus: ProductFilterStatus
  icon?: LucideIcon
}

export interface CreateProductData {
  name: string
  category: ProductCategory
  categoryId?: string
  barcode?: string
  supplier?: string
  quantity: number
  minimumStock?: number
  costPrice?: string
  expiry: string
  lotNumber?: string
}

export interface ProductApiCategory {
  _id: string
  name: ProductCategory
}

export interface ProductApiCreatedBy {
  _id: string
  name: string
  email: string
}

export interface ProductApiResponse {
  _id: string
  name: string
  sku: string
  barcode?: string
  categoryId: ProductApiCategory | string | null
  unitCost: number
  minimumStock: number
  alertDaysBeforeExpiry: number
  createdBy?: ProductApiCreatedBy | string
  createdAt?: string
  updatedAt?: string
}

export interface LotApiProduct {
  _id: string
  name: string
  sku: string
  alertDaysBeforeExpiry?: number
}

export interface LotApiResponse {
  _id: string
  productId: LotApiProduct | string
  lotNumber: string
  expirationDate: string
  quantity: number
  status: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateProductApiData {
  name: string
  sku: string
  categoryId: string
  unitCost: number
  minimumStock: number
  alertDaysBeforeExpiry: number
}

export interface CreateLotApiData {
  productId: string
  lotNumber: string
  quantity: number
  expirationDate: string
}