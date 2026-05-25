import { Router } from 'express'
import { protect } from '../middlewares/authMiddleware'
import { adminOnly } from '../middlewares/roleMiddleware'
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController'

const router = Router()

router.use(protect)

router.get('/', getCategories)
router.get('/:id', getCategoryById)
router.post('/', adminOnly, createCategory)
router.put('/:id', adminOnly, updateCategory)
router.delete('/:id', adminOnly, deleteCategory)

export default router