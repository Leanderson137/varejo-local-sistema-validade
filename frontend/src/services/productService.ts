import api from './api'
import type {
  CreateProductData,
  Product,
  ProductFilterStatus,
  ProductStatus
} from '../types/product'

const STORAGE_KEY = 'varejo-local-products'
const USE_MOCK_PRODUCTS = true
const EXPIRING_SOON_DAYS = 7

const getInitialProducts = (): Product[] => {
  return []
}

const getToday = (): Date => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return today
}

const getExpiryDate = (expiry: string): Date | null => {
  if (!expiry) {
    return null
  }

  const expiryDate = new Date(`${expiry}T00:00:00`)

  if (Number.isNaN(expiryDate.getTime())) {
    return null
  }

  return expiryDate
}

const getDaysUntilExpiry = (expiry: string): number | null => {
  const expiryDate = getExpiryDate(expiry)

  if (!expiryDate) {
    return null
  }

  const differenceInMs = expiryDate.getTime() - getToday().getTime()

  return Math.ceil(differenceInMs / 86400000)
}

const isExpired = (expiry: string): boolean => {
  const daysUntilExpiry = getDaysUntilExpiry(expiry)

  return daysUntilExpiry !== null && daysUntilExpiry < 0
}

const isExpiringSoon = (expiry: string): boolean => {
  const daysUntilExpiry = getDaysUntilExpiry(expiry)

  return (
    daysUntilExpiry !== null &&
    daysUntilExpiry >= 0 &&
    daysUntilExpiry <= EXPIRING_SOON_DAYS
  )
}

const getProductStatus = (
  quantity: number,
  expiry: string,
  minimumStock?: number
): {
  status: ProductStatus
  statusLabel: string
  filterStatus: ProductFilterStatus
} => {
  if (isExpired(expiry)) {
    return {
      status: 'vencido',
      statusLabel: 'Vencido',
      filterStatus: 'Vencidos'
    }
  }

  if (quantity <= 0) {
    return {
      status: 'sem-estoque',
      statusLabel: 'Sem estoque',
      filterStatus: 'Atenção'
    }
  }

  if (isExpiringSoon(expiry)) {
    return {
      status: 'vencendo',
      statusLabel: 'Vencendo',
      filterStatus: 'Atenção'
    }
  }

  if (minimumStock !== undefined && quantity <= minimumStock) {
    return {
      status: 'estoque-baixo',
      statusLabel: 'Estoque Baixo',
      filterStatus: 'Atenção'
    }
  }

  return {
    status: 'em-dia',
    statusLabel: 'Em dia',
    filterStatus: 'Em dia'
  }
}

const applyProductStatus = (product: Product): Product => {
  const statusData = getProductStatus(
    product.quantity,
    product.expiry,
    product.minimumStock
  )

  return {
    ...product,
    status: statusData.status,
    statusLabel: statusData.statusLabel,
    filterStatus: statusData.filterStatus
  }
}

const normalizeProductsStatus = (products: Product[]): Product[] => {
  return products.map(applyProductStatus)
}

