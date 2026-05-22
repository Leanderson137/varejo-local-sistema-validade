const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

import connectDB from './config/db'
import type { Request, Response } from 'express'

dotenv.config()

connectDB()

require('./models/User')
require('./models/Category')
require('./models/Product')
require('./models/Lot')
require('./models/Alert')
require('./models/Movement')

const runAlertJob = require('./jobs/alertJob')
runAlertJob()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/products', require('./routes/productRoutes'))
app.use('/api/lots', require('./routes/lotRoutes'))
app.use('/api/alerts', require('./routes/alertRoutes'))
app.use('/api/movements', require('./routes/movementRoutes'))
app.use('/api/reports', require('./routes/reportRoutes'))

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API Sistema de Validade funcionando!' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})

module.exports = app