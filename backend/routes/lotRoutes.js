const express = require('express')
const router = express.Router()
const {
  createLot,
  getLots,
  getLotById,
  updateLot,
  discardLot
} = require('../controllers/lotController')
const { protect } = require('../middlewares/authMiddleware')
const { adminOnly } = require('../middlewares/roleMiddleware')

router.use(protect)

router.get('/', getLots)
router.get('/:id', getLotById)
router.post('/', adminOnly, createLot)
router.put('/:id', adminOnly, updateLot)
router.patch('/:id/discard', adminOnly, discardLot)

module.exports = router