import { Link, useNavigate } from 'react-router-dom'
import {
  FileText,
  ChevronRight,
  History
} from 'lucide-react'
import Layout from '../components/Layout'
import dashboardService from '../services/dashboardService'
import './Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()

  const kpiCards = dashboardService.getKpiCards()
  const reports = dashboardService.getReports()
  const recentMovements = dashboardService.getRecentMovements()

  return (
    <Layout>
      <header className="page-header">
        <h1>Visão Geral de Validade</h1>
        <p>Saúde do inventário em tempo real e alertas críticos</p>
      </header>

      <section className="row g-3 mb-4 row-cols-1 row-cols-sm-2 row-cols-xl-3 row-cols-xxl-5">
        {kpiCards.map((card) => {
          const Icon = card.icon

          return (
            <div key={card.id} className="col">
              <div className={`card h-100 shadow-sm kpi-card ${card.border ?? ''}`}>
                <div className="card-body">
                  <div className="d-flex align-items-start justify-content-between mb-3">
                    <div className={`kpi-icon ${card.iconClass}`}>
                      <Icon strokeWidth={2} />
                    </div>

                    <span className={`kpi-badge ${card.badgeClass}`}>
                      {card.badge}
                    </span>
                  </div>

                  <p className="kpi-label">{card.label}</p>
                  <p className="kpi-value">{card.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </section>

      <section className="row g-4 align-items-start">
        <div className="col-12 col-xl-8">
          <div className="card border-0 shadow-sm panel-card">
            <div className="card-header bg-white d-flex align-items-center justify-content-between panel-header">
              <h2>Relatórios e Exportações</h2>
              <FileText strokeWidth={2} />
            </div>

            <div className="list-group list-group-flush">
              {reports.map((item) => {
                const Icon = item.icon

                return (
                  <Link
                    key={item.id}
                    to={item.to}
                    className="list-group-item list-group-item-action report-item"
                  >
                    <div className={`report-icon ${item.iconClass}`}>
                      <Icon strokeWidth={2} />
                    </div>

                    <div className="report-text">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>

                    <span className="ms-auto report-chevron">
                      <ChevronRight strokeWidth={2} />
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="card border-0 shadow-sm panel-card h-100">
            <div className="card-header bg-white d-flex align-items-center justify-content-between panel-header">
              <h2>Movimentações Recentes</h2>
              <History strokeWidth={2} />
            </div>

            <div className="card-body timeline-body">
              <div className="timeline-list">
                {recentMovements.map((movement) => (
                  <div key={movement.id} className="timeline-item">
                    <span className={`timeline-dot ${movement.dotClass}`} />

                    <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                      <span className={`timeline-tag ${movement.tagClass}`}>
                        {movement.tag}
                      </span>
                      <span className="timeline-time">{movement.time}</span>
                    </div>

                    <p className="timeline-title">{movement.title}</p>
                    <p className="timeline-detail">{movement.detail}</p>

                    <div className="d-flex align-items-center gap-2 timeline-user">
                      <span className="timeline-avatar">{movement.initials}</span>
                      {movement.user}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-footer bg-white timeline-footer">
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={() => navigate('/movimentacoes')}
              >
                Ver Histórico Completo
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Dashboard