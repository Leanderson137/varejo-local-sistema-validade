import { useState } from 'react';
import {
  Plus,
  Search,
  ChevronDown,
  Egg,
  Drumstick,
  Wheat,
  Milk,
  Croissant,
  Coffee,
  Pencil,
} from 'lucide-react';
import Layout from '../components/Layout';
import ProductModal from '../components/ProductModal';
import './Stock.css';

const statusFilters = ['Todos', 'Em dia', 'Atenção', 'Vencidos'];

const categories = ['Todas as Categorias', 'Hortifruti', 'Carnes', 'Grãos', 'Laticínios', 'Padaria'];

const products = [
  {
    name: 'Ovos Brancos (Dúzia)',
    category: 'Hortifruti',
    qty: '0 un',
    expiry: '20/Dez/2023',
    status: 'sem-estoque',
    statusLabel: 'Sem estoque',
    icon: Egg,
    filterStatus: 'Atenção',
  },
  {
    name: 'Peito de Frango 1kg',
    category: 'Carnes',
    qty: '15 kg',
    expiry: '28/Nov/2023',
    status: 'estoque-baixo',
    statusLabel: 'Estoque Baixo',
    icon: Drumstick,
    filterStatus: 'Atenção',
  },
  {
    name: 'Arroz Integral 5kg',
    category: 'Grãos',
    qty: '42 un',
    expiry: '15/Mar/2024',
    status: 'em-dia',
    statusLabel: 'Em dia',
    icon: Wheat,
    filterStatus: 'Em dia',
  },
  {
    name: 'Leite Integral 1L',
    category: 'Laticínios',
    qty: '128 un',
    expiry: '10/Dez/2023',
    status: 'vencido',
    statusLabel: 'Vencido',
    icon: Milk,
    filterStatus: 'Vencidos',
  },
  {
    name: 'Pão de Forma Integral',
    category: 'Padaria',
    qty: '24 un',
    expiry: '05/Dez/2023',
    status: 'estoque-baixo',
    statusLabel: 'Estoque Baixo',
    icon: Croissant,
    filterStatus: 'Atenção',
  },
  {
    name: 'Café Torrado 500g',
    category: 'Grãos',
    qty: '56 un',
    expiry: '22/Jun/2024',
    status: 'em-dia',
    statusLabel: 'Em dia',
    icon: Coffee,
    filterStatus: 'Em dia',
  },
  {
    name: 'Iogurte Natural 500g',
    category: 'Laticínios',
    qty: '0 un',
    expiry: '12/Out/2023',
    status: 'vencido',
    statusLabel: 'Vencido',
    icon: Milk,
    filterStatus: 'Vencidos',
  },
];

const Stock = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas as Categorias');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const filtered = products.filter((p) => {
    const matchSearch =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'Todas as Categorias' || p.category === category;
    const matchStatus =
      statusFilter === 'Todos' || p.filterStatus === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <Layout>
      <div className="page-top">
        <header className="page-header">
          <h1>Gestão de Estoque</h1>
          <p>Visualize e gerencie seu inventário, lotes e validades.</p>
        </header>
        <button type="button" className="btn-primary" onClick={() => setModalOpen(true)}>
          <Plus strokeWidth={2.5} />
          Cadastrar Novo Produto
        </button>
      </div>

      <div className="stock-filters">
        <div className="stock-search">
          <Search strokeWidth={2} />
          <input
            type="search"
            placeholder="Buscar por produto ou lote"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="stock-select-wrap">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown strokeWidth={2} />
        </div>
        <div className="stock-status-filters">
          {statusFilters.map((f) => (
            <button
              key={f}
              type="button"
              className={`filter-chip${statusFilter === f ? ' active' : ''}`}
              onClick={() => setStatusFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="stock-panel">
        <div className="stock-table-wrap">
          <table className="stock-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Qtd Total</th>
                <th>Próximo Vencimento</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const Icon = row.icon;
                return (
                  <tr key={row.name}>
                    <td>
                      <div className="stock-product">
                        <div className="stock-product-icon">
                          <Icon strokeWidth={2} />
                        </div>
                        <strong>{row.name}</strong>
                      </div>
                    </td>
                    <td className="stock-category">{row.category}</td>
                    <td className="stock-qty">{row.qty}</td>
                    <td className="stock-expiry">{row.expiry}</td>
                    <td>
                      <span className={`stock-status ${row.status}`}>
                        <span className="dot" />
                        {row.statusLabel}
                      </span>
                    </td>
                    <td>
                      <div className="stock-actions">
                        <button type="button" className="stock-action-btn" aria-label="Editar">
                          <Pencil strokeWidth={2} />
                        </button>
                        <button type="button" className="stock-action-btn" aria-label="Mais opções">
                          <ChevronDown strokeWidth={2} />
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

      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={() => setModalOpen(false)}
      />
    </Layout>
  );
};

export default Stock;
