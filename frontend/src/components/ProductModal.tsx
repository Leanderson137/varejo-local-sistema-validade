import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import type { CreateProductData, ProductCategory } from '../types/product'
import { isValidBarcode, normalizeBarcode } from '../utils/barcodeValidator'
import './ProductModal.css'

interface ProductModalProps {
  open: boolean
  onClose: () => void
  onSave: (product: CreateProductData) => void
}

interface ProductFormData {
  name: string
  barcode: string
  category: ProductCategory | ''
  supplier: string
  quantity: string
  minimumStock: string
  costPrice: string
}

const categories: ProductCategory[] = [
  'Hortifruti',
  'Carnes',
  'Grãos',
  'Laticínios',
  'Padaria',
  'Bebidas'
]

const suppliers = [
  'Laticínios do Vale',
  'Distribuidora Central',
  'HortiFresco',
  'Padaria Artesanal'
]

const initialFormData: ProductFormData = {
  name: '',
  barcode: '',
  category: '',
  supplier: '',
  quantity: '',
  minimumStock: '',
  costPrice: ''
}

const ProductModal = ({ open, onClose, onSave }: ProductModalProps) => {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData)
  const [barcodeError, setBarcodeError] = useState<string>('')

  useEffect(() => {
    if (!open) {
      return
    }

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      setFormData(initialFormData)
      setBarcodeError('')
    }
  }, [open])

  if (!open) {
    return null
  }

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = event.target

    const fieldMap: Record<string, keyof ProductFormData> = {
      'product-name': 'name',
      'product-sku': 'barcode',
      'product-category': 'category',
      'product-supplier': 'supplier',
      'product-qty': 'quantity',
      'product-min': 'minimumStock',
      'product-cost': 'costPrice'
    }

    const field = fieldMap[id]

    if (!field) {
      return
    }

    if (field === 'barcode') {
      const normalizedBarcode = normalizeBarcode(value)

      setFormData((current) => ({
        ...current,
        barcode: normalizedBarcode
      }))

      if (normalizedBarcode && !isValidBarcode(normalizedBarcode)) {
        setBarcodeError('Código de barras inválido. Use um GTIN/EAN válido.')
      } else {
        setBarcodeError('')
      }

      return
    }

    setFormData((current) => ({
      ...current,
      [field]: value
    }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedBarcode = normalizeBarcode(formData.barcode)

    if (normalizedBarcode && !isValidBarcode(normalizedBarcode)) {
      setBarcodeError('Código de barras inválido. Use um GTIN/EAN válido.')
      return
    }

    if (!formData.category) {
      return
    }

    onSave({
      name: formData.name.trim(),
      barcode: normalizedBarcode || undefined,
      category: formData.category,
      supplier: formData.supplier || undefined,
      quantity: Number(formData.quantity),
      minimumStock: formData.minimumStock
        ? Number(formData.minimumStock)
        : undefined,
      costPrice: formData.costPrice || undefined
    })

    onClose()
  }

  return (
    <div className="product-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="card border-0 product-modal-card"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        <div className="card-header bg-white d-flex align-items-center justify-content-between product-modal-header">
          <h2 id="product-modal-title">Cadastrar Novo Produto</h2>

          <button
            type="button"
            className="product-modal-close"
            onClick={onClose}
            aria-label="Fechar"
            title="Fechar"
          >
            <X strokeWidth={2} />
          </button>
        </div>

        <form
          id="product-modal-form"
          className="card-body product-modal-form"
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="product-name" className="form-label product-modal-label">
              Nome do Produto <span className="required">*</span>
            </label>

            <input
              id="product-name"
              type="text"
              className="form-control"
              placeholder="Ex: Leite Desnatado 1L"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label htmlFor="product-sku" className="form-label product-modal-label">
                Código de Barras / SKU
              </label>

              <input
                id="product-sku"
                type="text"
                className={`form-control${barcodeError ? ' is-invalid' : ''}`}
                placeholder="Ex: 7891000100103"
                value={formData.barcode}
                onChange={handleChange}
                inputMode="numeric"
                maxLength={14}
              />

              {barcodeError && (
                <div className="invalid-feedback">
                  {barcodeError}
                </div>
              )}
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="product-category" className="form-label product-modal-label">
                Categoria <span className="required">*</span>
              </label>

              <select
                id="product-category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Selecionar...
                </option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label htmlFor="product-supplier" className="form-label product-modal-label">
                Fornecedor
              </label>

              <select
                id="product-supplier"
                className="form-select"
                value={formData.supplier}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Selecionar...
                </option>

                {suppliers.map((supplier) => (
                  <option key={supplier} value={supplier}>
                    {supplier}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="product-qty" className="form-label product-modal-label">
                Quantidade <span className="required">*</span>
              </label>

              <input
                id="product-qty"
                type="number"
                min="0"
                className="form-control"
                placeholder="0"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label htmlFor="product-min" className="form-label product-modal-label">
                Estoque Mínimo
              </label>

              <input
                id="product-min"
                type="number"
                min="0"
                className="form-control"
                placeholder="0"
                value={formData.minimumStock}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="product-cost" className="form-label product-modal-label">
                Preço de Custo
              </label>

              <div className="input-group product-modal-input-group">
                <span className="input-group-text">R$</span>
                <input
                  id="product-cost"
                  type="text"
                  className="form-control"
                  placeholder="0,00"
                  value={formData.costPrice}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </form>

        <div className="card-footer bg-white d-flex justify-content-end gap-2 product-modal-footer">
          <button
            type="button"
            className="btn product-modal-cancel"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn product-modal-save"
            form="product-modal-form"
          >
            Salvar Produto
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductModal