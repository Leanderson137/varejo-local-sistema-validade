import { useEffect, useMemo, useState } from 'react'
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
  Movement,
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

const lossCategoryColors = [
  'red',
  'orange',
  'purple',
  'red',
  'orange',
  'purple',
  'red',
  'orange',
  'purple',
  'red'
] as const

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

const getTodayDateValue = (): string => {
  return new Date().toISOString().split('T')[0]
}

const getCurrentDateValue = (filterType: DateFilterType): string => {
  const today = getTodayDateValue()

  if (filterType === 'year') {
    return today.slice(0, 4)
  }

  if (filterType === 'month') {
    return today.slice(0, 7)
  }

  if (filterType === 'week') {
    return getIsoWeekKey(today)
  }

  return today
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

const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

const getMovementQuantity = (movement: Movement): number => {
  if (typeof movement.quantity === 'number') {
    return movement.quantity
  }

  const parsedQuantity = Number(
    movement.qty
      ?.replace('+', '')
      .replace('-', '')
      .trim()
  )

  return Number.isNaN(parsedQuantity) ? 0 : parsedQuantity
}

const getMovementLossValue = (movement: Movement): number => {
  if (typeof movement.lossValue === 'number') {
    return movement.lossValue
  }

  const quantity = getMovementQuantity(movement)
  const unitCost = typeof movement.unitCost === 'number' ? movement.unitCost : 0

  return quantity * unitCost
}

const Movements = () => {
  const sortOptions = movementService.getSortOptions()
  const categoryFilters = movementService.getCategoryFilters()
  const typeFilters = movementService.getTypeFilters()

  const [movements, setMovements] = useState<Movement[]>([])
  const [dateFilterType, setDateFilterType] = useState<DateFilterType>('month')
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDateValue('month'))
  const [sortBy, setSortBy] = useState<SortOption>('recentes')
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('Todas')
  const [selectedType, setSelectedType] = useState<MovementTypeFilter>('Todos')
  const [showAllLossCategories, setShowAllLossCategories] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const loadMovements = async () => {
      try {
        setLoading(true)
        const loadedMovements = await movementService.getMovements()
        setMovements(loadedMovements)
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar as movimentações.'

        setErrorMessage(message)
      } finally {
        setLoading(false)
      }
    }

    loadMovements()
  }, [])

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
    .reduce((total, movement) => total + getMovementQuantity(movement), 0)

  const totalExits = filteredMovements
    .filter((movement) => movement.type === 'venda')
    .reduce((total, movement) => total + getMovementQuantity(movement), 0)

  const totalLossQuantity = filteredMovements
    .filter((movement) => movement.type === 'descarte')
    .reduce((total, movement) => total + getMovementQuantity(movement), 0)

  const totalLossValue = filteredMovements
    .filter((movement) => movement.type === 'descarte')
    .reduce((total, movement) => total + getMovementLossValue(movement), 0)

  const categoryLoss = categoryFilters
    .filter((category): category is Exclude<CategoryFilter, 'Todas'> => category !== 'Todas')
    .map((category, index) => {
      const value = filteredMovements
        .filter((movement) => movement.type === 'descarte' && movement.category === category)
        .reduce((total, movement) => total + getMovementLossValue(movement), 0)

      const pct =
        totalLossValue > 0
          ? Math.round((value / totalLossValue) * 100)
          : 0

      return {
        name: category,
        value,
        pct,
        color: lossCategoryColors[index % lossCategoryColors.length]
      }
    })
    .sort((a, b) => b.value - a.value)

  const visibleCategoryLoss = showAllLossCategories
    ? categoryLoss
    : categoryLoss.slice(0, 3)

  const biggestLossCategory = categoryLoss[0]

  return (
    <Layout>
      <header className="page-header">
        <h1>Movimentação Mensal</h1>
        <p>Analise as entradas, saídas e possíveis perdas do seu estoque.</p>
      </header>

      {errorMessage && (
        <div className="alert alert-danger py-2 small" role="alert">
          {errorMessage}
        </div>
      )}

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
              <p className="summary-metric-value">{totalLossQuantity}</p>
              <p className="summary-metric-sub">
                Prejuízo estimado: {formatCurrency(totalLossValue)}
              </p>

              <span className="summary-metric-trend red">
                <ArrowUp strokeWidth={2} size={14} />
                Baseado nos descartes registrados
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
                  {loading && (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-secondary">
                        Carregando movimentações...
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    filteredMovements.map((row) => {
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

                  {!loading && filteredMovements.length === 0 && (
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
                {totalLossValue === 0 ? (
                  <>
                    <h3>Nenhum prejuízo registrado</h3>
                    <p>Os dados aparecerão aqui quando houver descartes.</p>
                    <span className="value">R$ 0,00</span>
                  </>
                ) : (
                  <>
                    <h3>{biggestLossCategory.name}</h3>
                    <p>{biggestLossCategory.pct}% do total de descartes</p>
                    <span className="value">{formatCurrency(biggestLossCategory.value)}</span>
                  </>
                )}
              </div>

              <div className="d-flex align-items-center justify-content-between gap-2">
                <p className="analysis-section-label mb-0">
                  Descartes por categoria
                </p>

                {categoryLoss.length > 3 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-link p-0 analysis-toggle"
                    onClick={() => setShowAllLossCategories((current) => !current)}
                  >
                    {showAllLossCategories ? 'Ver menos' : 'Ver todas'}
                  </button>
                )}
              </div>

              <div className="d-flex flex-column gap-3 mb-4 mt-3">
                {visibleCategoryLoss.map((category) => (
                  <div key={category.name}>
                    <div className="d-flex justify-content-between category-bar-label">
                      <span>{category.name}</span>
                      <span>
                        {category.pct}% · {formatCurrency(category.value)}
                      </span>
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
                  As recomendações aparecerão aqui quando houver histórico de perdas ou descartes.
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