import User, { IUser, UserRole } from '../models/User'

interface CreateUserData {
  name: string
  email: string
  passwordHash: string
  role?: UserRole
}

const create = async (data: CreateUserData): Promise<IUser> => {
  return User.create(data)
}

const findByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({ email })
}

const findById = async (id: string): Promise<IUser | null> => {
  return User.findById(id)
}

const findByIdWithoutPassword = async (id: string): Promise<IUser | null> => {
  return User.findById(id).select('-passwordHash')
}

const save = async (user: IUser): Promise<IUser> => {
  return user.save()
}

export default {
  create,
  findByEmail,
  findById,
  findByIdWithoutPassword,
  save
}