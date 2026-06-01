import type { LucideIcon } from 'lucide-react'

export type DashboardColorVariant =
  | 'blue'
  | 'yellow'
  | 'red'
  | 'red-dark'
  | 'green'
  | 'purple'

export type DashboardKpiBorder = 'border-red' | 'border-red-dark' | null

export interface DashboardKpiCard {
  id: string
  label: string
  value: string
  icon: LucideIcon
  iconClass: DashboardColorVariant
  badge: string
  badgeClass: DashboardColorVariant
  border: DashboardKpiBorder
}

export interface DashboardReportItem {
  id: string
  title: string
  description: string
  icon: LucideIcon
  iconClass: DashboardColorVariant
  to: string
}

export interface DashboardMovementItem {
  id: string
  tag: string
  tagClass: DashboardColorVariant
  dotClass: DashboardColorVariant
  time: string
  title: string
  detail: string
  user: string
  initials: string
}