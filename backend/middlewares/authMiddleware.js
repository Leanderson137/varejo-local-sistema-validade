const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id).select('-passwordHash')

    if (!user || !user.active) {
      return res.status(401).json({ message: 'Usuário não encontrado ou inativo.' })
    }

    req.user = user
    next()

  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' })
  }
}

module.exports = { protect }