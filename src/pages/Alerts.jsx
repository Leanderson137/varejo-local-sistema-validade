import { useState } from 'react';
import {
  AlertTriangle,
  Ban,
  Clock,
  Package,
  Search,
  Milk,
  Cookie,
  Beef,
  Croissant,
  Trash2,
  ShoppingCart,
  Tag,
} from 'lucide-react';
import Layout from '../components/Layout';
import './Alerts.css';

const summaryCards = [
  { title: 'Crítico (Vencidos)', value: '12', unit: 'produtos', variant: 'red', icon: AlertTriangle },
  { title: 'Crítico (Sem Estoque)', value: '05', unit: 'esgotados', variant: 'red-dark', icon: Ban },
  { title: 'Atenção (Vencendo)', value: '34', unit: 'em 7 dias', variant: 'yellow', icon: Clock },
  { title: 'Informativo (Estoque Baixo)', value: '08', unit: 'para repor', variant: 'orange', icon: Package },
];

const filters = ['Todos', 'Vencidos', 'Vencendo', 'Estoque Baixo', 'Sem Estoque'];

const alertRows = [
  {
    name: 'Iogurte Natural 500g',
    meta: 'Lote: L-48291',
    icon: Milk,
    status: 'vencido',
    statusLabel: 'Vencido',
    dateMain: 'Há 2 dias',
    dateSub: 'Vencido em 12/10',
    dateColor: 'red',
  },
  {
    name: 'Biscoito Recheado Chocolate',
    meta: 'Estoque: 0 unid.',
    icon: Cookie,
    status: 'sem-estoque',
    statusLabel: 'Sem Estoque',
    dateMain: 'Esgotado',
    dateSub: 'Última saída: Ontem',
    dateColor: 'pink',
  },
  {
    name: 'Carne Moída Especial 1kg',
    meta: 'Estoque: 12 unid.',
    icon: Beef,
    status: 'estoque-baixo',
    statusLabel: 'Estoque Baixo',
    dateMain: 'Hoje',
    dateSub: 'Abaixo do mínimo',
    dateColor: 'yellow',
  },
  {
    name: 'Pão de Forma Integral',
    meta: 'Lote: P-11029',
    icon: Croissant,
    status: 'vencendo',
    statusLabel: 'Vencendo',
    dateMain: 'Em 3 dias',
    dateSub: 'Vence em 15/10',
    dateColor: 'orange',
  },
];

const Alerts = () => {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [search, setSearch] = useState('');

  const filteredRows = alertRows.filter((row) => {
    const matchesSearch =
      !search.trim() ||
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.meta.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      activeFilter === 'Todos' ||
      (activeFilter === 'Vencidos' && row.status === 'vencido') ||
      (activeFilter === 'Vencendo' && row.status === 'vencendo') ||
      (activeFilter === 'Estoque Baixo' && row.status === 'estoque-baixo') ||
      (activeFilter === 'Sem Estoque' && row.status === 'sem-estoque');

    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <header className="page-header">
        <h1>Central de Alertas</h1>
        <p>
          Acompanhe produtos vencidos, próximos do vencimento e com estoque baixo.
        </p>
      </header>

      <div className="alerts-summary">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className={`summary-card ${card.variant}`}>
              <div className="summary-card-header">
                <span>{card.title}</span>
                <div className={`summary-icon ${card.variant}`}>
                  <Icon strokeWidth={2} />
                </div>
              </div>
              <p className="summary-value">
                {card.value}
                <small>{card.unit}</small>
              </p>
            </div>
          );
        })}
      </div>

      <div className="alerts-panel">
        <h2 className="alerts-panel-title">Lista de Alertas</h2>

        <div className="alerts-toolbar">
          <div className="alerts-search">
            <Search strokeWidth={2} />
            <input
              type="search"
              placeholder="Pesquisar produto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="alerts-filters">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                className={`filter-chip${activeFilter === f ? ' active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="alerts-table-wrap">
          <table className="alerts-table">
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
                const ProductIcon = row.icon;
                return (
                  <tr key={row.name}>
                    <td>
                      <div className="product-cell">
                        <div className="product-thumb">
                          <ProductIcon strokeWidth={2} />
                        </div>
                        <div className="product-info">
                          <strong>{row.name}</strong>
                          <span>{row.meta}</span>
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
                      <div className="date-cell">
                        <strong>{row.dateMain}</strong>
                        <span className={row.dateColor}>{row.dateSub}</span>
                      </div>
                    </td>
                    <td>
                      <div className="quick-actions">
                        <button type="button" className="action-btn" aria-label="Descartar">
                          <Trash2 strokeWidth={2} />
                        </button>
                        <button type="button" className="action-btn" aria-label="Repor estoque">
                          <ShoppingCart strokeWidth={2} />
                        </button>
                        <button type="button" className="action-btn" aria-label="Detalhes">
                          <Tag strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Alerts;
