import {
  AlertTriangle,
  Ban,
  Clock,
  Package
} from 'lucide-react'
import type {
  AlertFilterOption,
  AlertRow,
  AlertSummaryCard
} from '../types/alert'

const STORAGE_KEY = 'varejo-local-alerts'

const summaryCards: AlertSummaryCard[] = [
  {
    id: 'summary-expired',
    title: 'Crítico (Vencidos)',
    value: '12',
    unit: 'produtos',
    variant: 'red',
    icon: AlertTriangle
  },
  {
    id: 'summary-out-of-stock',
    title: 'Crítico (Sem Estoque)',
    value: '05',
    unit: 'esgotados',
    variant: 'red-dark',
    icon: Ban
  },
  {
    id: 'summary-expiring',
    title: 'Atenção (Vencendo)',
    value: '34',
    unit: 'em 7 dias',
    variant: 'yellow',
    icon: Clock
  },
  {
    id: 'summary-low-stock',
    title: 'Informativo (Estoque Baixo)',
    value: '08',
    unit: 'para repor',
    variant: 'orange',
    icon: Package
  }
]

const filters: AlertFilterOption[] = [
  'Todos',
  'Vencidos',
  'Vencendo',
  'Estoque Baixo',
  'Sem Estoque'
]

const initialAlerts: AlertRow[] = [
  {
    id: 'alert-yogurt-expired',
    name: 'Iogurte Natural 500g',
    meta: 'Lote: L-48291',
    iconName: 'milk',
    status: 'vencido',
    statusLabel: 'Vencido',
    dateMain: 'Há 2 dias',
    dateSub: 'Vencido em 12/10',
    dateColor: 'red'
  },
  {
    id: 'alert-cookie-out-stock',
    name: 'Biscoito Recheado Chocolate',
    meta: 'Estoque: 0 unid.',
    iconName: 'cookie',
    status: 'sem-estoque',
    statusLabel: 'Sem Estoque',
    dateMain: 'Esgotado',
    dateSub: 'Última saída: Ontem',
    dateColor: 'pink'
  },
  {
    id: 'alert-beef-low-stock',
    name: 'Carne Moída Especial 1kg',
    meta: 'Estoque: 12 unid.',
    iconName: 'beef',
    status: 'estoque-baixo',
    statusLabel: 'Estoque Baixo',
    dateMain: 'Hoje',
    dateSub: 'Abaixo do mínimo',
    dateColor: 'yellow'
  },
  {
    id: 'alert-bread-expiring',
    name: 'Pão de Forma Integral',
    meta: 'Lote: P-11029',
    iconName: 'croissant',
    status: 'vencendo',
    statusLabel: 'Vencendo',
    dateMain: 'Em 3 dias',
    dateSub: 'Vence em 15/10',
    dateColor: 'orange'
  }
]

const readAlertsFromStorage = (): AlertRow[] | null => {
  const storedAlerts = localStorage.getItem(STORAGE_KEY)

  if (!storedAlerts) {
    return null
  }

  try {
    return JSON.parse(storedAlerts) as AlertRow[]
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

const saveAlertsToStorage = (alerts: AlertRow[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts))
}

const getAlerts = (): AlertRow[] => {
  const storedAlerts = readAlertsFromStorage()

  if (storedAlerts) {
    return storedAlerts
  }

  saveAlertsToStorage(initialAlerts)

  return initialAlerts
}

const getSummaryCards = (): AlertSummaryCard[] => {
  return summaryCards
}

const getFilters = (): AlertFilterOption[] => {
  return filters
}

const resetAlerts = (): AlertRow[] => {
  localStorage.removeItem(STORAGE_KEY)
  saveAlertsToStorage(initialAlerts)

  return initialAlerts
}

export default {
  getAlerts,
  getSummaryCards,
  getFilters,
  resetAlerts
}