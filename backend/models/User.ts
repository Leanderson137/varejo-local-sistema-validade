import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export type UserRole = 'admin' | 'operator'

export interface IUser extends Document {
  name: string
  email: string
  passwordHash: string
  role: UserRole
  active: boolean
  loginAttempts: number
  blockedUntil: Date | null
  createdAt: Date
  updatedAt: Date
  comparePassword(password: string): Promise<boolean>
}

const userSchema = new Schema<IUser>(
  {
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
  },
  { timestamps: true }
)

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash)
}

export default mongoose.model<IUser>('User', userSchema)