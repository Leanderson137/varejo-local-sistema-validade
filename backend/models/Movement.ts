import mongoose, { Document, Schema, Types } from 'mongoose'

export type MovementType = 'entry' | 'exit' | 'adjustment' | 'discard'

export interface IMovement extends Document {
  lotId: Types.ObjectId
  userId: Types.ObjectId
  type: MovementType
  quantity: number
  reason?: string
  movedAt: Date
  createdAt: Date
  updatedAt: Date
}

const movementSchema = new Schema<IMovement>(
  {
    lotId: {
      type: Schema.Types.ObjectId,
      ref: 'Lot',
      required: [true, 'Lote é obrigatório']
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Usuário é obrigatório']
    },
    type: {
      type: String,
      enum: ['entry', 'exit', 'adjustment', 'discard'],
      required: [true, 'Tipo de movimentação é obrigatório']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantidade é obrigatória'],
      min: 1
    },
    reason: {
      type: String,
      trim: true
    },
    movedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

export default mongoose.model<IMovement>('Movement', movementSchema)