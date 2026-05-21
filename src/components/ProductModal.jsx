import { useEffect } from 'react';
import { X } from 'lucide-react';
import './ProductModal.css';

const categories = ['Hortifruti', 'Carnes', 'Grãos', 'Laticínios', 'Padaria', 'Bebidas'];
const suppliers = ['Laticínios do Vale', 'Distribuidora Central', 'HortiFresco', 'Padaria Artesanal'];

const ProductModal = ({ open, onClose, onSave }) => {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h2 id="modal-title">Cadastrar Novo Produto</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Fechar">
            <X strokeWidth={2} />
          </button>
        </div>

        <form id="product-modal-form" className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label htmlFor="product-name">
              Nome do Produto <span className="required">*</span>
            </label>
            <input id="product-name" type="text" placeholder="Ex: Leite Desnatado 1L" required />
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label htmlFor="product-sku">Código de Barras / SKU</label>
              <input id="product-sku" type="text" placeholder="0000000000000" />
            </div>
            <div className="modal-field">
              <label htmlFor="product-category">
                Categoria <span className="required">*</span>
              </label>
              <select id="product-category" required defaultValue="">
                <option value="" disabled>
                  Selecionar...
                </option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label htmlFor="product-supplier">Fornecedor</label>
              <select id="product-supplier" defaultValue="">
                <option value="" disabled>
                  Selecionar...
                </option>
                {suppliers.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-field">
              <label htmlFor="product-qty">
                Quantidade <span className="required">*</span>
              </label>
              <input id="product-qty" type="number" min="0" placeholder="0" required />
            </div>
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label htmlFor="product-min">Estoque Mínimo</label>
              <input id="product-min" type="number" min="0" placeholder="0" />
            </div>
            <div className="modal-field">
              <label htmlFor="product-cost">Preço de Custo</label>
              <div className="modal-input-prefix">
                <span>R$</span>
                <input id="product-cost" type="text" placeholder="0,00" />
              </div>
            </div>
          </div>
        </form>

        <div className="modal-footer">
          <button type="button" className="modal-btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="modal-btn-save" form="product-modal-form">
            Salvar Produto
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
