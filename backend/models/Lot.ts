import mongoose, { Document, Schema, Types } from 'mongoose'

export type LotStatus = 'active' | 'expiring_soon' | 'expired' | 'discarded'

export interface ILot extends Document {
  productId: Types.ObjectId
  lotNumber: string
  manufactureDate?: Date
  expirationDate: Date
  quantity: number
  status: LotStatus
  createdAt: Date
  updatedAt: Date
}

const lotSchema = new Schema<ILot>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Produto é obrigatório']
    },
    lotNumber: {
      type: String,
      required: [true, 'Número do lote é obrigatório'],
      trim: true
    },
    manufactureDate: {
      type: Date
    },
    expirationDate: {
      type: Date,
      required: [true, 'Data de validade é obrigatória']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantidade é obrigatória'],
      min: 0
    },
    status: {
      type: String,
      enum: ['active', 'expiring_soon', 'expired', 'discarded'],
      default: 'active'
    }
  },
  { timestamps: true }
)

export default mongoose.model<ILot>('Lot', lotSchema)