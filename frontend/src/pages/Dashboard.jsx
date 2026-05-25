import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Timer,
  AlertTriangle,
  Ban,
  ShoppingCart,
  FileText,
  Package,
  Bell,
  Calendar,
  ChevronRight,
  History,
} from 'lucide-react';
import Layout from '../components/Layout';
import './Dashboard.css';

const kpiCards = [
  {
    label: 'Total de Produtos',
    value: '8.137',
    icon: ClipboardList,
    iconClass: 'blue',
    badge: 'Visão Geral',
    badgeClass: 'blue',
    border: null,
  },
  {
    label: 'Próximos ao Vencimento',
    value: '342',
    icon: Timer,
    iconClass: 'yellow',
    badge: '↑ 12%',
    badgeClass: 'yellow',
    border: null,
  },
  {
    label: 'Produtos Vencidos',
    value: '84',
    icon: AlertTriangle,
    iconClass: 'red',
    badge: 'Crítico',
    badgeClass: 'red',
    border: 'border-red',
  },
  {
    label: 'Produtos Sem Estoque',
    value: '12',
    icon: Ban,
    iconClass: 'red-dark',
    badge: 'Esgotado',
    badgeClass: 'red-dark',
    border: 'border-red-dark',
  },
  {
    label: 'Estoque Baixo',
    value: '18',
    icon: ShoppingCart,
    iconClass: 'yellow',
    badge: 'Alerta',
    badgeClass: 'yellow',
    border: null,
  },
];

const reports = [
  {
    title: 'Gestão de Estoque',
    description: 'Controle de entrada, saída e ajustes de lotes.',
    icon: Package,
    iconClass: 'blue',
    to: '/estoque',
  },
  {
    title: 'Central de Alertas',
    description: 'Visualize itens vencidos e com estoque baixo.',
    icon: Bell,
    iconClass: 'yellow',
    to: '/alerts',
  },
  {
    title: 'Movimentação Mensal',
    description: 'Resumo de entradas e saídas do mês corrente.',
    icon: Calendar,
    iconClass: 'green',
    to: '/movimentacoes',
  },
];

const movements = [
  {
    tag: 'DESCARTE',
    tagClass: 'red',
    dotClass: 'red',
    time: '10:42 AM',
    title: 'Removidas 12 un de Iogurte Grego',
    detail: 'Motivo: Vencimento do lote L-48291',
    user: 'John Doe',
    initials: 'JD',
  },
  {
    tag: 'ENTRADA',
    tagClass: 'green',
    dotClass: 'green',
    time: 'Ontem',
    title: 'Adicionadas 50 un de Leite Integral',
    detail: 'Fornecedor: Laticínios do Vale',
    user: 'Maria Silva',
    initials: 'MS',
  },
  {
    tag: 'AJUSTE',
    tagClass: 'purple',
    dotClass: 'purple',
    time: 'Ontem',
    title: 'Ajuste de inventário: Pão de Forma',
    detail: 'Diferença: -2 unidades',
    user: 'Carlos Souza',
    initials: 'CS',
  },
];

const Dashboard = () => (
  <Layout>
    <header className="page-header">
      <h1>Visão Geral de Validade</h1>
      <p>Saúde do inventário em tempo real e alertas críticos</p>
    </header>

    <div className="kpi-grid">
      {kpiCards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className={`kpi-card${card.border ? ` ${card.border}` : ''}`}>
            <div className="kpi-card-top">
              <div className={`kpi-icon ${card.iconClass}`}>
                <Icon strokeWidth={2} />
              </div>
              <span className={`kpi-badge ${card.badgeClass}`}>{card.badge}</span>
            </div>
            <p className="kpi-label">{card.label}</p>
            <p className="kpi-value">{card.value}</p>
          </div>
        );
      })}
    </div>

    <div className="dashboard-bottom">
      <div className="panel-card">
        <div className="panel-header">
          <h2>Relatórios e Exportações</h2>
          <FileText strokeWidth={2} />
        </div>
        <div className="report-list">
          {reports.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} to={item.to} className="report-item">
                <div className={`report-icon ${item.iconClass}`}>
                  <Icon strokeWidth={2} />
                </div>
                <div className="report-text">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <span className="report-chevron">
                  <ChevronRight strokeWidth={2} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="panel-card timeline-panel">
        <div className="panel-header">
          <h2>Movimentações Recentes</h2>
          <History strokeWidth={2} />
        </div>
        <div className="timeline-body">
          <div className="timeline-list">
            {movements.map((m) => (
              <div key={m.title} className="timeline-item">
                <span className={`timeline-dot ${m.dotClass}`} />
                <div className="timeline-meta">
                  <span className={`timeline-tag ${m.tagClass}`}>{m.tag}</span>
                  <span className="timeline-time">{m.time}</span>
                </div>
                <p className="timeline-title">{m.title}</p>
                <p className="timeline-detail">{m.detail}</p>
                <div className="timeline-user">
                  <span className="timeline-avatar">{m.initials}</span>
                  {m.user}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="timeline-footer">
          <button type="button">Ver Histórico Completo</button>
        </div>
      </div>
    </div>
  </Layout>
);

export default Dashboard;
