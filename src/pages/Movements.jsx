import {
  Calendar,
  Filter,
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
  BarChart3,
} from 'lucide-react';
import Layout from '../components/Layout';
import './Movements.css';

const movements = [
  {
    date: '15/Nov',
    product: 'Leite Integral 1L',
    type: 'entrada',
    typeLabel: 'Entrada',
    qty: '+50',
    qtyClass: 'positive',
    lot: 'L-8821 / 20/Dez',
    lotHighlight: null,
  },
  {
    date: '14/Nov',
    product: 'Pão de Forma',
    type: 'venda',
    typeLabel: 'Venda',
    qty: '-15',
    qtyClass: 'negative',
    lot: 'L-1102 / 18/Nov',
    lotHighlight: null,
  },
  {
    date: '14/Nov',
    product: 'Iogurte Grego',
    type: 'descarte',
    typeLabel: 'Descarte',
    qty: '-12',
    qtyClass: 'loss',
    lot: 'L-99 / Vencido',
    lotHighlight: 'red',
  },
  {
    date: '13/Nov',
    product: 'Ovos (Dúzia)',
    type: 'ajuste',
    typeLabel: 'Ajuste',
    qty: '-2',
    qtyClass: 'negative',
    lot: 'L-4420 / 25/Nov',
    lotHighlight: null,
  },
  {
    date: '12/Nov',
    product: 'Queijo Minas',
    type: 'descarte',
    typeLabel: 'Descarte',
    qty: '-8',
    qtyClass: 'loss',
    lot: 'L-33 / Vence Hoje',
    lotHighlight: 'orange',
  },
];

const categoryLoss = [
  { name: 'Laticínios', pct: 65, color: 'red' },
  { name: 'Hortifruti', pct: 20, color: 'orange' },
  { name: 'Padaria', pct: 15, color: 'purple' },
];

const typeIcons = {
  entrada: ArrowDownToLine,
  venda: ArrowUpRight,
  descarte: Trash2,
  ajuste: AlertCircle,
};

const Movements = () => (
  <Layout>
    <header className="page-header">
      <h1>Movimentação Mensal</h1>
      <p>Analise as entradas, saídas e possíveis perdas do seu estoque.</p>
    </header>

    <div className="movements-controls">
      <button type="button" className="control-btn">
        <Calendar strokeWidth={2} />
        Novembro 2023
      </button>
      <button type="button" className="control-btn">
        <Filter strokeWidth={2} />
        Filtros
      </button>
    </div>

    <div className="movements-summary">
      <div className="summary-metric">
        <div className="summary-metric-top">
          <div className="summary-metric-icon blue">
            <ArrowDownToLine strokeWidth={2} />
          </div>
        </div>
        <p className="summary-metric-label">Total de Entradas</p>
        <p className="summary-metric-value">1.240</p>
        <span className="summary-metric-trend green">
          <TrendingUp strokeWidth={2} size={14} />
          +12% vs. mês anterior
        </span>
      </div>

      <div className="summary-metric">
        <div className="summary-metric-top">
          <div className="summary-metric-icon gray">
            <ArrowUpFromLine strokeWidth={2} />
          </div>
        </div>
        <p className="summary-metric-label">Total de Saídas</p>
        <p className="summary-metric-value">890</p>
        <span className="summary-metric-trend gray">
          <ArrowRight strokeWidth={2} size={14} />
          Estável vs. mês anterior
        </span>
      </div>

      <div className="summary-metric loss">
        <div className="summary-metric-top">
          <div className="summary-metric-icon red">
            <AlertTriangle strokeWidth={2} />
          </div>
        </div>
        <p className="summary-metric-label">Perdas por Vencimento</p>
        <p className="summary-metric-value">42</p>
        <p className="summary-metric-sub">R$ 1.250,00 em prejuízo estimado</p>
        <span className="summary-metric-trend red">
          <ArrowUp strokeWidth={2} size={14} />
          +5% vs. mês anterior (Atenção)
        </span>
      </div>
    </div>

    <div className="movements-body">
      <div className="movements-table-panel">
        <div className="movements-table-header">
          <h2>Movimentações</h2>
          <div className="movements-dropdowns">
            <button type="button" className="movements-dropdown">
              Mais recentes
              <ChevronDown strokeWidth={2} />
            </button>
            <button type="button" className="movements-dropdown">
              Categoria
              <ChevronDown strokeWidth={2} />
            </button>
            <button type="button" className="movements-dropdown">
              Tipo de Operação
              <ChevronDown strokeWidth={2} />
            </button>
          </div>
        </div>
        <div className="movements-table-wrap">
          <table className="movements-table">
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
              {movements.map((row) => {
                const TypeIcon = typeIcons[row.type];
                return (
                  <tr key={`${row.date}-${row.product}`}>
                    <td>{row.date}</td>
                    <td className="movement-product">{row.product}</td>
                    <td>
                      <span className={`movement-type ${row.type}`}>
                        <TypeIcon strokeWidth={2} />
                        {row.typeLabel}
                      </span>
                    </td>
                    <td className={`movement-qty ${row.qtyClass}`}>{row.qty}</td>
                    <td className="movement-lot">
                      {row.lotHighlight ? (
                        <>
                          {row.lot.split(' / ')[0]} /{' '}
                          <strong className={row.lotHighlight}>
                            {row.lot.split(' / ')[1]}
                          </strong>
                        </>
                      ) : (
                        row.lot
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <aside className="analysis-panel">
        <h2>
          <BarChart3 strokeWidth={2} />
          Análise de Prejuízo
        </h2>

        <p className="analysis-section-label">Maior causa de perda (Novembro)</p>
        <div className="analysis-highlight">
          <h3>Laticínios</h3>
          <p>65% do total de descartes</p>
          <span className="value">R$ 812,50</span>
        </div>

        <p className="analysis-section-label">Descartes por categoria</p>
        <div className="category-bars">
          {categoryLoss.map((cat) => (
            <div key={cat.name} className="category-bar-row">
              <div className="category-bar-label">
                <span>{cat.name}</span>
                <span>{cat.pct}%</span>
              </div>
              <div className="category-bar-track">
                <div
                  className={`category-bar-fill ${cat.color}`}
                  style={{ width: `${cat.pct}%` }}
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
      </aside>
    </div>
  </Layout>
);

export default Movements;
