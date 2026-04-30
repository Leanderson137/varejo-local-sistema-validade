const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: [true, 'Senha é obrigatória']
  },
  role: {
    type: String,
    enum: ['admin', 'operator'],
    default: 'operator'
  },
  active: {
    type: Boolean,
    default: true
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  blockedUntil: {
    type: Date,
    default: null
  }
}, { timestamps: true })

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.passwordHash)
}

module.exports = mongoose.model('User', userSchema)