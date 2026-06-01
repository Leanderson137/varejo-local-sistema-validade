import { useEffect, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
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
  ArrowLeftRight,
  MoreHorizontal
} from 'lucide-react'
import Layout from '../components/Layout'
import ProductModal from '../components/ProductModal'
import productService from '../services/productService'
import type {
  CreateProductData,
  Product,
  ProductCategory,
  ProductFilterStatus
} from '../types/product'
import './Stock.css'

type StatusFilter = 'Todos' | ProductFilterStatus

const statusFilters: StatusFilter[] = ['Todos', 'Em dia', 'Atenção', 'Vencidos']

const categories: Array<ProductCategory | 'Todas as Categorias'> = [
  'Todas as Categorias',
  'Hortifruti',
  'Carnes',
  'Grãos',
  'Laticínios',
  'Padaria',
  'Bebidas'
]

const getProductIcon = (product: Product): LucideIcon => {
  if (product.category === 'Hortifruti') {
    return Egg
  }

  if (product.category === 'Carnes') {
    return Drumstick
  }

  if (product.category === 'Grãos') {
    return product.name.toLowerCase().includes('café') ? Coffee : Wheat
  }

  if (product.category === 'Laticínios') {
    return Milk
  }

  if (product.category === 'Padaria') {
    return Croissant
  }

  return Coffee
}

const formatQuantity = (product: Product): string => {
  if (product.category === 'Carnes') {
    return `${product.quantity} kg`
  }

  return `${product.quantity} un`
}

const Stock = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState<string>('')
  const [category, setCategory] = useState<ProductCategory | 'Todas as Categorias'>(
    'Todas as Categorias'
  )
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Todos')

  useEffect(() => {
    setProducts(productService.getProducts())
  }, [])

  const handleSaveProduct = (data: CreateProductData) => {
    const createdProduct = productService.createProduct(data)

    setProducts((currentProducts) => [
      createdProduct,
      ...currentProducts
    ])
  }

  const filteredProducts = products.filter((product) => {
    const normalizedSearch = search.trim().toLowerCase()

    const matchSearch =
      !normalizedSearch ||
      product.name.toLowerCase().includes(normalizedSearch) ||
      product.category.toLowerCase().includes(normalizedSearch) ||
      product.barcode?.includes(normalizedSearch)

    const matchCategory =
      category === 'Todas as Categorias' || product.category === category

    const matchStatus =
      statusFilter === 'Todos' || product.filterStatus === statusFilter

    return matchSearch && matchCategory && matchStatus
  })

  return (
    <Layout>
      <div className="d-flex flex-column flex-lg-row align-items-lg-start justify-content-between gap-3 mb-4">
        <header className="page-header mb-0">
          <h1>Gestão de Estoque</h1>
          <p>Visualize e gerencie seu inventário, lotes e validades.</p>
        </header>

        <button
          type="button"
          className="btn btn-primary stock-primary-btn"
          onClick={() => setModalOpen(true)}
        >
          <Plus strokeWidth={2.5} />
          Cadastrar Novo Produto
        </button>
      </div>

      <section className="card border-0 shadow-sm stock-filters mb-3">
        <div className="card-body d-flex flex-column flex-xl-row align-items-xl-center gap-3">
          <div className="stock-search">
            <Search strokeWidth={2} />
            <input
              type="search"
              className="form-control"
              placeholder="Buscar por produto, categoria ou código"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="stock-select-wrap">
            <select
              className="form-select"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as ProductCategory | 'Todas as Categorias')
              }
            >
              {categories.map((currentCategory) => (
                <option key={currentCategory} value={currentCategory}>
                  {currentCategory}
                </option>
              ))}
            </select>
            <ChevronDown strokeWidth={2} />
          </div>

          <div className="d-flex flex-wrap gap-2 ms-xl-auto">
            {statusFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`btn btn-sm rounded-pill ${
                  statusFilter === filter ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => setStatusFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="card border-0 shadow-sm stock-panel">
        <div className="table-responsive stock-table-wrap">
          <table className="table align-middle mb-0 stock-table">
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
              {filteredProducts.map((row) => {
                const Icon = getProductIcon(row)

                return (
                  <tr key={row.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div className="stock-product-icon">
                          <Icon strokeWidth={2} />
                        </div>

                        <div>
                          <strong className="stock-product-name">{row.name}</strong>

                          {row.barcode && (
                            <span className="d-block stock-barcode">
                              Código: {row.barcode}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="stock-category">{row.category}</td>
                    <td className="stock-qty">{formatQuantity(row)}</td>
                    <td className="stock-expiry">{row.expiry}</td>

                    <td>
                      <span className={`stock-status ${row.status}`}>
                        <span className="dot" />
                        {row.statusLabel}
                      </span>
                    </td>

                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary stock-action-btn"
                          aria-label="Editar produto"
                          title="Editar produto"
                        >
                          <Pencil strokeWidth={2} />
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary stock-action-btn"
                          aria-label="Movimentar estoque"
                          title="Movimentar estoque"
                        >
                          <ArrowLeftRight strokeWidth={2} />
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary stock-action-btn"
                          aria-label="Ver detalhes"
                          title="Ver detalhes"
                        >
                          <MoreHorizontal strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-secondary">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProduct}
      />
    </Layout>
  )
}

export default Stock