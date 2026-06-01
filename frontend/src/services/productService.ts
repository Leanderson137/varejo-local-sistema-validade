import api from './api'
import type {
  CreateLotApiData,
  CreateProductApiData,
  CreateProductData,
  LotApiResponse,
  Product,
  ProductApiCategory,
  ProductApiResponse,
  ProductCategory,
  ProductFilterStatus,
  ProductStatus
} from '../types/product'

const STORAGE_KEY = 'varejo-local-products'
const USE_MOCK_PRODUCTS = false
const EXPIRING_SOON_DAYS = 7
const DEFAULT_ALERT_DAYS_BEFORE_EXPIRY = 15

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

const parseCostPriceToNumber = (costPrice?: string): number => {
  if (!costPrice) {
    return 0
  }

  const normalizedValue = costPrice
    .replace('R$', '')
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(',', '.')

  const parsedValue = Number(normalizedValue)

  return Number.isNaN(parsedValue) ? 0 : parsedValue
}

const formatCostPrice = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const formatApiDateToInputDate = (dateValue?: string): string => {
  if (!dateValue) {
    return ''
  }

  return dateValue.split('T')[0]
}

const getProductIdFromLot = (lot: LotApiResponse): string => {
  if (typeof lot.productId === 'string') {
    return lot.productId
  }

  return lot.productId._id
}

const getProductCategory = (product: ProductApiResponse): {
  category: ProductCategory
  categoryId?: string
} => {
  if (product.categoryId && typeof product.categoryId === 'object') {
    const category = product.categoryId as ProductApiCategory

    return {
      category: category.name,
      categoryId: category._id
    }
  }

  return {
    category: 'Mercearia',
    categoryId:
      typeof product.categoryId === 'string' && product.categoryId !== 'null'
        ? product.categoryId
        : undefined
  }
}

const mapProductFromApi = (
  product: ProductApiResponse,
  lot?: LotApiResponse
): Product => {
  const categoryData = getProductCategory(product)
  const quantity = lot?.quantity ?? 0
  const expiry = formatApiDateToInputDate(lot?.expirationDate)

  const mappedProduct: Product = {
    id: product._id,
    name: product.name,
    category: categoryData.category,
    categoryId: categoryData.categoryId,
    barcode: product.sku,
    quantity,
    minimumStock: product.minimumStock ?? 0,
    costPrice: formatCostPrice(product.unitCost),
    expiry,
    lotId: lot?._id,
    lotNumber: lot?.lotNumber,
    status: 'em-dia',
    statusLabel: 'Em dia',
    filterStatus: 'Em dia'
  }

  return applyProductStatus(mappedProduct)
}

