export interface CreateProductRequest {
  name: string
  sku: string
  barcode?: string
  categoryId: string
  unitCost: number
  minimumStock?: number
  alertDaysBeforeExpiry?: number
}

export interface UpdateProductRequest {
  name?: string
  sku?: string
  barcode?: string
  categoryId?: string
  unitCost?: number
  minimumStock?: number
  alertDaysBeforeExpiry?: number
}

export interface CreateProductServiceRequest extends CreateProductRequest {
  createdBy: string
}