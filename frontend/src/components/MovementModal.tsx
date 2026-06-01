import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { ArrowLeftRight, X } from 'lucide-react'
import productService from '../services/productService'
import movementService from '../services/movementService'
import type { Product } from '../types/product'
import type { CreateMovementData, MovementType } from '../types/movement'
import { normalizeBarcode } from '../utils/barcodeValidator'
import './MovementModal.css'

interface MovementModalProps {
  open: boolean
  product?: Product | null
  defaultType?: MovementType
  onClose: () => void
  onSave: () => void | Promise<void>
}

interface MovementFormData {
  barcode: string
  type: MovementType
  quantity: string
  dateValue: string
  observation: string
}

const getToday = (): string => {
  return new Date().toISOString().split('T')[0]
}

const getInitialFormData = (type: MovementType = 'venda'): MovementFormData => {
  return {
    barcode: '',
    type,
    quantity: '',
    dateValue: getToday(),
    observation: ''
  }
}

const parseCostPrice = (costPrice?: string): number => {
  if (!costPrice) {
    return 0
  }

  const normalizedValue = costPrice
    .replace('R$', '')
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(',', '.')

  const parsedValue = Number(normalizedValue)

  return Number.isNaN(parsedValue) ? 0 : parsedValue
}

const getQuantityChange = (type: MovementType, quantity: number): number => {
  if (type === 'entrada' || type === 'ajuste') {
    return quantity
  }

  return -quantity
}

const isStockOutput = (type: MovementType): boolean => {
  return type === 'venda' || type === 'descarte'
}

