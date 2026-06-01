import { useMemo, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Calendar,
  ArrowDownToLine,
  ArrowUpFromLine,
  AlertTriangle,
  ArrowUp,
  ArrowRight,
  ChevronDown,
  TrendingUp,
  Trash2,
  ArrowUpRight,
  AlertCircle,
  Lightbulb,
  BarChart3
} from 'lucide-react'
import Layout from '../components/Layout'
import movementService from '../services/movementService'
import type {
  DateFilterType,
  MovementType,
  MovementTypeFilter,
  SortOption,
  CategoryFilter,
  MovementIconMap
} from '../types/movement'
import './Movements.css'

const typeIcons: MovementIconMap = {
  entrada: ArrowDownToLine,
  venda: ArrowUpRight,
  descarte: Trash2,
  ajuste: AlertCircle
}

const getIsoWeekKey = (dateValue: string): string => {
  const date = new Date(`${dateValue}T00:00:00`)
  const currentDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  )

  const dayNumber = currentDate.getUTCDay() || 7
  currentDate.setUTCDate(currentDate.getUTCDate() + 4 - dayNumber)

  const yearStart = new Date(Date.UTC(currentDate.getUTCFullYear(), 0, 1))
  const weekNumber = Math.ceil(
    ((currentDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  )

  return `${currentDate.getUTCFullYear()}-W${String(weekNumber).padStart(2, '0')}`
}

const getCurrentDateValue = (filterType: DateFilterType): string => {
  if (filterType === 'year') {
    return '2023'
  }

  if (filterType === 'month') {
    return '2023-11'
  }

  if (filterType === 'week') {
    return getIsoWeekKey('2023-11-15')
  }

  return '2023-11-15'
}

const getDateInputType = (filterType: DateFilterType): string => {
  if (filterType === 'day') {
    return 'date'
  }

  if (filterType === 'week') {
    return 'week'
  }

  if (filterType === 'month') {
    return 'month'
  }

  return 'number'
}

const matchesDateFilter = (
  movementDate: string,
  filterType: DateFilterType,
  selectedDate: string
): boolean => {
  if (!selectedDate) {
    return true
  }

  if (filterType === 'year') {
    return movementDate.startsWith(selectedDate)
  }

  if (filterType === 'month') {
    return movementDate.startsWith(selectedDate)
  }

  if (filterType === 'week') {
    return getIsoWeekKey(movementDate) === selectedDate
  }

  return movementDate === selectedDate
}

const Movements = () => {
  const movements = movementService.getMovements()
  const sortOptions = movementService.getSortOptions()
  const categoryFilters = movementService.getCategoryFilters()
  const typeFilters = movementService.getTypeFilters()
  const categoryLoss = movementService.getCategoryLoss()

  const [dateFilterType, setDateFilterType] = useState<DateFilterType>('month')
  const [selectedDate, setSelectedDate] = useState<string>('2023-11')
  const [sortBy, setSortBy] = useState<SortOption>('recentes')
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('Todas')
  const [selectedType, setSelectedType] = useState<MovementTypeFilter>('Todos')

  const handleDateFilterTypeChange = (filterType: DateFilterType) => {
    setDateFilterType(filterType)
    setSelectedDate(getCurrentDateValue(filterType))
  }

  const filteredMovements = useMemo(() => {
    const result = movements.filter((movement) => {
      const matchDate = matchesDateFilter(
        movement.dateValue,
        dateFilterType,
        selectedDate
      )

      const matchCategory =
        selectedCategory === 'Todas' || movement.category === selectedCategory

      const matchType =
        selectedType === 'Todos' || movement.type === selectedType

      return matchDate && matchCategory && matchType
    })

    return [...result].sort((a, b) => {
      if (sortBy === 'recentes') {
        return new Date(b.dateValue).getTime() - new Date(a.dateValue).getTime()
      }

      if (sortBy === 'antigos') {
        return new Date(a.dateValue).getTime() - new Date(b.dateValue).getTime()
      }

      return a.category.localeCompare(b.category)
    })
  }, [movements, dateFilterType, selectedDate, selectedCategory, selectedType, sortBy])

  const totalEntries = filteredMovements
    .filter((movement) => movement.type === 'entrada')
    .reduce((total, movement) => total + Math.abs(Number(movement.qty)), 0)

  const totalExits = filteredMovements
    .filter((movement) => movement.type === 'venda')
    .reduce((total, movement) => total + Math.abs(Number(movement.qty)), 0)

  const totalLosses = filteredMovements
    .filter((movement) => movement.type === 'descarte')
    .reduce((total, movement) => total + Math.abs(Number(movement.qty)), 0)

  return (
    <Layout>
      <header className="page-header">
        <h1>Movimentação Mensal</h1>
        <p>Analise as entradas, saídas e possíveis perdas do seu estoque.</p>
      </header>

      <section className="card border-0 shadow-sm movements-date-card mb-4">
        <div className="card-body d-flex flex-column flex-lg-row align-items-lg-center gap-3">
          <div className="d-flex align-items-center gap-2 movements-date-title">
            <Calendar strokeWidth={2} />
            <span>Filtro de data</span>
          </div>

          <div className="movements-select-wrap">
            <select
              className="form-select"
              value={dateFilterType}
              onChange={(event) =>
                handleDateFilterTypeChange(event.target.value as DateFilterType)
              }
              aria-label="Tipo de filtro de data"
            >
              <option value="year">Ano</option>
              <option value="month">Mês</option>
              <option value="week">Semana</option>
              <option value="day">Dia</option>
            </select>
            <ChevronDown strokeWidth={2} />
          </div>

          <div className="movements-date-input">
            <input
              type={getDateInputType(dateFilterType)}
              className="form-control"
              value={selectedDate}
              min={dateFilterType === 'year' ? '2000' : undefined}
              max={dateFilterType === 'year' ? '2100' : undefined}
              onChange={(event) => setSelectedDate(event.target.value)}
              aria-label="Selecionar data"
            />
          </div>
        </div>
      </section>

      <section className="row g-3 mb-4">
        <div className="col-12 col-xl-4">
          <div className="card border-0 shadow-sm h-100 summary-metric">
            <div className="card-body">
              <div className="summary-metric-icon blue mb-3">
                <ArrowDownToLine strokeWidth={2} />
              </div>

              <p className="summary-metric-label">Total de Entradas</p>
              <p className="summary-metric-value">{totalEntries}</p>

              <span className="summary-metric-trend green">
                <TrendingUp strokeWidth={2} size={14} />
                Baseado nos filtros atuais
              </span>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="card border-0 shadow-sm h-100 summary-metric">
            <div className="card-body">
              <div className="summary-metric-icon gray mb-3">
                <ArrowUpFromLine strokeWidth={2} />
              </div>

              <p className="summary-metric-label">Total de Saídas</p>
              <p className="summary-metric-value">{totalExits}</p>

              <span className="summary-metric-trend gray">
                <ArrowRight strokeWidth={2} size={14} />
                Baseado nos filtros atuais
              </span>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="card shadow-sm h-100 summary-metric loss">
            <div className="card-body">
              <div className="summary-metric-icon red mb-3">
                <AlertTriangle strokeWidth={2} />
              </div>

              <p className="summary-metric-label">Perdas por Vencimento</p>
              <p className="summary-metric-value">{totalLosses}</p>
              <p className="summary-metric-sub">Prejuízo estimado conforme descartes</p>

              <span className="summary-metric-trend red">
                <ArrowUp strokeWidth={2} size={14} />
                Atenção aos itens descartados
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="row g-4 align-items-start">
        <div className="col-12 col-xl-8">
          <div className="card border-0 shadow-sm movements-table-panel">
            <div className="card-header bg-white d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 movements-table-header">
              <h2>Movimentações</h2>

              <div className="d-flex flex-wrap gap-2">
                <div className="movements-select-wrap movements-select">
                  <select
                    className="form-select form-select-sm"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as SortOption)}
                    aria-label="Ordenar movimentações"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown strokeWidth={2} />
                </div>

                <div className="movements-select-wrap movements-select">
                  <select
                    className="form-select form-select-sm"
                    value={selectedCategory}
                    onChange={(event) =>
                      setSelectedCategory(event.target.value as CategoryFilter)
                    }
                    aria-label="Filtrar categoria"
                  >
                    {categoryFilters.map((category) => (
                      <option key={category} value={category}>
                        {category === 'Todas' ? 'Categoria' : category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown strokeWidth={2} />
                </div>

                <div className="movements-select-wrap movements-select">
                  <select
                    className="form-select form-select-sm"
                    value={selectedType}
                    onChange={(event) =>
                      setSelectedType(event.target.value as MovementTypeFilter)
                    }
                    aria-label="Filtrar tipo de operação"
                  >
                    {typeFilters.map((filter) => (
                      <option key={filter.value} value={filter.value}>
                        {filter.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown strokeWidth={2} />
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table align-middle mb-0 movements-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Produto</th>
                    <th>Tipo</th>
                    <th>Qtd</th>
                    <th>Lote/Validade</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMovements.map((row) => {
                    const TypeIcon: LucideIcon = typeIcons[row.type as MovementType]
                    const [lotCode, lotInfo] = row.lot.split(' / ')

                    return (
                      <tr key={row.id}>
                        <td>{row.date}</td>

                        <td>
                          <span className="movement-product">{row.product}</span>
                          <span className="d-block small text-secondary">
                            {row.category}
                          </span>
                        </td>

                        <td>
                          <span className={`movement-type ${row.type}`}>
                            <TypeIcon strokeWidth={2} />
                            {row.typeLabel}
                          </span>
                        </td>

                        <td className={`movement-qty ${row.qtyClass}`}>
                          {row.qty}
                        </td>

                        <td className="movement-lot">
                          {row.lotHighlight ? (
                            <>
                              {lotCode} /{' '}
                              <strong className={row.lotHighlight}>
                                {lotInfo}
                              </strong>
                            </>
                          ) : (
                            row.lot
                          )}
                        </td>
                      </tr>
                    )
                  })}

                  {filteredMovements.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-secondary">
                        Nenhuma movimentação encontrada para o período selecionado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="col-12 col-xl-4">
          <div className="card border-0 shadow-sm analysis-panel">
            <div className="card-body">
              <h2>
                <BarChart3 strokeWidth={2} />
                Análise de Prejuízo
              </h2>

              <p className="analysis-section-label">Maior causa de perda</p>

              <div className="analysis-highlight">
                <h3>Laticínios</h3>
                <p>65% do total de descartes</p>
                <span className="value">R$ 812,50</span>
              </div>

              <p className="analysis-section-label">Descartes por categoria</p>

              <div className="d-flex flex-column gap-3 mb-4">
                {categoryLoss.map((category) => (
                  <div key={category.name}>
                    <div className="d-flex justify-content-between category-bar-label">
                      <span>{category.name}</span>
                      <span>{category.pct}%</span>
                    </div>

                    <div className="progress category-bar-track">
                      <div
                        className={`progress-bar category-bar-fill ${category.color}`}
                        style={{ width: `${category.pct}%` }}
                        role="progressbar"
                        aria-label={category.name}
                        aria-valuenow={category.pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="analysis-tip">
                <Lightbulb strokeWidth={2} />
                <p>
                  Revise os pedidos de Laticínios. Considere reduzir a quantidade nas
                  próximas 2 semanas para minimizar perdas.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </Layout>
  )
}

export default Movements