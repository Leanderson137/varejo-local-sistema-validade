import { UserRole } from '../../models/User'

export interface AuthResponse {
  _id: string
  name: string
  email: string
  role: UserRole
  token: string
}

export interface MeResponse {
  _id: string
  name: string
  email: string
  role: UserRole
  active: boolean
}