const MovementModal = ({
  open,
  product,
  defaultType = 'venda',
  onClose,
  onSave
}: MovementModalProps) => {
  const [formData, setFormData] = useState<MovementFormData>(
    getInitialFormData(defaultType)
  )
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(product ?? null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

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
      setSelectedProduct(product ?? null)
      setFormData({
        ...getInitialFormData(defaultType),
        barcode: product?.barcode ?? '',
        dateValue: getToday()
      })
      setErrorMessage('')
      setLoading(false)
    }
  }, [open, product, defaultType])

  if (!open) {
    return null
  }

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = event.target

    setFormData((current) => ({
      ...current,
      [id]: id === 'barcode' ? normalizeBarcode(value) : value
    }))

    if (errorMessage) {
      setErrorMessage('')
    }
  }

  const handleSearchByBarcode = async () => {
    const barcode = normalizeBarcode(formData.barcode)

    if (!barcode) {
      setErrorMessage('Informe um código de barras para buscar o produto.')
      return
    }

    try {
      setLoading(true)

      const foundProduct = await productService.findProductByBarcode(barcode)

      if (!foundProduct) {
        setSelectedProduct(null)
        setErrorMessage('Nenhum produto encontrado com este código de barras.')
        return
      }

      setSelectedProduct(foundProduct)
      setErrorMessage('')
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível buscar o produto.'

      setErrorMessage(message)
    } finally {
      setLoading(false)
    }
  }

  const validateMovement = (quantity: number): boolean => {
    if (!selectedProduct) {
      setErrorMessage('Busque ou selecione um produto antes de movimentar.')
      return false
    }

    if (!quantity || quantity <= 0) {
      setErrorMessage('Informe uma quantidade maior que zero.')
      return false
    }

    if (isStockOutput(formData.type) && quantity > selectedProduct.quantity) {
      setErrorMessage(
        `Quantidade inválida. O estoque atual é de ${selectedProduct.quantity} unidade(s).`
      )
      return false
    }

    if (formData.type === 'descarte' && parseCostPrice(selectedProduct.costPrice) <= 0) {
      setErrorMessage(
        'Para computar prejuízo, informe o preço de custo do produto antes de descartar.'
      )
      return false
    }

    return true
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedProduct) {
      setErrorMessage('Busque ou selecione um produto antes de movimentar.')
      return
    }

    const quantity = Number(formData.quantity)

    if (!validateMovement(quantity)) {
      return
    }

    try {
      setLoading(true)

      const quantityChange = getQuantityChange(formData.type, quantity)
      const unitCost = parseCostPrice(selectedProduct.costPrice)

      await productService.updateProductQuantity(selectedProduct.id, quantityChange)

      const movementData: CreateMovementData = {
        productId: selectedProduct.id,
        product: selectedProduct.name,
        barcode: selectedProduct.barcode,
        category: selectedProduct.category,
        type: formData.type,
        quantity,
        dateValue: formData.dateValue,
        expiry: selectedProduct.expiry,
        observation: formData.observation || undefined,
        unitCost
      }

      await movementService.createMovement(movementData)

      await onSave()
      onClose()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível registrar a movimentação.'

      setErrorMessage(message)
    } finally {
      setLoading(false)
    }
  }

  const maxQuantity =
    selectedProduct && isStockOutput(formData.type)
      ? selectedProduct.quantity
      : undefined

  return (
    <div className="movement-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="card border-0 movement-modal-card"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="movement-modal-title"
      >
        <div className="card-header bg-white d-flex align-items-center justify-content-between movement-modal-header">
          <div className="d-flex align-items-center gap-2">
            <ArrowLeftRight strokeWidth={2} />
            <h2 id="movement-modal-title">Movimentar Estoque</h2>
          </div>

          <button
            type="button"
            className="movement-modal-close"
            onClick={onClose}
            aria-label="Fechar"
            title="Fechar"
            disabled={loading}
          >
            <X strokeWidth={2} />
          </button>
        </div>

        <form className="card-body movement-modal-form" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="alert alert-danger py-2 small mb-0" role="alert">
              {errorMessage}
            </div>
          )}

          <div>
            <label htmlFor="barcode" className="form-label movement-modal-label">
              Código de Barras / SKU
            </label>

            <div className="d-flex gap-2">
              <input
                id="barcode"
                type="text"
                className="form-control"
                placeholder="Digite ou escaneie o código"
                value={formData.barcode}
                onChange={handleChange}
                inputMode="numeric"
                maxLength={14}
                disabled={loading || Boolean(product)}
              />

              <button
                type="button"
                className="btn movement-modal-search"
                onClick={handleSearchByBarcode}
                disabled={loading || Boolean(product)}
              >
                Buscar
              </button>
            </div>
          </div>

          <div className="movement-product-box">
            {selectedProduct ? (
              <>
                <span className="movement-product-label">Produto selecionado</span>
                <strong>{selectedProduct.name}</strong>
                <small>
                  Categoria: {selectedProduct.category} · Estoque atual: {selectedProduct.quantity}
                </small>
              </>
            ) : (
              <>
                <span className="movement-product-label">Nenhum produto selecionado</span>
                <small>Busque pelo código de barras para preencher automaticamente.</small>
              </>
            )}
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label htmlFor="type" className="form-label movement-modal-label">
                Tipo de Movimentação <span className="required">*</span>
              </label>

              <select
                id="type"
                className="form-select"
                value={formData.type}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="entrada">Entrada</option>
                <option value="venda">Venda/Saída</option>
                <option value="descarte">Descarte</option>
                <option value="ajuste">Ajuste positivo</option>
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="quantity" className="form-label movement-modal-label">
                Quantidade <span className="required">*</span>
              </label>

              <input
                id="quantity"
                type="number"
                min="1"
                max={maxQuantity}
                className="form-control"
                placeholder="0"
                value={formData.quantity}
                onChange={handleChange}
                required
                disabled={loading}
              />

              {maxQuantity !== undefined && (
                <small className="text-secondary d-block mt-1">
                  Máximo permitido: {maxQuantity}
                </small>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="dateValue" className="form-label movement-modal-label">
              Data da Movimentação <span className="required">*</span>
            </label>

            <input
              id="dateValue"
              type="date"
              className="form-control"
              value={formData.dateValue}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="observation" className="form-label movement-modal-label">
              Observação
            </label>

            <textarea
              id="observation"
              className="form-control"
              rows={3}
              placeholder="Ex: reposição de estoque, venda no caixa, descarte por vencimento..."
              value={formData.observation}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </form>

        <div className="card-footer bg-white d-flex justify-content-end gap-2 movement-modal-footer">
          <button
            type="button"
            className="btn movement-modal-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn movement-modal-save"
            onClick={(event) => {
              const form = event.currentTarget
                .closest('.movement-modal-card')
                ?.querySelector('form')

              form?.requestSubmit()
            }}
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Registrar Movimentação'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MovementModal