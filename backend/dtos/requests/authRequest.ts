import { UserRole } from '../../models/User'

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role?: UserRole
}

export interface LoginRequest {
  email: string
  password: string
}