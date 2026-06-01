import type {
  CreateProductData,
  Product,
  ProductFilterStatus,
  ProductStatus
} from '../types/product'

const STORAGE_KEY = 'varejo-local-products'

const getInitialProducts = (): Product[] => {
  return [
    {
      id: crypto.randomUUID(),
      name: 'Ovos Brancos (Dúzia)',
      category: 'Hortifruti',
      quantity: 0,
      expiry: '20/Dez/2023',
      status: 'sem-estoque',
      statusLabel: 'Sem estoque',
      filterStatus: 'Atenção'
    },
    {
      id: crypto.randomUUID(),
      name: 'Peito de Frango 1kg',
      category: 'Carnes',
      quantity: 15,
      expiry: '28/Nov/2023',
      status: 'estoque-baixo',
      statusLabel: 'Estoque Baixo',
      filterStatus: 'Atenção'
    },
    {
      id: crypto.randomUUID(),
      name: 'Arroz Integral 5kg',
      category: 'Grãos',
      quantity: 42,
      expiry: '15/Mar/2024',
      status: 'em-dia',
      statusLabel: 'Em dia',
      filterStatus: 'Em dia'
    },
    {
      id: crypto.randomUUID(),
      name: 'Leite Integral 1L',
      category: 'Laticínios',
      quantity: 128,
      expiry: '10/Dez/2023',
      status: 'vencido',
      statusLabel: 'Vencido',
      filterStatus: 'Vencidos'
    },
    {
      id: crypto.randomUUID(),
      name: 'Pão de Forma Integral',
      category: 'Padaria',
      quantity: 24,
      expiry: '05/Dez/2023',
      status: 'estoque-baixo',
      statusLabel: 'Estoque Baixo',
      filterStatus: 'Atenção'
    },
    {
      id: crypto.randomUUID(),
      name: 'Café Torrado 500g',
      category: 'Grãos',
      quantity: 56,
      expiry: '22/Jun/2024',
      status: 'em-dia',
      statusLabel: 'Em dia',
      filterStatus: 'Em dia'
    },
    {
      id: crypto.randomUUID(),
      name: 'Iogurte Natural 500g',
      category: 'Laticínios',
      quantity: 0,
      expiry: '12/Out/2023',
      status: 'vencido',
      statusLabel: 'Vencido',
      filterStatus: 'Vencidos'
    }
  ]
}

const getProductStatus = (
  quantity: number,
  minimumStock?: number
): {
  status: ProductStatus
  statusLabel: string
  filterStatus: ProductFilterStatus
} => {
  if (quantity <= 0) {
    return {
      status: 'sem-estoque',
      statusLabel: 'Sem estoque',
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

const getProducts = (): Product[] => {
  const storedProducts = readProductsFromStorage()

  if (storedProducts) {
    return storedProducts
  }

  const initialProducts = getInitialProducts()
  saveProductsToStorage(initialProducts)

  return initialProducts
}

const createProduct = (data: CreateProductData): Product => {
  const products = getProducts()
  const statusData = getProductStatus(data.quantity, data.minimumStock)

  const newProduct: Product = {
    id: crypto.randomUUID(),
    name: data.name,
    category: data.category,
    barcode: data.barcode,
    supplier: data.supplier,
    quantity: data.quantity,
    minimumStock: data.minimumStock,
    costPrice: data.costPrice,
    expiry: 'Sem validade cadastrada',
    status: statusData.status,
    statusLabel: statusData.statusLabel,
    filterStatus: statusData.filterStatus
  }

  const updatedProducts = [newProduct, ...products]
  saveProductsToStorage(updatedProducts)

  return newProduct
}

const updateProducts = (products: Product[]): void => {
  saveProductsToStorage(products)
}

export default {
  getProducts,
  createProduct,
  updateProducts
}