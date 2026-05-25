export interface ProductCategoryResponse {
  _id: string
  name: string
}

export interface ProductCreatedByResponse {
  _id: string
  name: string
  email: string
}

export interface ProductResponse {
  _id: string
  name: string
  sku: string
  barcode?: string
  categoryId: string | ProductCategoryResponse
  unitCost: number
  alertDaysBeforeExpiry: number
  createdBy: string | ProductCreatedByResponse
  createdAt: Date
  updatedAt: Date
}