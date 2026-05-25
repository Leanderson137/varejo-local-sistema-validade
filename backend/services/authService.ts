import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { IUser } from '../models/User'
import userRepository from '../repositories/userRepository'
import AppError from '../errors/AppError'
import { RegisterRequest, LoginRequest } from '../dtos/requests/authRequest'
import { AuthResponse, MeResponse } from '../dtos/responses/authResponse'
import { toAuthResponse, toMeResponse } from '../mappers/authMapper'

const generateToken = (id: string): string => {
  const jwtSecret = process.env.JWT_SECRET

  if (!jwtSecret) {
    throw new AppError('JWT_SECRET não definido no arquivo .env.', 500)
  }

  return jwt.sign({ id }, jwtSecret, { expiresIn: '8h' })
}

const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const { name, email, password, role } = data

  const userExists = await userRepository.findByEmail(email)

  if (userExists) {
    throw new AppError('Email já cadastrado.', 400)
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await userRepository.create({
    name,
    email,
    passwordHash,
    role
  })

  const token = generateToken(String(user._id))

  return toAuthResponse(user, token)
}

const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const { email, password } = data

  const user = await userRepository.findByEmail(email)

  if (!user || !user.active) {
    throw new AppError('Credenciais inválidas.', 401)
  }

  if (user.blockedUntil && user.blockedUntil.getTime() > Date.now()) {
    throw new AppError('Usuário bloqueado temporariamente. Tente mais tarde.', 403)
  }

  const isMatch = await user.comparePassword(password)

  if (!isMatch) {
    user.loginAttempts += 1

    if (user.loginAttempts >= 5) {
      user.blockedUntil = new Date(Date.now() + 15 * 60 * 1000)
      user.loginAttempts = 0

      await userRepository.save(user)

      throw new AppError('Muitas tentativas. Usuário bloqueado por 15 minutos.', 403)
    }

    await userRepository.save(user)

    throw new AppError(
      `Credenciais inválidas. Tentativa ${user.loginAttempts} de 5.`,
      401
    )
  }

  user.loginAttempts = 0
  user.blockedUntil = null

  await userRepository.save(user)

  const token = generateToken(String(user._id))

  return toAuthResponse(user, token)
}

const getMe = (user: IUser | undefined): MeResponse => {
  if (!user) {
    throw new AppError('Usuário não autenticado.', 401)
  }

  return toMeResponse(user)
}

export default {
  register,
  login,
  getMe
}