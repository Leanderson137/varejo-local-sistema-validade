import { Router } from 'express'
import { protect } from '../middlewares/authMiddleware'

const {
  createMovement,
  getMovements
} = require('../controllers/movementController')

const router = Router()

router.use(protect)

router.get('/', getMovements)
router.post('/', createMovement)

export default router