import mongoose, { Document, Schema, Types } from 'mongoose'

export type AlertLevel = 'normal' | 'attention' | 'critical'

export interface IAlert extends Document {
  lotId: Types.ObjectId
  level: AlertLevel
  seen: boolean
  triggeredAt: Date
  createdAt: Date
  updatedAt: Date
}

const alertSchema = new Schema<IAlert>(
  {
    lotId: {
      type: Schema.Types.ObjectId,
      ref: 'Lot',
      required: [true, 'Lote é obrigatório']
    },
    level: {
      type: String,
      enum: ['normal', 'attention', 'critical'],
      required: [true, 'Nível do alerta é obrigatório']
    },
    seen: {
      type: Boolean,
      default: false
    },
    triggeredAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

export default mongoose.model<IAlert>('Alert', alertSchema)