import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import connectDB from './config/db'

import './models/User'
import './models/Category'
import './models/Product'
import './models/Lot'
import './models/Alert'
import './models/Movement'

import runAlertJob from './jobs/alertJob'

import authRoutes from './routes/authRoutes'
import categoryRoutes from './routes/categoryRoutes'
import productRoutes from './routes/productRoutes'
import lotRoutes from './routes/lotRoutes'
import alertRoutes from './routes/alertRoutes'
import movementRoutes from './routes/movementRoutes'
import reportRoutes from './routes/reportRoutes'

import errorHandler from './middlewares/errorMiddleware'

dotenv.config()

connectDB()

runAlertJob()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/lots', lotRoutes)
app.use('/api/alerts', alertRoutes)
app.use('/api/movements', movementRoutes)
app.use('/api/reports', reportRoutes)

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API Sistema de Validade funcionando!' })
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})

export default app