const readProductsFromStorage = (): Product[] | null => {
  const storedProducts = localStorage.getItem(STORAGE_KEY)

  if (!storedProducts) {
    return null
  }

  try {
    return JSON.parse(storedProducts) as Product[]
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

const saveProductsToStorage = (products: Product[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

const getProductsMock = (): Product[] => {
  const storedProducts = readProductsFromStorage()

  if (storedProducts) {
    const normalizedProducts = normalizeProductsStatus(storedProducts)
    saveProductsToStorage(normalizedProducts)

    return normalizedProducts
  }

  const initialProducts = getInitialProducts()
  saveProductsToStorage(initialProducts)

  return initialProducts
}

const createProductMock = (data: CreateProductData): Product => {
  const products = getProductsMock()

  const newProduct = applyProductStatus({
    id: crypto.randomUUID(),
    name: data.name,
    category: data.category,
    barcode: data.barcode,
    supplier: data.supplier,
    quantity: data.quantity,
    minimumStock: data.minimumStock,
    costPrice: data.costPrice,
    expiry: data.expiry,
    status: 'em-dia',
    statusLabel: 'Em dia',
    filterStatus: 'Em dia'
  })

  const updatedProducts = [newProduct, ...products]
  saveProductsToStorage(updatedProducts)

  return newProduct
}

const updateProductMock = (
  productId: string,
  data: CreateProductData
): Product => {
  const products = getProductsMock()

  const product = products.find((currentProduct) => currentProduct.id === productId)

  if (!product) {
    throw new Error('Produto não encontrado.')
  }

  const updatedProduct = applyProductStatus({
    ...product,
    name: data.name,
    category: data.category,
    barcode: data.barcode,
    supplier: data.supplier,
    quantity: data.quantity,
    minimumStock: data.minimumStock,
    costPrice: data.costPrice,
    expiry: data.expiry
  })

  const updatedProducts = products.map((currentProduct) =>
    currentProduct.id === productId ? updatedProduct : currentProduct
  )

  saveProductsToStorage(updatedProducts)

  return updatedProduct
}

const deleteProductMock = (productId: string): void => {
  const products = getProductsMock()
  const updatedProducts = products.filter((product) => product.id !== productId)

  saveProductsToStorage(updatedProducts)
}

const findProductByBarcodeMock = (barcode: string): Product | null => {
  const products = getProductsMock()

  return products.find((product) => product.barcode === barcode) ?? null
}

const updateProductQuantityMock = (
  productId: string,
  quantityChange: number
): Product => {
  const products = getProductsMock()

  const product = products.find((currentProduct) => currentProduct.id === productId)

  if (!product) {
    throw new Error('Produto não encontrado.')
  }

  const newQuantity = product.quantity + quantityChange

  if (newQuantity < 0) {
    throw new Error('Quantidade insuficiente em estoque.')
  }

  const updatedProduct = applyProductStatus({
    ...product,
    quantity: newQuantity
  })

  const updatedProducts = products.map((currentProduct) =>
    currentProduct.id === productId ? updatedProduct : currentProduct
  )

  saveProductsToStorage(updatedProducts)

  return updatedProduct
}

const getProductsFromApi = async (): Promise<Product[]> => {
  return api.get<Product[]>('/products')
}

const createProductFromApi = async (
  data: CreateProductData
): Promise<Product> => {
  return api.post<Product, CreateProductData>('/products', data)
}

const updateProductFromApi = async (
  productId: string,
  data: CreateProductData
): Promise<Product> => {
  return api.put<Product, CreateProductData>(`/products/${productId}`, data)
}

const deleteProductFromApi = async (productId: string): Promise<void> => {
  return api.delete<void>(`/products/${productId}`)
}

const findProductByBarcodeFromApi = async (
  barcode: string
): Promise<Product | null> => {
  return api.get<Product | null>(`/products/barcode/${barcode}`)
}

const updateProductQuantityFromApi = async (
  productId: string,
  quantityChange: number
): Promise<Product> => {
  return api.patch<Product, { quantityChange: number }>(
    `/products/${productId}/quantity`,
    { quantityChange }
  )
}

const getProducts = async (): Promise<Product[]> => {
  if (USE_MOCK_PRODUCTS) {
    return getProductsMock()
  }

  return getProductsFromApi()
}

const createProduct = async (
  data: CreateProductData
): Promise<Product> => {
  if (USE_MOCK_PRODUCTS) {
    return createProductMock(data)
  }

  return createProductFromApi(data)
}

const updateProduct = async (
  productId: string,
  data: CreateProductData
): Promise<Product> => {
  if (USE_MOCK_PRODUCTS) {
    return updateProductMock(productId, data)
  }

  return updateProductFromApi(productId, data)
}

const deleteProduct = async (productId: string): Promise<void> => {
  if (USE_MOCK_PRODUCTS) {
    deleteProductMock(productId)
    return
  }

  return deleteProductFromApi(productId)
}

const findProductByBarcode = async (
  barcode: string
): Promise<Product | null> => {
  if (USE_MOCK_PRODUCTS) {
    return findProductByBarcodeMock(barcode)
  }

  return findProductByBarcodeFromApi(barcode)
}

const updateProductQuantity = async (
  productId: string,
  quantityChange: number
): Promise<Product> => {
  if (USE_MOCK_PRODUCTS) {
    return updateProductQuantityMock(productId, quantityChange)
  }

  return updateProductQuantityFromApi(productId, quantityChange)
}

const updateProducts = (products: Product[]): void => {
  saveProductsToStorage(products)
}

export default {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  findProductByBarcode,
  updateProductQuantity,
  updateProducts
}