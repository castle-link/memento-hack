import mongoose, { Model } from 'mongoose'
import { OTP_CODE_EXPIRY_MINUTES } from './otp-code.constants'
import { OtpCodeDoc, OtpCodeMethods, OtpCodeModel } from './otp-code.types'
import captainHook from 'captain-hook'
import { clone } from 'lodash'

const OtpCodeSchema = new mongoose.Schema<OtpCodeDoc>(
	{
		code: {
			type: String,
			length: 6,
			required: true,
			default: () =>
				String((Math.random() * 1000000).toFixed(0)).padStart(6, '0'),
			set: (val: string) => val.replaceAll(/[^0-9]/g, ''),
		},
		expiresAt: {
			type: Date,
			default: () => new Date(Date.now() + OTP_CODE_EXPIRY_MINUTES * 60 * 1000),
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
		expires: '1h',
	}
)

OtpCodeSchema.index({ user: 1, createdAt: -1 })

const methods: OtpCodeMethods = {
	expiryMin: () => {
		return OTP_CODE_EXPIRY_MINUTES
	},
	readableCode: function (this: OtpCodeDoc) {
		const code = clone(this.code).split('')

		code.splice(3, 0, ' ')

		return code.join('')
	},
}

OtpCodeSchema.methods = methods

OtpCodeSchema.plugin(captainHook)

// @ts-expect-error: captain-hook not typed
OtpCodeSchema.preCreate(async function (
	doc: OtpCodeDoc,
	next: mongoose.CallbackWithoutResultAndOptionalError
) {
	console.log('checking for exisitng otp codes')
	// count number of OTPs for user that haven't expired yet
	const existingCodes =
		(await (mongoose.models.OTPCode as Maybe<OtpCodeModel>)?.find({
			userId: doc.userId,
			expiresAt: { $gt: new Date() },
		})) || []

	console.log('existingCodes', existingCodes.length)
	if (existingCodes.length >= 3) {
		console.log('maximum codes exeeded, rejecting')
		throw new Error('Maximum number of OTPs reached')
	}
	console.log('creating new otp code')
	next()
})

export const OtpCode = (mongoose.models.OtpCode ||
	mongoose.model('OtpCode', OtpCodeSchema)) as Model<OtpCodeDoc>
