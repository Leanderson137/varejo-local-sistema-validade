const express = require('express')
const router = express.Router()
const {
  createMovement,
  getMovements
} = require('../controllers/movementController')
const { protect } = require('../middlewares/authMiddleware')

router.use(protect)

router.get('/', getMovements)
router.post('/', createMovement)

module.exports = router