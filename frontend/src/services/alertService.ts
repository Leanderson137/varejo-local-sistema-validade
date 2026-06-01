import {
  AlertTriangle,
  Ban,
  Clock,
  Package
} from 'lucide-react'
import productService from './productService'
import type { Product, ProductCategory } from '../types/product'
import type {
  AlertFilterOption,
  AlertIconName,
  AlertRow,
  AlertSummaryCard
} from '../types/alert'

const EXPIRING_SOON_DAYS = 7

const filters: AlertFilterOption[] = [
  'Todos',
  'Vencidos',
  'Vencendo',
  'Estoque Baixo',
  'Sem Estoque'
]

const getToday = (): Date => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return today
}

const getDaysUntilExpiry = (expiry: string): number | null => {
  if (!expiry) {
    return null
  }

  const expiryDate = new Date(`${expiry}T00:00:00`)

  if (Number.isNaN(expiryDate.getTime())) {
    return null
  }

  const differenceInMs = expiryDate.getTime() - getToday().getTime()

  return Math.ceil(differenceInMs / 86400000)
}

const formatExpiryDate = (expiry: string): string => {
  if (!expiry) {
    return 'Não informada'
  }

  const [year, month, day] = expiry.split('-')

  if (!year || !month || !day) {
    return expiry
  }

  return `${day}/${month}/${year}`
}

const getIconNameByCategory = (category: ProductCategory): AlertIconName => {
  if (category === 'Hortifruti') {
    return 'egg'
  }

  if (category === 'Carnes') {
    return 'beef'
  }

  if (category === 'Grãos') {
    return 'wheat'
  }

  if (category === 'Laticínios') {
    return 'milk'
  }

  if (category === 'Padaria') {
    return 'croissant'
  }

  if (category === 'Bebidas') {
    return 'coffee'
  }

  return 'package'
}

const buildAlertRowsFromProducts = (products: Product[]): AlertRow[] => {
  const alerts: AlertRow[] = []

  products.forEach((product) => {
    const daysUntilExpiry = getDaysUntilExpiry(product.expiry)
    const iconName = getIconNameByCategory(product.category)

    if (daysUntilExpiry !== null && daysUntilExpiry < 0) {
      alerts.push({
        id: `${product.id}-expired`,
        productId: product.id,
        name: product.name,
        meta: `Validade: ${formatExpiryDate(product.expiry)}`,
        iconName,
        status: 'vencido',
        statusLabel: 'Vencido',
        dateMain: 'Vencido',
        dateSub: `Venceu em ${formatExpiryDate(product.expiry)}`,
        dateColor: 'red'
      })
    }

    if (product.quantity <= 0) {
      alerts.push({
        id: `${product.id}-out-of-stock`,
        productId: product.id,
        name: product.name,
        meta: 'Estoque: 0 unid.',
        iconName,
        status: 'sem-estoque',
        statusLabel: 'Sem Estoque',
        dateMain: 'Esgotado',
        dateSub: 'Produto sem unidades disponíveis',
        dateColor: 'pink'
      })
    }

    if (
      daysUntilExpiry !== null &&
      daysUntilExpiry >= 0 &&
      daysUntilExpiry <= EXPIRING_SOON_DAYS
    ) {
      alerts.push({
        id: `${product.id}-expiring`,
        productId: product.id,
        name: product.name,
        meta: `Validade: ${formatExpiryDate(product.expiry)}`,
        iconName,
        status: 'vencendo',
        statusLabel: 'Vencendo',
        dateMain: daysUntilExpiry === 0 ? 'Hoje' : `Em ${daysUntilExpiry} dias`,
        dateSub: `Vence em ${formatExpiryDate(product.expiry)}`,
        dateColor: 'orange'
      })
    }

    if (
      product.minimumStock !== undefined &&
      product.quantity > 0 &&
      product.quantity <= product.minimumStock
    ) {
      alerts.push({
        id: `${product.id}-low-stock`,
        productId: product.id,
        name: product.name,
        meta: `Estoque: ${product.quantity} unid.`,
        iconName,
        status: 'estoque-baixo',
        statusLabel: 'Estoque Baixo',
        dateMain: 'Atenção',
        dateSub: `Mínimo definido: ${product.minimumStock}`,
        dateColor: 'yellow'
      })
    }
  })

  return alerts
}

const getAlerts = async (): Promise<AlertRow[]> => {
  const products = await productService.getProducts()

  return buildAlertRowsFromProducts(products)
}

const getSummaryCards = async (): Promise<AlertSummaryCard[]> => {
  const alerts = await getAlerts()

  const expiredCount = alerts.filter((alert) => alert.status === 'vencido').length
  const outOfStockCount = alerts.filter((alert) => alert.status === 'sem-estoque').length
  const expiringCount = alerts.filter((alert) => alert.status === 'vencendo').length
  const lowStockCount = alerts.filter((alert) => alert.status === 'estoque-baixo').length

  return [
    {
      id: 'summary-expired',
      title: 'Crítico (Vencidos)',
      value: String(expiredCount),
      unit: 'produtos',
      variant: 'red',
      icon: AlertTriangle
    },
    {
      id: 'summary-out-of-stock',
      title: 'Crítico (Sem Estoque)',
      value: String(outOfStockCount),
      unit: 'esgotados',
      variant: 'red-dark',
      icon: Ban
    },
    {
      id: 'summary-expiring',
      title: 'Atenção (Vencendo)',
      value: String(expiringCount),
      unit: 'em 7 dias',
      variant: 'yellow',
      icon: Clock
    },
    {
      id: 'summary-low-stock',
      title: 'Informativo (Estoque Baixo)',
      value: String(lowStockCount),
      unit: 'para repor',
      variant: 'orange',
      icon: Package
    }
  ]
}

const getFilters = (): AlertFilterOption[] => {
  return filters
}

export default {
  getAlerts,
  getSummaryCards,
  getFilters
}