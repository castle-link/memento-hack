import { OtpCode } from './OtpCode'
import { User } from './User'
import { Memento } from './Memento'
import { Claim } from './Claim'
import { Token } from './Token'
import { Transaction } from './Transaction/transaction.model'

/**
 * Instatias models onto the mongoose instance
 * this ensures that when mongoose.models.MODE_NAME is called
 * it will always return the model, even if it hasn't yet been used
 * by the application instance
 */
export const preloadModels = () => {
	OtpCode
	User
	Memento
	Claim
	Token
	Transaction
}
