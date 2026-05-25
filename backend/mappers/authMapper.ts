import { IUser } from '../models/User'
import { AuthResponse, MeResponse } from '../dtos/responses/authResponse'

export const toAuthResponse = (user: IUser, token: string): AuthResponse => {
  return {
    _id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    token
  }
}

export const toMeResponse = (user: IUser): MeResponse => {
  return {
    _id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    active: user.active
  }
}