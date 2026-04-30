const express = require('express')
const router = express.Router()
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController')
const { protect } = require('../middlewares/authMiddleware')
const { adminOnly } = require('../middlewares/roleMiddleware')

router.use(protect)

router.get('/', getProducts)
router.get('/:id', getProductById)
router.post('/', adminOnly, createProduct)
router.put('/:id', adminOnly, updateProduct)
router.delete('/:id', adminOnly, deleteProduct)

module.exports = router