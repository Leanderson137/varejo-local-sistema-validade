import { Router } from 'express'
import { protect } from '../middlewares/authMiddleware'
import { adminOnly } from '../middlewares/roleMiddleware'

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController')

const router = Router()

router.use(protect)

router.get('/', getProducts)
router.get('/:id', getProductById)
router.post('/', adminOnly, createProduct)
router.put('/:id', adminOnly, updateProduct)
router.delete('/:id', adminOnly, deleteProduct)

export default router