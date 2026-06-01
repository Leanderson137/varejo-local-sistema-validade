export interface User {
  id: string
  name: string
  email: string
}

export interface LoginRequest {
  email: string
  password: string
  rememberMe: boolean
}

export interface LoginApiResponse {
  _id: string
  name: string
  email: string
  token: string
}

export interface LoginResponse {
  user: User
  token: string
}