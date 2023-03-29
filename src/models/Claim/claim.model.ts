import mongoose, { ObjectId } from 'mongoose'
import { ClaimDoc, ClaimModel } from './claim.types'

const ClaimSchema = new mongoose.Schema<ClaimDoc, ClaimModel>(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		memento: { type: mongoose.Schema.Types.ObjectId, ref: 'Memento' },
		transaction: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Transaction',
			default: null,
		},
		checkoutSessionId: {
			type: String,
			default: null,
			index: {
				unique: true,
				partialFilterExpression: { checkoutSessionId: { $type: 'string' } },
			},
		},
	},
	{
		timestamps: true,
	}
)

export const Claim = (mongoose.models.Claim ||
	mongoose.model('Claim', ClaimSchema)) as ClaimModel

export default Claim
