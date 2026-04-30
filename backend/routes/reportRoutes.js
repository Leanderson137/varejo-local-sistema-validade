const express = require('express')
const router = express.Router()
const {
  getDashboard,
  getExpirationReport,
  getMovementReport
} = require('../controllers/reportController')
const { protect } = require('../middlewares/authMiddleware')

router.use(protect)

router.get('/dashboard', getDashboard)
router.get('/expiration', getExpirationReport)
router.get('/movements', getMovementReport)

module.exports = router