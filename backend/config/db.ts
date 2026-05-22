import mongoose from 'mongoose'

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI

    if (!mongoUri) {
      throw new Error('MONGODB_URI não definida no arquivo .env')
    }

    const conn = await mongoose.connect(mongoUri)

    console.log(`MongoDB conectado: ${conn.connection.host}`)
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Erro ao conectar no MongoDB: ${error.message}`)
    } else {
      console.error('Erro desconhecido ao conectar no MongoDB')
    }

    process.exit(1)
  }
}

export default connectDB