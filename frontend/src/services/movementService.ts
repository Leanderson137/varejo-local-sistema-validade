import type {
  CategoryLoss,
  Movement,
  MovementTypeOption,
  SortOptionItem,
  CategoryFilter
} from '../types/movement'

const STORAGE_KEY = 'varejo-local-movements'

const initialMovements: Movement[] = [
  {
    id: crypto.randomUUID(),
    date: '15/Nov',
    dateValue: '2023-11-15',
    product: 'Leite Integral 1L',
    category: 'Laticínios',
    type: 'entrada',
    typeLabel: 'Entrada',
    qty: '+50',
    qtyClass: 'positive',
    lot: 'L-8821 / 20/Dez',
    lotHighlight: null
  },
  {
    id: crypto.randomUUID(),
    date: '14/Nov',
    dateValue: '2023-11-14',
    product: 'Pão de Forma',
    category: 'Padaria',
    type: 'venda',
    typeLabel: 'Venda',
    qty: '-15',
    qtyClass: 'negative',
    lot: 'L-1102 / 18/Nov',
    lotHighlight: null
  },
  {
    id: crypto.randomUUID(),
    date: '14/Nov',
    dateValue: '2023-11-14',
    product: 'Iogurte Grego',
    category: 'Laticínios',
    type: 'descarte',
    typeLabel: 'Descarte',
    qty: '-12',
    qtyClass: 'loss',
    lot: 'L-99 / Vencido',
    lotHighlight: 'red'
  },
  {
    id: crypto.randomUUID(),
    date: '13/Nov',
    dateValue: '2023-11-13',
    product: 'Ovos (Dúzia)',
    category: 'Hortifruti',
    type: 'ajuste',
    typeLabel: 'Ajuste',
    qty: '-2',
    qtyClass: 'negative',
    lot: 'L-4420 / 25/Nov',
    lotHighlight: null
  },
  {
    id: crypto.randomUUID(),
    date: '12/Nov',
    dateValue: '2023-11-12',
    product: 'Queijo Minas',
    category: 'Laticínios',
    type: 'descarte',
    typeLabel: 'Descarte',
    qty: '-8',
    qtyClass: 'loss',
    lot: 'L-33 / Vence Hoje',
    lotHighlight: 'orange'
  },
  {
    id: crypto.randomUUID(),
    date: '18/Out',
    dateValue: '2023-10-18',
    product: 'Peito de Frango 1kg',
    category: 'Carnes',
    type: 'entrada',
    typeLabel: 'Entrada',
    qty: '+30',
    qtyClass: 'positive',
    lot: 'L-7712 / 02/Nov',
    lotHighlight: null
  },
  {
    id: crypto.randomUUID(),
    date: '11/Out',
    dateValue: '2023-10-11',
    product: 'Iogurte Natural',
    category: 'Laticínios',
    type: 'descarte',
    typeLabel: 'Descarte',
    qty: '-10',
    qtyClass: 'loss',
    lot: 'L-221 / Vencido',
    lotHighlight: 'red'
  },
  {
    id: crypto.randomUUID(),
    date: '20/Set',
    dateValue: '2023-09-20',
    product: 'Pão Francês',
    category: 'Padaria',
    type: 'venda',
    typeLabel: 'Venda',
    qty: '-40',
    qtyClass: 'negative',
    lot: 'L-901 / 22/Set',
    lotHighlight: null
  }
]

const sortOptions: SortOptionItem[] = [
  { label: 'Mais recentes', value: 'recentes' },
  { label: 'Mais antigos', value: 'antigos' },
  { label: 'Categoria', value: 'categoria' }
]

const categoryFilters: CategoryFilter[] = [
  'Todas',
  'Laticínios',
  'Padaria',
  'Hortifruti',
  'Carnes'
]

const typeFilters: MovementTypeOption[] = [
  { label: 'Todos os tipos', value: 'Todos' },
  { label: 'Entrada', value: 'entrada' },
  { label: 'Venda', value: 'venda' },
  { label: 'Descarte', value: 'descarte' },
  { label: 'Ajuste', value: 'ajuste' }
]

const categoryLoss: CategoryLoss[] = [
  { name: 'Laticínios', pct: 65, color: 'red' },
  { name: 'Hortifruti', pct: 20, color: 'orange' },
  { name: 'Padaria', pct: 15, color: 'purple' }
]

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

const getMovements = (): Movement[] => {
  const storedMovements = readMovementsFromStorage()

  if (storedMovements) {
    return storedMovements
  }

  saveMovementsToStorage(initialMovements)

  return initialMovements
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
  return categoryLoss
}

export default {
  getMovements,
  getSortOptions,
  getCategoryFilters,
  getTypeFilters,
  getCategoryLoss
}