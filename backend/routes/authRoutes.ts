import { Router } from 'express'
import { protect } from '../middlewares/authMiddleware'
import { register, login, getMe } from '../controllers/authController'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)

export default router