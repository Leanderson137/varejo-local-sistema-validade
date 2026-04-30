const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '8h' })
}

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'Email já cadastrado.' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await User.create({ name, email, passwordHash, role })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user || !user.active) {
      return res.status(401).json({ message: 'Credenciais inválidas.' })
    }

    if (user.blockedUntil && user.blockedUntil > Date.now()) {
      return res.status(403).json({ message: 'Usuário bloqueado temporariamente. Tente mais tarde.' })
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      user.loginAttempts += 1

      if (user.loginAttempts >= 5) {
        user.blockedUntil = new Date(Date.now() + 15 * 60 * 1000)
        user.loginAttempts = 0
        await user.save()
        return res.status(403).json({ message: 'Muitas tentativas. Usuário bloqueado por 15 minutos.' })
      }

      await user.save()
      return res.status(401).json({ message: `Credenciais inválidas. Tentativa ${user.loginAttempts} de 5.` })
    }

    user.loginAttempts = 0
    user.blockedUntil = null
    await user.save()

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getMe = async (req, res) => {
  res.json(req.user)
}

module.exports = { register, login, getMe }