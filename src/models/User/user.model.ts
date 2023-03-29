import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { UserDoc, UserMethods, UserModel, UserStatics } from './user.types'
import jwt from 'jsonwebtoken'
import {
	ACCESS_TOKEN_EXPIRY_MINUTES,
	REFRESH_TOKEN_EXPIRY_MINUTES,
} from './user.constants'
import { ServerLogger } from '@/utils/logger/server-logger'
import Token from '../Token/token.model'
import type { DecodedAccessToken } from '@/middleware'
import { OtpCodeModel } from '../OtpCode'
import { escapeRegExp } from 'lodash'
import { Verifier } from '@/lib/web3auth/keys'

const Logger = new ServerLogger()

const UserSchema = new mongoose.Schema<UserDoc, UserModel>(
	{
		name: { type: String },
		bio: { type: String },
		profilePicUrl: { type: String },
		email: {
			type: String,
			lowercase: true,
			trim: true,
			index: {
				unique: true,
				partialFilterExpression: { email: { $type: 'string' } },
			},
		},
		phone: {
			type: String,
			trim: true,
			index: {
				unique: true,
				partialFilterExpression: { phone: { $type: 'string' } },
			},
		},
		eoa: {
			type: String,
			lowercase: true,
			trim: true,
			index: {
				unique: true,
				partialFilterExpression: { eoa: { $type: 'string' } },
			},
		},
		handle: {
			type: String,
			lowercase: true,
			min: 3,
			max: 30,
			index: {
				unique: true,
				partialFilterExpression: { handle: { $type: 'string' } },
			},
		},
		multiSig: { type: String },
		eoaCreated: { type: Boolean, default: false },
		multiSigCreated: { type: Boolean, default: false },
		multiSigTransferred: { type: Boolean, default: false },
		emailVerified: { type: Boolean, default: false },
		phoneVerified: { type: Boolean, default: false },
		merchantAccountId: { type: String, default: null },
		salt: {
			type: String,
			required: true,
			default: () => uuidv4(),
		},
	},
	{
		timestamps: true,
	}
)

const methods: UserMethods = {
	createAccessToken: async function (this: UserDoc) {
		try {
			const { _id, name, bio, profilePicUrl, eoa, handle, multiSig, email } =
				this

			const accessTokenExpiry =
				new Date().getTime() + ACCESS_TOKEN_EXPIRY_MINUTES * 60 * 1000

			const accessToken = jwt.sign(
				{
					user: {
						id: _id.toString(),
						name,
						profilePicUrl,
						eoa,
						handle,
						multiSig,
						email,
					} as DecodedAccessToken['user'],
				},
				process.env.NEXT_PUBLIC_JWT_SECRET, // ACCESS_TOKEN_SECRET
				{
					expiresIn: `${ACCESS_TOKEN_EXPIRY_MINUTES}m`,
				}
			)
			return { accessToken, accessTokenExpiry }
		} catch (error) {
			Logger.error('Error creating access token')
			throw error
		}
	},
	getHandle: function (this: UserDoc) {
		return this.handle || this._id?.toString()
	},
	createRefreshToken: async function (this: UserDoc) {
		const refreshToken = uuidv4()
		const expiresAt =
			new Date().getTime() + REFRESH_TOKEN_EXPIRY_MINUTES * 60 * 1000
		try {
			const { _id } = this
			const refreshTokenData = {
				userId: _id,
				refreshToken,
				expiresAt,
			}
			await Token.create(refreshTokenData)
			return { refreshToken, refreshTokenExpiry: expiresAt }
		} catch (error) {
			Logger.error('Error creating refresh token')
			throw error
		}
	},
	createOtpCode: async function (this: UserDoc) {
		const otpCode = await (mongoose.models.OtpCode as OtpCodeModel)?.create({
			userId: this._id,
		})
		return otpCode
	},
	isValidOtpCode: async function (this: UserDoc, code: string) {
		const parsedCode = code.replaceAll(/[^0-9]/g, '')

		console.log({
			userId: this._id,
			code: parsedCode,
		})

		const [otpCode] = await (mongoose.models.OtpCode as OtpCodeModel)?.find({
			userId: this._id,
			code: parsedCode,
			expiresAt: { $gt: new Date() },
		})

		console.log({ otpCode })

		return !!otpCode
	},
	createMagicLink: async function (this: UserDoc) {
		const verifier = new Verifier()
		const token = await verifier.createSignedJwt({
			sub: this.email,
		})
		const magicLink =
			process.env.NEXT_PUBLIC_APP_URL +
			`/connect/auth?token=${token}&providerIdentifier=${this.email}`
		return magicLink
	},
}

const statics: UserStatics = {
	findByHandle: async function (this: UserModel, handle: string) {
		return this.findOne({
			handle: { $regex: `^${escapeRegExp(handle)}$`, $options: 'i' },
		})
	},
	findByEmail: async function (this: UserModel, email: string) {
		return this.findOne({
			email: { $regex: `^${escapeRegExp(email)}$`, $options: 'i' },
		})
	},
	findByAddress: async function (this: UserModel, address: string) {
		return this.findOne({
			eoa: { $regex: `^${escapeRegExp(address)}$`, $options: 'i' },
		})
	},
}

UserSchema.index({ eoa: 1 }, { collation: { locale: 'en', strength: 2 } })
UserSchema.index({ email: 1 }, { collation: { locale: 'en', strength: 2 } })
UserSchema.index({ handle: 1 }, { collation: { locale: 'en', strength: 2 } })

UserSchema.methods = methods
UserSchema.statics = statics

export const User = (mongoose.models.User ||
	mongoose.model('User', UserSchema)) as UserModel

export default User
