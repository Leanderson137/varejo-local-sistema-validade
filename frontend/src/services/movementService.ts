import api from './api'
import type {
  CategoryFilter,
  CategoryLoss,
  CreateMovementData,
  Movement,
  MovementType,
  MovementTypeOption,
  QuantityClass,
  SortOptionItem
} from '../types/movement'

const STORAGE_KEY = 'varejo-local-movements'
const USE_MOCK_MOVEMENTS = true

const initialMovements: Movement[] = []

const sortOptions: SortOptionItem[] = [
  { label: 'Mais recentes', value: 'recentes' },
  { label: 'Mais antigos', value: 'antigos' },
  { label: 'Categoria', value: 'categoria' }
]

const categoryFilters: CategoryFilter[] = [
  'Todas',
  'Hortifruti',
  'Carnes',
  'Grãos',
  'Laticínios',
  'Padaria',
  'Bebidas',
  'Congelados',
  'Mercearia',
  'Limpeza',
  'Higiene'
]

const typeFilters: MovementTypeOption[] = [
  { label: 'Todos os tipos', value: 'Todos' },
  { label: 'Entrada', value: 'entrada' },
  { label: 'Venda', value: 'venda' },
  { label: 'Descarte', value: 'descarte' },
  { label: 'Ajuste', value: 'ajuste' }
]

const movementLabels: Record<MovementType, string> = {
  entrada: 'Entrada',
  venda: 'Venda',
  descarte: 'Descarte',
  ajuste: 'Ajuste'
}

const monthNames = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez'
]

const formatMovementDate = (dateValue: string): string => {
  const [year, month, day] = dateValue.split('-')

  if (!year || !month || !day) {
    return dateValue
  }

  return `${day}/${monthNames[Number(month) - 1]}`
}

const formatExpiryDate = (expiry: string): string => {
  const [year, month, day] = expiry.split('-')

  if (!year || !month || !day) {
    return expiry || 'Sem validade'
  }

  return `${day}/${month}/${year}`
}

const getQuantityClass = (type: MovementType): QuantityClass => {
  if (type === 'entrada') {
    return 'positive'
  }

  if (type === 'descarte') {
    return 'loss'
  }

  return 'negative'
}

const getQuantityText = (type: MovementType, quantity: number): string => {
  if (type === 'entrada' || type === 'ajuste') {
    return `+${quantity}`
  }

  return `-${quantity}`
}

const readMovementsFromStorage = (): Movement[] | null => {
  const storedMovements = localStorage.getItem(STORAGE_KEY)

  if (!storedMovements) {
    return null
  }

  try {
    return JSON.parse(storedMovements) as Movement[]
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

const saveMovementsToStorage = (movements: Movement[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movements))
}

const getMovementsMock = (): Movement[] => {
  const storedMovements = readMovementsFromStorage()

  if (storedMovements) {
    return storedMovements
  }

  saveMovementsToStorage(initialMovements)

  return initialMovements
}

const createMovementMock = (data: CreateMovementData): Movement => {
  const movements = getMovementsMock()

  const lossValue =
    data.type === 'descarte'
      ? data.quantity * (data.unitCost ?? 0)
      : 0

  const newMovement: Movement = {
    id: crypto.randomUUID(),
    productId: data.productId,
    product: data.product,
    barcode: data.barcode,
    category: data.category,
    date: formatMovementDate(data.dateValue),
    dateValue: data.dateValue,
    type: data.type,
    typeLabel: movementLabels[data.type],
    qty: getQuantityText(data.type, data.quantity),
    quantity: data.quantity,
    qtyClass: getQuantityClass(data.type),
    lot: `Validade / ${formatExpiryDate(data.expiry)}`,
    lotHighlight: data.type === 'descarte' ? 'red' : null,
    observation: data.observation,
    unitCost: data.unitCost,
    lossValue
  }

  const updatedMovements = [newMovement, ...movements]
  saveMovementsToStorage(updatedMovements)

  return newMovement
}

const getMovementsFromApi = async (): Promise<Movement[]> => {
  return api.get<Movement[]>('/movements')
}

const createMovementFromApi = async (
  data: CreateMovementData
): Promise<Movement> => {
  return api.post<Movement, CreateMovementData>('/movements', data)
}

const getMovements = async (): Promise<Movement[]> => {
  if (USE_MOCK_MOVEMENTS) {
    return getMovementsMock()
  }

  return getMovementsFromApi()
}

const createMovement = async (
  data: CreateMovementData
): Promise<Movement> => {
  if (USE_MOCK_MOVEMENTS) {
    return createMovementMock(data)
  }

  return createMovementFromApi(data)
}

const getSortOptions = (): SortOptionItem[] => {
  return sortOptions
}

const getCategoryFilters = (): CategoryFilter[] => {
  return categoryFilters
}

const getTypeFilters = (): MovementTypeOption[] => {
  return typeFilters
}

const getCategoryLoss = (): CategoryLoss[] => {
  return [
    { name: 'Hortifruti', pct: 0, color: 'orange' },
    { name: 'Carnes', pct: 0, color: 'red' },
    { name: 'Grãos', pct: 0, color: 'purple' },
    { name: 'Laticínios', pct: 0, color: 'red' },
    { name: 'Padaria', pct: 0, color: 'purple' },
    { name: 'Bebidas', pct: 0, color: 'orange' },
    { name: 'Congelados', pct: 0, color: 'red' },
    { name: 'Mercearia', pct: 0, color: 'purple' },
    { name: 'Limpeza', pct: 0, color: 'orange' },
    { name: 'Higiene', pct: 0, color: 'red' }
  ]
}

export default {
  getMovements,
  createMovement,
  getSortOptions,
  getCategoryFilters,
  getTypeFilters,
  getCategoryLoss
}