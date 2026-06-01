import api from './api'
import type { LoginApiResponse, LoginRequest, LoginResponse, User } from '../types/auth'

const AUTH_TOKEN_KEY = 'varejo-local-token'
const AUTH_USER_KEY = 'varejo-local-user'

const USE_MOCK_AUTH = false

const mockUser: User = {
  id: 'user-admin',
  name: 'Administrador',
  email: 'admin@varejolocal.com'
}

const saveAuthData = (
  response: LoginResponse,
  rememberMe: boolean
): void => {
  const storage = rememberMe ? localStorage : sessionStorage

  storage.setItem(AUTH_TOKEN_KEY, response.token)
  storage.setItem(AUTH_USER_KEY, JSON.stringify(response.user))
}

const loginWithMock = (data: LoginRequest): LoginResponse => {
  const email = data.email.trim().toLowerCase()
  const password = data.password.trim()

  if (!email || !password) {
    throw new Error('Informe e-mail e senha.')
  }

  const response: LoginResponse = {
    user: {
      ...mockUser,
      email
    },
    token: 'mock-token-varejo-local'
  }

  saveAuthData(response, data.rememberMe)

  return response
}

const loginWithApi = async (data: LoginRequest): Promise<LoginResponse> => {
  const apiResponse = await api.post<LoginApiResponse, LoginRequest>(
    '/auth/login',
    data
  )

  const response: LoginResponse = {
    user: {
      id: apiResponse._id,
      name: apiResponse.name,
      email: apiResponse.email
    },
    token: apiResponse.token
  }

  saveAuthData(response, data.rememberMe)

  return response
}

const login = async (data: LoginRequest): Promise<LoginResponse> => {
  if (USE_MOCK_AUTH) {
    return loginWithMock(data)
  }

  return loginWithApi(data)
}

const logout = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)

  sessionStorage.removeItem(AUTH_TOKEN_KEY)
  sessionStorage.removeItem(AUTH_USER_KEY)
}

const getToken = (): string | null => {
  return (
    localStorage.getItem(AUTH_TOKEN_KEY) ||
    sessionStorage.getItem(AUTH_TOKEN_KEY)
  )
}

const getCurrentUser = (): User | null => {
  const storedUser =
    localStorage.getItem(AUTH_USER_KEY) ||
    sessionStorage.getItem(AUTH_USER_KEY)

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser) as User
  } catch {
    logout()
    return null
  }
}

const isAuthenticated = (): boolean => {
  return Boolean(getToken())
}

export default {
  login,
  logout,
  getToken,
  getCurrentUser,
  isAuthenticated
}