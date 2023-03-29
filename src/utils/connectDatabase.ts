import mongoose from 'mongoose'
import { preloadModels } from '../models'

const MONGODB_URI = process.env.MONGO_URI

if (!MONGODB_URI) {
	throw new Error(
		'Please define the MONGODB_URI environment variable inside .env.local'
	)
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null }
}

export const connectDatabase = async () => {
	if (cached.conn) {
		return cached.conn
	}

	if (!cached.promise) {
		const opts = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			bufferCommands: false,
		}

		cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
			return mongoose
		})
	}
	cached.conn = await cached.promise

	preloadModels()
	return cached.conn
}

export default connectDatabase
