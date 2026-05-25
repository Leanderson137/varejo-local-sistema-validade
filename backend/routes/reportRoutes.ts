import { Router } from 'express'
import { protect } from '../middlewares/authMiddleware'
import {
  getDashboard,
  getExpirationReport,
  getMovementReport
} from '../controllers/reportController'

const router = Router()

router.use(protect)

router.get('/dashboard', getDashboard)
router.get('/expiration', getExpirationReport)
router.get('/movements', getMovementReport)

export default router