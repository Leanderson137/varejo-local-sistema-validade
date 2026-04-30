const express = require('express')
const router = express.Router()
const {
  getAlerts,
  markAsSeen,
  markAllAsSeen
} = require('../controllers/alertController')
const { protect } = require('../middlewares/authMiddleware')

router.use(protect)

router.get('/', getAlerts)
router.patch('/:id/seen', markAsSeen)
router.patch('/seen/all', markAllAsSeen)

module.exports = router