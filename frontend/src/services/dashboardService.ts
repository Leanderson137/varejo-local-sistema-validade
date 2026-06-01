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
import type {
  DashboardKpiCard,
  DashboardMovementItem,
  DashboardReportItem
} from '../types/dashboard'

const kpiCards: DashboardKpiCard[] = [
  {
    id: 'total-products',
    label: 'Total de Produtos',
    value: '8.137',
    icon: ClipboardList,
    iconClass: 'blue',
    badge: 'Visão Geral',
    badgeClass: 'blue',
    border: null
  },
  {
    id: 'expiring-soon',
    label: 'Próximos ao Vencimento',
    value: '342',
    icon: Timer,
    iconClass: 'yellow',
    badge: '↑ 12%',
    badgeClass: 'yellow',
    border: null
  },
  {
    id: 'expired-products',
    label: 'Produtos Vencidos',
    value: '84',
    icon: AlertTriangle,
    iconClass: 'red',
    badge: 'Crítico',
    badgeClass: 'red',
    border: 'border-red'
  },
  {
    id: 'out-of-stock',
    label: 'Produtos Sem Estoque',
    value: '12',
    icon: Ban,
    iconClass: 'red-dark',
    badge: 'Esgotado',
    badgeClass: 'red-dark',
    border: 'border-red-dark'
  },
  {
    id: 'low-stock',
    label: 'Estoque Baixo',
    value: '18',
    icon: ShoppingCart,
    iconClass: 'yellow',
    badge: 'Alerta',
    badgeClass: 'yellow',
    border: null
  }
]

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
    description: 'Resumo de entradas e saídas do mês corrente.',
    icon: Calendar,
    iconClass: 'green',
    to: '/movimentacoes'
  }
]

const recentMovements: DashboardMovementItem[] = [
  {
    id: 'movement-discard-yogurt',
    tag: 'DESCARTE',
    tagClass: 'red',
    dotClass: 'red',
    time: '10:42 AM',
    title: 'Removidas 12 un de Iogurte Grego',
    detail: 'Motivo: Vencimento do lote L-48291',
    user: 'John Doe',
    initials: 'JD'
  },
  {
    id: 'movement-entry-milk',
    tag: 'ENTRADA',
    tagClass: 'green',
    dotClass: 'green',
    time: 'Ontem',
    title: 'Adicionadas 50 un de Leite Integral',
    detail: 'Fornecedor: Laticínios do Vale',
    user: 'Maria Silva',
    initials: 'MS'
  },
  {
    id: 'movement-adjust-bread',
    tag: 'AJUSTE',
    tagClass: 'purple',
    dotClass: 'purple',
    time: 'Ontem',
    title: 'Ajuste de inventário: Pão de Forma',
    detail: 'Diferença: -2 unidades',
    user: 'Carlos Souza',
    initials: 'CS'
  }
]

const getKpiCards = (): DashboardKpiCard[] => {
  return kpiCards
}

const getReports = (): DashboardReportItem[] => {
  return reports
}

const getRecentMovements = (): DashboardMovementItem[] => {
  return recentMovements
}

export default {
  getKpiCards,
  getReports,
  getRecentMovements
}