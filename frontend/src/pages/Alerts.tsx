import { useState } from 'react'
import {
  Search,
  Trash2,
  ShoppingCart,
  Tag,
  Milk,
  Cookie,
  Beef,
  Croissant
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Layout from '../components/Layout'
import alertService from '../services/alertService'
import type { AlertFilterOption, AlertIconName } from '../types/alert'
import './Alerts.css'

const alertIcons: Record<AlertIconName, LucideIcon> = {
  milk: Milk,
  cookie: Cookie,
  beef: Beef,
  croissant: Croissant
}

const Alerts = () => {
  const summaryCards = alertService.getSummaryCards()
  const filters = alertService.getFilters()
  const alertRows = alertService.getAlerts()

  const [activeFilter, setActiveFilter] = useState<AlertFilterOption>('Todos')
  const [search, setSearch] = useState<string>('')

  const filteredRows = alertRows.filter((row) => {
    const normalizedSearch = search.trim().toLowerCase()

    const matchesSearch =
      !normalizedSearch ||
      row.name.toLowerCase().includes(normalizedSearch) ||
      row.meta.toLowerCase().includes(normalizedSearch)

    const matchesFilter =
      activeFilter === 'Todos' ||
      (activeFilter === 'Vencidos' && row.status === 'vencido') ||
      (activeFilter === 'Vencendo' && row.status === 'vencendo') ||
      (activeFilter === 'Estoque Baixo' && row.status === 'estoque-baixo') ||
      (activeFilter === 'Sem Estoque' && row.status === 'sem-estoque')

    return matchesSearch && matchesFilter
  })

  return (
    <Layout>
      <header className="page-header">
        <h1>Central de Alertas</h1>
        <p>
          Acompanhe produtos vencidos, próximos do vencimento e com estoque baixo.
        </p>
      </header>

      <section className="row g-3 mb-4">
        {summaryCards.map((card) => {
          const Icon = card.icon

          return (
            <div key={card.id} className="col-12 col-sm-6 col-xl-3">
              <div className={`card border-0 shadow-sm h-100 summary-card ${card.variant}`}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <span className="small fw-semibold text-secondary">
                      {card.title}
                    </span>

                    <div className={`summary-icon ${card.variant}`}>
                      <Icon strokeWidth={2} />
                    </div>
                  </div>

                  <p className="summary-value mb-0">
                    {card.value}
                    <small>{card.unit}</small>
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </section>

      <section className="card border-0 shadow-sm alerts-panel">
        <div className="card-body p-0">
          <h2 className="h6 fw-bold mb-0 px-4 pt-4">Lista de Alertas</h2>

          <div className="d-flex flex-column flex-xl-row justify-content-between gap-3 px-4 py-3">
            <div className="alerts-search">
              <Search strokeWidth={2} />
              <input
                type="search"
                className="form-control"
                placeholder="Pesquisar produto..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="d-flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`btn btn-sm rounded-pill ${
                    activeFilter === filter ? 'btn-primary' : 'btn-outline-secondary'
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle mb-0 alerts-table">
              <thead>
                <tr>
                  <th>Produto &amp; Lote</th>
                  <th>Criticidade</th>
                  <th>Data (Venc./Ocorrência)</th>
                  <th>Ações Rápidas</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.map((row) => {
                  const ProductIcon = alertIcons[row.iconName]

                  return (
                    <tr key={row.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div className="product-thumb">
                            <ProductIcon strokeWidth={2} />
                          </div>

                          <div>
                            <strong className="d-block small text-heading">
                              {row.name}
                            </strong>
                            <span className="small text-secondary">{row.meta}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className={`status-badge ${row.status}`}>
                          <span className="dot" />
                          {row.statusLabel}
                        </span>
                      </td>

                      <td>
                        <strong className="d-block small">{row.dateMain}</strong>
                        <span className={`small fw-semibold date-${row.dateColor}`}>
                          {row.dateSub}
                        </span>
                      </td>

                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary action-btn"
                            aria-label="Descartar produto"
                            title="Descartar produto"
                          >
                            <Trash2 strokeWidth={2} />
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary action-btn"
                            aria-label="Repor estoque"
                            title="Repor estoque"
                          >
                            <ShoppingCart strokeWidth={2} />
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary action-btn"
                            aria-label="Ver detalhes do alerta"
                            title="Ver detalhes do alerta"
                          >
                            <Tag strokeWidth={2} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}

                {filteredRows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-secondary">
                      Nenhum alerta encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Alerts