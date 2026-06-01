import type { LoginRequest, LoginResponse, User } from '../types/auth'

const AUTH_TOKEN_KEY = 'varejo-local-token'
const AUTH_USER_KEY = 'varejo-local-user'

const mockUser: User = {
  id: 'user-admin',
  name: 'Administrador',
  email: 'admin@varejolocal.com',
  role: 'admin'
}

const login = (data: LoginRequest): LoginResponse => {
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

  if (data.rememberMe) {
    localStorage.setItem(AUTH_TOKEN_KEY, response.token)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user))
  } else {
    sessionStorage.setItem(AUTH_TOKEN_KEY, response.token)
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user))
  }

  return response
}

const logout = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)

  sessionStorage.removeItem(AUTH_TOKEN_KEY)
  sessionStorage.removeItem(AUTH_USER_KEY)
}

const getToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY)
}

const getCurrentUser = (): User | null => {
  const storedUser =
    localStorage.getItem(AUTH_USER_KEY) || sessionStorage.getItem(AUTH_USER_KEY)

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