const createProductMock = (data: CreateProductData): Product => {
  const products = getProductsMock()

  const newProduct = applyProductStatus({
    id: crypto.randomUUID(),
    name: data.name,
    category: data.category,
    categoryId: data.categoryId,
    barcode: data.barcode,
    supplier: data.supplier,
    quantity: data.quantity,
    minimumStock: data.minimumStock,
    costPrice: data.costPrice,
    expiry: data.expiry,
    lotNumber: data.lotNumber,
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
    categoryId: data.categoryId,
    barcode: data.barcode,
    supplier: data.supplier,
    quantity: data.quantity,
    minimumStock: data.minimumStock,
    costPrice: data.costPrice,
    expiry: data.expiry,
    lotNumber: data.lotNumber
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
  const [products, lots] = await Promise.all([
    api.get<ProductApiResponse[]>('/products'),
    api.get<LotApiResponse[]>('/lots')
  ])

  return products.map((product) => {
    const lot = lots.find((currentLot) => {
      const lotProductId = getProductIdFromLot(currentLot)

      return lotProductId === product._id
    })

    return mapProductFromApi(product, lot)
  })
}

const createProductFromApi = async (
  data: CreateProductData
): Promise<Product> => {
  if (!data.categoryId) {
    throw new Error('Categoria inválida. Selecione uma categoria cadastrada.')
  }

  const productPayload: CreateProductApiData = {
    name: data.name,
    sku: data.barcode ?? '',
    categoryId: data.categoryId,
    unitCost: parseCostPriceToNumber(data.costPrice),
    minimumStock: data.minimumStock ?? 0,
    alertDaysBeforeExpiry: DEFAULT_ALERT_DAYS_BEFORE_EXPIRY
  }

  const createdProduct = await api.post<ProductApiResponse, CreateProductApiData>(
    '/products',
    productPayload
  )

  const lotPayload: CreateLotApiData = {
    productId: createdProduct._id,
    lotNumber: data.lotNumber || `LOTE-${Date.now()}`,
    quantity: data.quantity,
    expirationDate: data.expiry
  }

  const createdLot = await api.post<LotApiResponse, CreateLotApiData>(
    '/lots',
    lotPayload
  )

  return mapProductFromApi(createdProduct, createdLot)
}

const updateProductFromApi = async (
  productId: string,
  data: CreateProductData
): Promise<Product> => {
  if (!data.categoryId) {
    throw new Error('Categoria inválida. Selecione uma categoria cadastrada.')
  }

  const productPayload: CreateProductApiData = {
    name: data.name,
    sku: data.barcode ?? '',
    categoryId: data.categoryId,
    unitCost: parseCostPriceToNumber(data.costPrice),
    minimumStock: data.minimumStock ?? 0,
    alertDaysBeforeExpiry: DEFAULT_ALERT_DAYS_BEFORE_EXPIRY
  }

  const updatedProduct = await api.put<ProductApiResponse, CreateProductApiData>(
    `/products/${productId}`,
    productPayload
  )

  const lotPayload: CreateLotApiData = {
    productId,
    lotNumber: data.lotNumber || `LOTE-${productId}`,
    quantity: data.quantity,
    expirationDate: data.expiry
  }

  const products = await getProductsFromApi()
  const product = products.find((currentProduct) => currentProduct.id === productId)

  if (product?.lotId) {
    const updatedLot = await api.put<LotApiResponse, CreateLotApiData>(
      `/lots/${product.lotId}`,
      lotPayload
    )

    return mapProductFromApi(updatedProduct, updatedLot)
  }

  const createdLot = await api.post<LotApiResponse, CreateLotApiData>(
    '/lots',
    lotPayload
  )

  return mapProductFromApi(updatedProduct, createdLot)
}

const deleteProductFromApi = async (productId: string): Promise<void> => {
  return api.delete<void>(`/products/${productId}`)
}

const findProductByBarcodeFromApi = async (
  barcode: string
): Promise<Product | null> => {
  const products = await getProductsFromApi()

  return products.find((product) => product.barcode === barcode) ?? null
}

const updateProductQuantityFromApi = async (
  productId: string,
  quantityChange: number
): Promise<Product> => {
  const products = await getProductsFromApi()
  const product = products.find((currentProduct) => currentProduct.id === productId)

  if (!product) {
    throw new Error('Produto não encontrado.')
  }

  if (!product.lotId) {
    throw new Error('Produto sem lote cadastrado.')
  }

  const newQuantity = product.quantity + quantityChange

  if (newQuantity < 0) {
    throw new Error('Quantidade insuficiente em estoque.')
  }

  await api.put<LotApiResponse, CreateLotApiData>(
    `/lots/${product.lotId}`,
    {
      productId: product.id,
      lotNumber: product.lotNumber || `LOTE-${product.id}`,
      quantity: newQuantity,
      expirationDate: product.expiry
    }
  )

  const updatedProducts = await getProductsFromApi()
  const updatedProduct = updatedProducts.find(
    (currentProduct) => currentProduct.id === productId
  )

  if (!updatedProduct) {
    throw new Error('Produto não encontrado após atualização.')
  }

  return updatedProduct
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

  return updateProductFromApi(data ? productId : productId, data)
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