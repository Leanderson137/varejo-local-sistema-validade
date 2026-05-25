import { Router } from 'express'
import { protect } from '../middlewares/authMiddleware'
import { adminOnly } from '../middlewares/roleMiddleware'

const {
  createLot,
  getLots,
  getLotById,
  updateLot,
  discardLot
} = require('../controllers/lotController')

const router = Router()

router.use(protect)

router.get('/', getLots)
router.get('/:id', getLotById)
router.post('/', adminOnly, createLot)
router.put('/:id', adminOnly, updateLot)
router.patch('/:id/discard', adminOnly, discardLot)

export default router