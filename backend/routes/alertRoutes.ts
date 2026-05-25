import { Router } from 'express'
import { protect } from '../middlewares/authMiddleware'

const {
  getAlerts,
  markAsSeen,
  markAllAsSeen
} = require('../controllers/alertController')

const router = Router()

router.use(protect)

router.get('/', getAlerts)
router.patch('/:id/seen', markAsSeen)
router.patch('/seen/all', markAllAsSeen)

export default router