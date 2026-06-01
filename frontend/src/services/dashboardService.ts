import {
  ClipboardList,
  Timer,
  AlertTriangle,
  Ban,
  ShoppingCart,
  Package,
  Bell,
  Calendar
} from 'lucide-react'
import movementService from './movementService'
import productService from './productService'
import type {
  DashboardKpiCard,
  DashboardMovementItem,
  DashboardReportItem
} from '../types/dashboard'
import type { Product } from '../types/product'
import type { Movement } from '../types/movement'

const reports: DashboardReportItem[] = [
  {
    id: 'stock-report',
    title: 'Gestão de Estoque',
    description: 'Controle de entrada, saída e ajustes de lotes.',
    icon: Package,
    iconClass: 'blue',
    to: '/estoque'
  },
  {
    id: 'alerts-report',
    title: 'Central de Alertas',
    description: 'Visualize itens vencidos e com estoque baixo.',
    icon: Bell,
    iconClass: 'yellow',
    to: '/alerts'
  },
  {
    id: 'movements-report',
    title: 'Movimentação Mensal',
    description: 'Resumo de entradas e saídas do período.',
    icon: Calendar,
    iconClass: 'green',
    to: '/movimentacoes'
  }
]

const countByStatus = (products: Product[], status: Product['status']): number => {
  return products.filter((product) => product.status === status).length
}

const getKpiCards = async (): Promise<DashboardKpiCard[]> => {
  const products = await productService.getProducts()

  return [
    {
      id: 'total-products',
      label: 'Total de Produtos',
      value: String(products.length),
      icon: ClipboardList,
      iconClass: 'blue',
      badge: 'Visão Geral',
      badgeClass: 'blue',
      border: null
    },
    {
      id: 'expiring-soon',
      label: 'Próximos ao Vencimento',
      value: String(countByStatus(products, 'vencendo')),
      icon: Timer,
      iconClass: 'yellow',
      badge: 'Atenção',
      badgeClass: 'yellow',
      border: null
    },
    {
      id: 'expired-products',
      label: 'Produtos Vencidos',
      value: String(countByStatus(products, 'vencido')),
      icon: AlertTriangle,
      iconClass: 'red',
      badge: 'Crítico',
      badgeClass: 'red',
      border: 'border-red'
    },
    {
      id: 'out-of-stock',
      label: 'Produtos Sem Estoque',
      value: String(countByStatus(products, 'sem-estoque')),
      icon: Ban,
      iconClass: 'red-dark',
      badge: 'Esgotado',
      badgeClass: 'red-dark',
      border: 'border-red-dark'
    },
    {
      id: 'low-stock',
      label: 'Estoque Baixo',
      value: String(countByStatus(products, 'estoque-baixo')),
      icon: ShoppingCart,
      iconClass: 'yellow',
      badge: 'Alerta',
      badgeClass: 'yellow',
      border: null
    }
  ]
}

const mapMovementToDashboardItem = (movement: Movement): DashboardMovementItem => {
  const tagClass =
    movement.type === 'entrada'
      ? 'green'
      : movement.type === 'descarte'
        ? 'red'
        : movement.type === 'ajuste'
          ? 'purple'
          : 'yellow'

  return {
    id: movement.id,
    tag: movement.typeLabel.toUpperCase(),
    tagClass,
    dotClass: tagClass,
    time: movement.date,
    title: `${movement.typeLabel} de ${movement.qty.replace('-', '').replace('+', '')} un de ${movement.product}`,
    detail: movement.observation || movement.lot,
    user: 'Sistema',
    initials: 'VL'
  }
}

const getReports = (): DashboardReportItem[] => {
  return reports
}

const getRecentMovements = async (): Promise<DashboardMovementItem[]> => {
  const movements = await movementService.getMovements()

  return movements
    .slice(0, 3)
    .map(mapMovementToDashboardItem)
}

export default {
  getKpiCards,
  getReports,
  getRecentMovements
}