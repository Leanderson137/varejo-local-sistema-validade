import mongoose, { Document, Schema, Types } from 'mongoose'

export interface IProduct extends Document {
  name: string
  sku: string
  barcode?: string
  categoryId: Types.ObjectId
  unitCost: number
  alertDaysBeforeExpiry: number
  createdBy: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Nome é obrigatório'],
      trim: true
    },
    sku: {
      type: String,
      required: [true, 'SKU é obrigatório'],
      unique: true,
      trim: true
    },
    barcode: {
      type: String,
      trim: true
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Categoria é obrigatória']
    },
    unitCost: {
      type: Number,
      required: [true, 'Custo unitário é obrigatório'],
      min: 0
    },
    alertDaysBeforeExpiry: {
      type: Number,
      default: 15,
      min: 1
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

export default mongoose.model<IProduct>('Product', productSchema)