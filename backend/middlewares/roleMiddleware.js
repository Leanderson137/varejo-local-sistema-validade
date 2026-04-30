const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403).json({ message: 'Acesso restrito a administradores.' })
  }
}

module.exports = { adminOnly }